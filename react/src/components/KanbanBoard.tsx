import { useEffect, useState } from "react";
import iKanbanCard from "../types/iKanbanCard";
import KanbanList from "./KanbanList";

const KanbanBoard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      displayOrder: 5,
    },
    "6": {
      id: "6",
      title: "Card 6",
      listId: "1",
      completed: false,
      displayOrder: 6,
    },
    "7": {
      id: "7",
      title: "Card 7",
      listId: "1",
      completed: false,
      displayOrder: 7,
    },
    "8": {
      id: "8",
      title: "Card 8",
      listId: "1",
      completed: false,
      displayOrder: 8,
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

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const onCardCompleteMap = (id: number, listId: keyof typeof kanbanMap) => {
    const list = kanbanMapState[listId];

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
    setKanbanMapState({ ...kanbanMapState, [listId]: list });
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

  const onCardDelete = (id: number, listId: keyof typeof kanbanMap) => {
    console.log("deleted card", id);

    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    setEditCardId("");

    delete list[id];

    setKanbanMapState({ ...kanbanMapState, [listId]: list });
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drop = (e: any) => {
    e.preventDefault();
    // console.log(draggedCardId + " dropped in " + dropEnterListId + " list");

    const originalListId = findListIdFromCardId(draggedCardId);
    // console.log("original list id", originalListId);

    if (originalListId === dropEnterListId) {
      console.debug("same list");
      return;
    } else if (dropEnterListId === "") {
      console.debug("no list");
      return;
    }

    const card = kanbanMapState[originalListId][draggedCardId];

    kanbanMapState[dropEnterListId][draggedCardId] = card;

    delete kanbanMapState[originalListId][draggedCardId];

    setKanbanMapState({ ...kanbanMapState });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dropReorder = (e: any, cardId: string) => {
    e.preventDefault();
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

    const temp = draggedCard.displayOrder;
    draggedCard.displayOrder = otherCard.displayOrder;
    otherCard.displayOrder = temp;

    setKanbanMapState({ ...kanbanMapState });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dragEnter = (e: any, listId: number) => {
    e.preventDefault();
    console.debug("drag enter", listId);
    setDropEnterListId(listId.toString());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrag = (e: any, cardId: string) => {
    e.preventDefault();
    console.debug("drag", cardId);
    setDraggedCardId(cardId);
  };

  const retrieveListTitle = (index: number) => {
    const listLength = Object.keys(listNameMapState).length;

    if (listLength - 1 === index) {
      return listNameMapState.DONE_KEY as string;
    }

    return listNameMapState[index as keyof typeof listNameMap];
  };

  return (
    <div className="p-2">
      <h1>Kanban Board</h1>
      <div className="kanban-board flex">
        {kanbanMapToLists().map((list: iKanbanCard[], index: number) => (
          <KanbanList
            key={index}
            listId={index.toString()}
            listTitle={retrieveListTitle(index)}
            cards={list}
            editCardId={editCardId}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            onCardComplete={onCardCompleteMap}
            onCardAdd={onCardAdd}
            drop={drop}
            dragEnter={dragEnter}
            onDrag={onDrag}
            dropReorder={dropReorder}
            editCardTitle={editCardTitle}
            editCardDescription={editCardDescription}
            editDueDate={editDueDate}
            editListTitle={editListTitle}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
