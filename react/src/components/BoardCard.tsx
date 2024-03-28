import { useEffect, useState } from "react";

type BoardCardProps = {
  title: string;
  boardId: number;
  editMode: boolean;
  onCardClick: (id: number) => void;
  editCardTitle: (boardId: number, title: string) => void;
  onCardOpen: () => void;
  onCardDelete: () => void;
};

const BoardCard = ({
  title,
  boardId,
  editMode,
  onCardClick,
  editCardTitle,
  onCardOpen,
  onCardDelete,
}: BoardCardProps) => {
  const [titleState, setTitle] = useState(title);
  const [editModeState, setEditMode] = useState(editMode);

  useEffect(() => {
    setTitle(title);
    setEditMode(editMode);
  }, [title, editMode]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const renderTitle = () => {
    if (editModeState) {
      return (
        <input
          className="text-black font-bold text-xl px-2 bg-gray-100"
          type="text"
          value={titleState}
          onChange={handleTitleChange}
          onBlur={() => {
            editCardTitle(boardId, titleState);
          }}
        />
      );
    }

    return <h3 className="text-black font-bold text-xl px-2">{titleState}</h3>;
  };

  const renderOpenButton = () => {
    if (editModeState) {
      return (
        <button
          className="p-2 m-2"
          onClick={() => {
            onCardOpen();
          }}
        >
          Open
        </button>
      );
    }
  };

  const renderDeleteButton = () => {
    if (editModeState) {
      return (
        <button
          className="p-2 m-2"
          onClick={() => {
            onCardDelete();
          }}
        >
          Delete
        </button>
      );
    }
  };

  return (
    <div
      className="board-card flex-col rounded-md bg-gray-100 p-2 m-2"
      onClick={() => onCardClick(boardId)}
    >
      <div>{renderTitle()}</div>
      <div>
        {renderOpenButton()}
        {renderDeleteButton()}
      </div>
    </div>
  );
};

export default BoardCard;
