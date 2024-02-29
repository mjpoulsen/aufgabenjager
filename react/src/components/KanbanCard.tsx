type KanbanCardProps = {
  cardId: string;
  listId: string;
  cardTitle: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  onCardClick: (id: string) => void;
  onCardDelete: (id: number, listId: string) => void;
  onCompletedChange: (id: number, listId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allowDrop: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDrag: (e: any, cardId: string) => void;
  editMode: boolean;
};

const KanbanCard = ({
  cardId,
  listId,
  cardTitle,
  description,
  dueDate,
  completed,
  onCardClick,
  onCardDelete,
  onCompletedChange,
  // drop,
  allowDrop,
  // dragEnter,
  onDrag,
  editMode,
}: KanbanCardProps) => {
  return (
    <div
      className="kanban-card flex-col rounded-md bg-gray-100 p-2 m-2"
      onDrag={(e) => onDrag(e, cardId)}
      onDragOver={(e) => allowDrop(e)}
      onClick={() => onCardClick(cardId)}
      draggable={true}
      id={cardId}
    >
      <h3 className="text-black font-bold text-xl px-2">{cardTitle}</h3>
      <div className="flex justify-between">
        <div className="flex p-2">
          <span className="text-gray-500">
            <span>
              <strong>Description</strong>
            </span>
            <br />
            <span className="">{description ? `${description}` : ""}</span>
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
              value={dueDate}
              onChange={(e) => console.log(e)}
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
      {editMode && (
        <button
          className="p-2 m-2"
          onClick={() => {
            onCardDelete(Number(cardId), listId);
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default KanbanCard;
