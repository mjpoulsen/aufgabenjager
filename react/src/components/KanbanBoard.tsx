import { useEffect, useState } from "react";
import iKanbanCard from "../types/iKanbanCard";
import KanbanList from "./KanbanList";

const KanbanBoard = () => {
  const cardsList1: iKanbanCard[] = [
    { id: "1", title: "Card 1", listId: "1" },
    { id: "2", title: "Card 2", listId: "1" },
    { id: "3", title: "Card 3", listId: "1" },
    { id: "4", title: "Card 4", listId: "1" },
  ];

  const cardsList2: iKanbanCard[] = [
    { id: "5", title: "Card 1", listId: "2" },
    { id: "6", title: "Card 2", listId: "2" },
    { id: "7", title: "Card 3", listId: "2" },
    { id: "8", title: "Card 4", listId: "2" },
  ];

  const lists: iKanbanCard[][] = [cardsList1, cardsList2];

  const [editCardId, setEditCardId] = useState("");

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

  const onCardDelete = (id: string) => {
    console.log("deleted card", id);
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
    <div>
      <h1>Kanban Board</h1>
      <div className="kanban-board flex">
        {lists.map((list: iKanbanCard[], index: number) => (
          <KanbanList
            key={index}
            listId={index.toString()}
            listTitle={`List ${index}`}
            cards={list}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
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
