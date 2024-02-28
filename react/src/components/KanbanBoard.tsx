import { useEffect, useState } from "react";
import iKanbanCard from "../types/iKanbanCard";
import KanbanList from "./KanbanList";

const KanbanBoard = () => {
  const cardMap0: Record<string, iKanbanCard> = {
    "1": {
      id: "1",
      title: "Card 1",
      listId: "0",
      completed: true,
      dueDate: "2024-03-15",
      description: "This is a description",
    },
    "2": { id: "2", title: "Card 2", listId: "1", completed: false },
    "3": { id: "3", title: "Card 3", listId: "1", completed: false },
    "4": { id: "4", title: "Card 4", listId: "1", completed: false },
  };

  const cardMap1: Record<string, iKanbanCard> = {
    "5": {
      id: "5",
      title: "Card 5",
      listId: "1",
      completed: false,
      dueDate: "2024-04-15",
      description: "This is another description",
    },
    "6": { id: "6", title: "Card 6", listId: "1", completed: false },
    "7": { id: "7", title: "Card 7", listId: "1", completed: false },
    "8": { id: "8", title: "Card 8", listId: "1", completed: false },
  };

  const kanbanMap: Record<string, Record<string, iKanbanCard>> = {
    0: cardMap0,
    1: cardMap1,
  };

  const [editCardId, setEditCardId] = useState("");
  const [kanbanMapState, setKanbanMapState] = useState(kanbanMap);

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
    return Object.keys(kanbanMapState).map((listId) =>
      Object.keys(kanbanMapState[listId]).map(
        (cardId) => kanbanMapState[listId][cardId]
      )
    );
  };

  const onCardClick = (cardId: string) => {
    setEditCardId(cardId);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setEditCardId("");
    }
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

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

  const onCardAdd = () => {
    console.log("added card");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drop = (e: any) => {
    e.preventDefault();
    console.log("dropped");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allowDrop = (e: any) => {
    e.preventDefault();
    console.log("allow drop");
  };

  const dragEnter = (listId: number) => {
    console.log("drag enter", listId);
  };

  return (
    <div className="p-2">
      <h1>Kanban Board</h1>
      <div className="kanban-board flex">
        {kanbanMapToLists().map((list: iKanbanCard[], index: number) => (
          <KanbanList
            key={index}
            listId={index.toString()}
            listTitle={`List ${index}`}
            cards={list}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            onCardComplete={onCardCompleteMap}
            onCardAdd={onCardAdd}
            drop={drop}
            allowDrop={allowDrop}
            dragEnter={dragEnter}
            editCardId={editCardId}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
