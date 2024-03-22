import { useEffect, useState } from "react";
import iKanbanCard from "../types/iKanbanCard";
import KanbanList from "./KanbanList";
import axios from "axios";

type ListResource = {
  title: string;
  display_sequence: string;
};

type TaskResource = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  display_sequence: string;
  list_id: string;
};

const KanbanBoard = () => {
  // todo move to a separate constant file
  const DONE_KEY = 2147483647;

  const emptyKanbanMap: Record<string, Record<string, iKanbanCard>> = {};

  const emptyListNameMap: Record<string, string> = {};

  const [editCardId, setEditCardId] = useState("");
  const [kanbanMapState, setKanbanMapState] = useState(emptyKanbanMap);
  const [dropEnterListId, setDropEnterListId] = useState("");
  const [draggedCardId, setDraggedCardId] = useState("");
  const [listNameMapState, setListNameMapState] = useState(emptyListNameMap);
  const [draggedListId, setDraggedListId] = useState("");

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    axios
      .get("http://localhost:8000/api/board/1/data")
      .then((response) => {
        const data = response.data;

        const lists: Record<string, ListResource> = data.lists;
        const tasks: Record<string, Record<string, TaskResource>> = data.tasks;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tasksMap: Record<string, Record<string, any>> = {};

        const names: Record<string, string> = Object.values(lists).reduce(
          (
            acc: Record<string, string>,
            curr: { display_sequence: string; title: string }
          ) => {
            const display_sequence = Number(curr.display_sequence);
            acc[display_sequence] = curr.title;
            return acc;
          },
          {}
        );

        for (const listId in names) {
          tasksMap[listId] = {};
        }

        for (const listId in tasks) {
          const listTasks = tasks[listId];
          const newListId = Number(listId);

          tasksMap[newListId] = listTasks;
        }

        setKanbanMapState(tasksMap);
        setListNameMapState(names);
      })
      .catch((err) => {
        console.error(err);
      });

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const onCardCompleteMap = (
    id: string,
    listId: keyof typeof kanbanMapState
  ) => {
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

    // If completed, move card to `done` list.
    // if not completed, move card back to original list.
    if (card.completed) {
      delete list[id];
      kanbanMapState[DONE_KEY][id] = card;
      // update original list
      setKanbanMapState({ ...kanbanMapState, [listId]: list });
    } else {
      delete kanbanMapState[DONE_KEY][id];
      kanbanMapState[card.list_id][id] = card;
      // update done list
      setKanbanMapState({ ...kanbanMapState });
    }
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

  const onCardDelete = (id: string, listId: keyof typeof kanbanMapState) => {
    delete kanbanMapState[listId][id];

    setKanbanMapState({ ...kanbanMapState });
  };

  const onCardAdd = (listId: string) => {
    console.log("added card to list", listId);

    const listLength = Object.keys(kanbanMapState[listId]).length + 1;

    const newCard: iKanbanCard = {
      title: `New Card`,
      list_id: listId,
      completed: false,
      display_sequence: listLength,
      due_date: new Date().toJSON().slice(0, 10),
    };

    axios
      .post("http://localhost:8000/api/task", newCard)
      .then((response) => {
        const newCardId = response.data.id;
        newCard.id = newCardId;

        kanbanMapState[listId][newCardId] = newCard;

        setKanbanMapState({ ...kanbanMapState });
      })
      .catch((err) => {
        console.error(err);
      });
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
    listNameMapState[listId as keyof typeof listNameMapState] = title;

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

    card.due_date = dueDate;

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

    const otherCardDisplayOrder = otherCard.display_sequence;

    for (const card of Object.values(kanbanMapState[cardListId])) {
      if (draggedCard.display_sequence >= otherCardDisplayOrder) {
        card.display_sequence += 1;
      } else {
        card.display_sequence -= 1;
      }
    }

    draggedCard.display_sequence = otherCardDisplayOrder;

    if (draggedCardListId !== cardListId) {
      delete kanbanMapState[draggedCardListId][draggedCardId];
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
    return listNameMapState[index.toString() as keyof typeof listNameMapState];
  };

  const addNewList = () => {
    const length = Object.keys(kanbanMapState).length;

    const listNameKey = length.toString() as keyof typeof listNameMapState;
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

  const displayKanbanLists = () => {
    const listsToDisplay = [];
    for (const listId in kanbanMapState) {
      const kanbanMap = kanbanMapState[listId];
      const listIdForTitle = Number(listId);

      listsToDisplay.push(
        <KanbanList
          key={listId}
          listId={listId}
          listTitle={retrieveListTitle(listIdForTitle)}
          cardsMap={kanbanMap}
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
      );
    }

    return listsToDisplay;
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
      <div className="kanban-board flex">{displayKanbanLists()}</div>
    </div>
  );
};

export default KanbanBoard;
