import { useEffect, useState } from "react";
import iKanbanCard from "../types/iKanbanCard";
import KanbanList from "./KanbanList";

const KanbanBoard = () => {
  const DONE_KEY = Number.MAX_SAFE_INTEGER;

  const cardMap0: Record<string, iKanbanCard> = {
    "1": {
      id: "1",
      title: "Card 1",
      listId: "0",
      completed: true,
      dueDate: "2024-03-15",
      description: "This is a description",
      displayOrder: 1,
    },
    "2": {
      id: "2",
      title: "Card 2",
      listId: "1",
      completed: false,
      displayOrder: 2,
    },
    "3": {
      id: "3",
      title: "Card 3",
      listId: "1",
      completed: false,
      displayOrder: 3,
    },
    "4": {
      id: "4",
      title: "Card 4",
      listId: "1",
      completed: false,
      displayOrder: 4,
    },
  };

  const cardMap1: Record<string, iKanbanCard> = {
    "5": {
      id: "5",
      title: "Card 5",
      listId: "1",
      completed: false,
      dueDate: "2024-04-15",
      description: "This is another description",
      displayOrder: 1,
    },
    "6": {
      id: "6",
      title: "Card 6",
      listId: "1",
      completed: false,
      displayOrder: 2,
    },
    "7": {
      id: "7",
      title: "Card 7",
      listId: "1",
      completed: false,
      displayOrder: 3,
    },
    "8": {
      id: "8",
      title: "Card 8",
      listId: "1",
      completed: false,
      displayOrder: 4,
    },
  };

  const doneMap: Record<string, iKanbanCard> = {};

  const kanbanMap: Record<string, Record<string, iKanbanCard>> = {
    0: cardMap0,
    1: cardMap1,
    DONE_KEY: doneMap,
  };

  const listNameMap = {
    0: "List 0",
    1: "List 1",
    DONE_KEY: "Done",
  };

  const [editCardId, setEditCardId] = useState("");
  const [kanbanMapState, setKanbanMapState] = useState(kanbanMap);
  const [dropEnterListId, setDropEnterListId] = useState("");
  const [draggedCardId, setDraggedCardId] = useState("");
  const [listNameMapState, setListNameMapState] = useState(listNameMap);
  const [draggedListId, setDraggedListId] = useState("");

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const onCardCompleteMap = (id: string, listId: keyof typeof kanbanMap) => {
    let list;

    if (listId === DONE_KEY.toString()) {
      list = kanbanMapState.DONE_KEY;
    } else {
      list = kanbanMapState[listId];
    }

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    const card = list[id];

    if (!card) {
      console.log(id, "id not found");
      return;
    }

    card.completed = !card.completed;

    // If completed, move card to `done` list.
    // if not completed, move card back to original list.
    if (card.completed) {
      delete list[id];
      kanbanMapState.DONE_KEY[id] = card;
      // update original list
      setKanbanMapState({ ...kanbanMapState, [listId]: list });
    } else {
      delete kanbanMapState.DONE_KEY[id];
      kanbanMapState[card.listId][id] = card;
      // update done list
      setKanbanMapState({ ...kanbanMapState });
    }
  };

  const kanbanMapToLists = () => {
    const lists = Object.keys(kanbanMapState).map((listId) =>
      Object.keys(kanbanMapState[listId]).map(
        (cardId) => kanbanMapState[listId][cardId]
      )
    );

    const numOfLists = lists.length;

    for (let i = 0; i < numOfLists; i++) {
      lists[i].sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return lists;
  };

  const findListIdFromCardId = (cardId: string) => {
    for (const listId of Object.keys(kanbanMapState)) {
      if (kanbanMapState[listId][cardId]) {
        return listId;
      }
    }
    return "";
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setEditCardId("");
    }
  };

  const onCardClick = (cardId: string) => {
    setEditCardId(cardId);
  };

  const onCardDelete = (id: string, listId: keyof typeof kanbanMap) => {
    delete kanbanMapState[listId][id];

    setKanbanMapState({ ...kanbanMapState });
  };

  const onCardAdd = (listId: string) => {
    console.log("added card to list", listId);
    // temp id -- will be replaced with uuid once integrated with backend
    const newCardId = `${Math.floor(Math.random() * (100 - 10 + 1) + 10)}`;

    const newCard: iKanbanCard = {
      id: newCardId,
      title: `Card ${newCardId}`,
      listId: listId,
      completed: false,
      displayOrder: Number.MAX_SAFE_INTEGER,
    };

    kanbanMapState[listId][newCardId] = newCard;

    setKanbanMapState({ ...kanbanMapState });
  };

  const editCardTitle = (cardId: string, title: string) => {
    const listId = findListIdFromCardId(cardId);

    if (listId === "") {
      console.log("list id not found");
      return;
    }

    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    const card = list[cardId];

    if (!card) {
      console.log(cardId, "card id not found");
      return;
    }

    card.title = title;

    setKanbanMapState({ ...kanbanMapState, [listId]: list });
  };

  const editListTitle = (listId: string, title: string) => {
    listNameMapState[Number(listId) as keyof typeof listNameMap] = title;

    setListNameMapState({ ...listNameMapState });
  };

  const editCardDescription = (cardId: string, description: string) => {
    const listId = findListIdFromCardId(cardId);

    if (listId === "") {
      console.log("list id not found");
      return;
    }

    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    const card = list[cardId];

    if (!card) {
      console.log(cardId, "card id not found");
      return;
    }

    card.description = description;

    setKanbanMapState({ ...kanbanMapState, [listId]: list });
  };

  const editDueDate = (cardId: string, dueDate: string) => {
    const listId = findListIdFromCardId(cardId);

    if (listId === "") {
      console.log("list id not found");
      return;
    }

    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    const card = list[cardId];

    if (!card) {
      console.log(cardId, "card id not found");
      return;
    }

    card.dueDate = dueDate;

    setKanbanMapState({ ...kanbanMapState, [listId]: list });
  };

  const onListDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    console.debug("dragged list id", draggedListId);
    console.debug("drop enter list id", dropEnterListId);

    if (!draggedListId || !dropEnterListId) {
      console.debug("dragged list id or drop enter list id not found");
      return;
    }

    const tempList = kanbanMapState[draggedListId];
    const dropEnterList = kanbanMapState[dropEnterListId];

    kanbanMapState[draggedListId] = dropEnterList;
    kanbanMapState[dropEnterListId] = tempList;

    const tempName =
      listNameMapState[draggedListId as keyof typeof listNameMapState];
    const dropEnterName =
      listNameMapState[dropEnterListId as keyof typeof listNameMapState];

    listNameMapState[draggedListId as keyof typeof listNameMapState] =
      dropEnterName;
    listNameMapState[dropEnterListId as keyof typeof listNameMapState] =
      tempName;

    setListNameMapState({ ...listNameMapState });
    setKanbanMapState({ ...kanbanMapState });
  };

  const dropCardReorder = (
    e: React.DragEvent<HTMLDivElement>,
    cardId: string
  ) => {
    e.stopPropagation();
    const draggedCardListId = findListIdFromCardId(draggedCardId);
    const cardListId = findListIdFromCardId(cardId);

    if (!draggedCardListId) {
      console.log("dragged list id not found");
      return;
    } else if (!cardListId) {
      console.log("card list id not found");
      return;
    }

    const draggedCard = kanbanMapState[draggedCardListId][draggedCardId];
    const otherCard = kanbanMapState[cardListId][cardId];

    // if the card is dragged within the same list
    if (draggedCardListId === cardListId) {
      let temp = draggedCard.displayOrder;

      // A bit of a hack to ensure the display orders do not collide
      // because the display order can be the same if a card was in
      // another list and moved to the current list.
      // Not sure if it makes sense to update the display order of
      // all cards (might take a performance hit), but that might
      // be a better solution.
      if (temp === otherCard.displayOrder) {
        temp += 0.5;
      }

      draggedCard.displayOrder = otherCard.displayOrder;
      otherCard.displayOrder = temp;
    } else {
      kanbanMapState[cardListId][draggedCardId] = draggedCard;
    }

    setDraggedCardId("");
    setKanbanMapState({ ...kanbanMapState });
  };

  const onCardDrag = (e: React.DragEvent<HTMLDivElement>, cardId: string) => {
    e.stopPropagation();
    console.debug("drag", cardId);
    setDraggedCardId(cardId);
  };

  const dragEnterList = (
    e: React.DragEvent<HTMLDivElement>,
    listId: string
  ) => {
    e.preventDefault();
    console.debug("drag enter", listId);
    setDropEnterListId(listId);
  };

  const onListDrag = (e: React.DragEvent<HTMLDivElement>, listId: string) => {
    e.preventDefault();
    console.debug("list drag", listId);
    setDraggedListId(listId);
  };

  const retrieveListTitle = (index: number) => {
    const listLength = Object.keys(listNameMapState).length;

    if (listLength - 1 === index) {
      return listNameMapState.DONE_KEY as string;
    }

    return listNameMapState[index as keyof typeof listNameMap];
  };

  const retrieveListIndex = (index: number) => {
    const listLength = Object.keys(listNameMapState).length;

    if (listLength - 1 === Number(index)) {
      return DONE_KEY;
    }

    return index;
  };

  const addNewList = () => {
    const length = Object.keys(kanbanMapState).length - 1;

    const listNameKey = length as keyof typeof listNameMapState;
    listNameMapState[listNameKey] = `List ${length}`;

    setListNameMapState({ ...listNameMapState });
    setKanbanMapState({ ...kanbanMapState, [length]: {} });
  };

  const onDeleteList = (listId: string) => {
    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    delete kanbanMapState[listId];
    delete listNameMapState[listId as keyof typeof listNameMapState];

    setKanbanMapState({ ...kanbanMapState });
  };

  return (
    <div className="p-2">
      <div>
        <h1>Kanban Board</h1>
        <div
          className="add-list-btn max-w-20"
          onClick={() => {
            addNewList();
          }}
        >
          <span className="plus-sign px-1">+</span>
          <span>Add List</span>
        </div>
      </div>
      <div className="kanban-board flex">
        {kanbanMapToLists().map((list: iKanbanCard[], index: number) => (
          <KanbanList
            key={index}
            listId={retrieveListIndex(index).toString()}
            listTitle={retrieveListTitle(index)}
            cards={list}
            editCardId={editCardId}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            onCardComplete={onCardCompleteMap}
            onCardAdd={onCardAdd}
            onListDrop={onListDrop}
            dragEnterList={dragEnterList}
            onListDrag={onListDrag}
            onCardDrag={onCardDrag}
            dropCardReorder={dropCardReorder}
            editCardTitle={editCardTitle}
            editCardDescription={editCardDescription}
            editDueDate={editDueDate}
            editListTitle={editListTitle}
            onDeleteList={onDeleteList}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
