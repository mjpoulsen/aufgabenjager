import { useEffect, useState } from "react";
import iKanbanCard from "../types/iKanbanCard";
import KanbanCard from "./KanbanCard";

type KanbanListProps = {
  listId: string;
  listTitle: string;
  cards: iKanbanCard[];
  editCardId: string;
  onCardClick: (cardId: string) => void;
  onCardDelete: (cardId: number, listId: string) => void;
  onCardComplete: (cardId: number, listId: string) => void;
  onCardAdd: (listId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drop: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragEnter: (e: any, listId: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDrag: (e: any, cardId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dropReorder: (e: any, cardId: string) => void;
  editCardTitle: (cardId: string, title: string) => void;
  editCardDescription: (cardId: string, description: string) => void;
  editDueDate: (cardId: string, dueDate: string) => void;
  editListTitle: (listId: string, title: string) => void;
  onDeleteList: (listId: string) => void;
};

const KanbanList = ({
  listId,
  listTitle,
  cards,
  editCardId,
  onCardClick,
  onCardDelete,
  onCardComplete,
  onCardAdd,
  drop,
  dragEnter,
  onDrag,
  dropReorder,
  editCardTitle,
  editCardDescription,
  editDueDate,
  editListTitle,
  onDeleteList,
}: KanbanListProps) => {
  const [title, setTitle] = useState(listTitle);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setTitle(listTitle);
  }, [listTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const notDoneList = Number(listId) !== Number.MAX_SAFE_INTEGER;

  const listOnDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (notDoneList) {
      dragEnter(e, Number(listId));
    }
  };

  const listOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (notDoneList) {
      drop(e);
    }
  };

  const renderTitle = () => {
    if (editMode) {
      return (
        <input
          className="text-black font-bold text-xl px-2 bg-gray-100"
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={() => {
            editListTitle(listId, title);
            setEditMode(false);
          }}
        />
      );
    }

    return (
      <div className="list-title flex grow w-full">
        <h2
          className="text-3xl"
          onClick={(e) => {
            e.preventDefault();
            notDoneList ? setEditMode(true) : setEditMode(false);
          }}
        >
          {title}
        </h2>
        <div></div>
      </div>
    );
  };

  const renderAddItemButton = () => {
    if (notDoneList) {
      return (
        <div
          className="add-card-btn"
          onClick={() => {
            onCardAdd(listId);
          }}
        >
          <span className="plus-sign px-1">+</span>
          <span>Add Item</span>
        </div>
      );
    }
  };

  const renderDeleteListButton = () => {
    if (notDoneList) {
      return (
        <div>
          <span
            className="cross-sign flex px-1 bg-white-500"
            onClick={() => {
              onDeleteList(listId);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 64 64"
              id="Delete"
            >
              <path
                d="M17.586 46.414c.391.391.902.586 1.414.586s1.023-.195 1.414-.586L32 34.828l11.586 11.586c.391.391.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828L34.828 32l11.586-11.586a2 2 0 1 0-2.828-2.828L32 29.172 20.414 17.586a2 2 0 1 0-2.828 2.828L29.172 32 17.586 43.586a2 2 0 0 0 0 2.828z"
                fill="#ffffff"
                className="color000000 svgShape"
              ></path>
              <path
                d="M32 64c8.547 0 16.583-3.329 22.626-9.373C60.671 48.583 64 40.547 64 32s-3.329-16.583-9.374-22.626C48.583 3.329 40.547 0 32 0S15.417 3.329 9.374 9.373C3.329 15.417 0 23.453 0 32s3.329 16.583 9.374 22.626C15.417 60.671 23.453 64 32 64zM12.202 12.202C17.49 6.913 24.521 4 32 4s14.51 2.913 19.798 8.202C57.087 17.49 60 24.521 60 32s-2.913 14.51-8.202 19.798C46.51 57.087 39.479 60 32 60s-14.51-2.913-19.798-8.202C6.913 46.51 4 39.479 4 32s2.913-14.51 8.202-19.798z"
                fill="#ffffff"
                className="color000000 svgShape"
              ></path>
            </svg>
          </span>
        </div>
      );
    }
  };

  return (
    <div
      className="kanban-list flex-col grow m-2 bg-slate-500 rounded-lg shadow-lg p-2"
      id={listId + Math.random()}
      onDrop={(e) => listOnDrop(e)}
      onDragEnter={(e) => listOnDragEnter(e)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex justify-between mx-2">
        {renderTitle()}
        {renderDeleteListButton()}
      </div>
      <div className="kanban-list-cards grow">
        {cards.map((card: iKanbanCard, index: number) => (
          <KanbanCard
            key={index}
            cardId={card.id}
            listId={listId}
            cardTitle={card.title}
            description={card.description || ""}
            dueDate={card.dueDate || ""}
            completed={card.completed}
            editMode={editCardId === card.id}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            onCompletedChange={onCardComplete}
            onDrag={onDrag}
            dropReorder={dropReorder}
            editCardTitle={editCardTitle}
            editCardDescription={editCardDescription}
            editDueDate={editDueDate}
          />
        ))}
      </div>
      {renderAddItemButton()}
    </div>
  );
};

export default KanbanList;
