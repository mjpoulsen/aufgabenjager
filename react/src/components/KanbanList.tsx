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
}: KanbanListProps) => {
  return (
    <div className="kanban-list flex-col grow m-2" id={listId}>
      <h2 className="text-3xl">{listTitle}</h2>
      <div className="kanban-list-cards">
        {cards.map((card: iKanbanCard, index: number) => (
          <div
            key={listId + Math.random()} // todo find a better key
            onDrop={(e) => drop(e)}
            onDragEnter={(e) => dragEnter(e, Number(listId))}
          >
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
          </div>
        ))}
      </div>
      <div
        className="add-card-btn"
        onClick={() => {
          onCardAdd(listId);
        }}
      >
        <span className="plus-sign px-1">+</span>
        <span>Add Item</span>
      </div>
    </div>
  );
};

export default KanbanList;
