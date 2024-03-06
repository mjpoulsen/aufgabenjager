import { useState } from "react";

type KanbanCardProps = {
  cardId: string;
  listId: string;
  cardTitle: string;
  description: string;
  dueDate: string;
  completed: boolean;
  editMode: boolean;
  onCardClick: (id: string) => void;
  onCardDelete: (id: number, listId: string) => void;
  onCompletedChange: (id: number, listId: string) => void;
  onDrag: (e: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  dropReorder: (e: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  editCardTitle: (cardId: string, title: string) => void;
  editCardDescription: (cardId: string, description: string) => void;
  editDueDate: (cardId: string, dueDate: string) => void;
};

const KanbanCard = ({
  cardId,
  listId,
  cardTitle,
  description,
  dueDate,
  completed,
  editMode,
  onCardClick,
  onCardDelete,
  onCompletedChange,
  onDrag,
  dropReorder,
  editCardTitle,
  editCardDescription,
  editDueDate,
}: KanbanCardProps) => {
  const [title, setTitle] = useState(cardTitle);
  const [descriptionState, setDescription] = useState(description);
  const [dueDateState, setDueDate] = useState(dueDate);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDescription(e.target.value);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const canEdit = () => {
    return editMode && !completed;
  };

  const renderTitle = () => {
    if (canEdit()) {
      return (
        <input
          className="text-black font-bold text-xl px-2 bg-gray-100"
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={() => {
            editCardTitle(cardId, title);
          }}
        />
      );
    }

    return <h3 className="text-black font-bold text-xl px-2">{cardTitle}</h3>;
  };

  const renderDescription = () => {
    if (canEdit()) {
      return (
        <input
          className="bg-gray-100 border-b-2 border-gray-500 flex-grow w-full"
          type="text"
          value={descriptionState}
          onChange={handleDescriptionChange}
          onBlur={() => {
            editCardDescription(cardId, descriptionState);
          }}
        />
      );
    }

    return <span className="">{description ? `${description}` : ""}</span>;
  };

  const renderDeleteButton = () => {
    if (editMode) {
      return (
        <button
          className="p-2 m-2"
          onClick={() => {
            onCardDelete(Number(cardId), listId);
          }}
        >
          Delete
        </button>
      );
    }
  };

  return (
    <div
      className="kanban-card flex-col rounded-md bg-gray-100 p-2 m-2"
      onDrag={(e) => onDrag(e, cardId)}
      onDrop={(e) => dropReorder(e, cardId)}
      onClick={() => onCardClick(cardId)}
      draggable={true}
      id={cardId}
    >
      <div>{renderTitle()}</div>
      <div className="flex justify-between">
        <div className="flex-grow w-full p-2">
          <span className="text-gray-500">
            <span>
              <strong>Description</strong>
            </span>
            <br />
            {renderDescription()}
          </span>
        </div>
        <div className="flex-col text-gray-500">
          <div className="flex-col px-2 my-1">
            <span>
              <strong>Due Date</strong>
            </span>
            <br />
            <input
              className="bg-gray-100 border-b-2 border-gray-500"
              type="date"
              value={dueDateState}
              onChange={handleDueDateChange}
              onBlur={(e) => {
                e.preventDefault();
                editDueDate(cardId, dueDateState);
              }}
              name="dueDate"
              id="dueDate"
              placeholder={"yyyy-mm-dd"}
            />
          </div>
          <div className="flex-col px-2">
            <span className="">
              <label className="font-bold">
                <span>Completed</span>
                <input
                  className="m-2"
                  type="checkbox"
                  checked={completed}
                  onChange={() => {
                    if (editMode) onCompletedChange(Number(cardId), listId);
                  }}
                />
              </label>
            </span>
          </div>
        </div>
      </div>
      {renderDeleteButton()}
    </div>
  );
};

export default KanbanCard;
