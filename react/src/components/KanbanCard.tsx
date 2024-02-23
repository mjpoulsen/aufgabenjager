type KanbanCardProps = {
  cardId: string;
  cardTitle: string;
  onCardClick: (id: string) => void;
  onCardDelete: (id: string) => void;
  // todo: these events may cause issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drop: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allowDrop: (e: any) => void;
  dragEnter: (listId: number) => void;
  editMode: boolean;
};

const KanbanCard = ({
  cardId,
  cardTitle,
  onCardClick,
  onCardDelete,
  drop,
  allowDrop,
  dragEnter,
  editMode,
}: KanbanCardProps) => {
  return (
    <div
      className="kanban-card flex-col rounded-md bg-gray-100 p-2 m-2"
      onDrop={(e) => drop(e)}
      onDragOver={(e) => allowDrop(e)}
      onDragEnter={() => dragEnter(0)} // todo check this value...
      onClick={() => onCardClick(cardId)}
      draggable={true}
      id={cardId}
    >
      <h3 className="text-black">{cardTitle}</h3>
      {editMode && (
        <button className="p-2 m-2" onClick={() => onCardDelete(cardId)}>
          Delete
        </button>
      )}
    </div>
  );
};

export default KanbanCard;
