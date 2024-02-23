import iKanbanCard from "../types/iKanbanCard";
import KanbanCard from "./KanbanCard";

type KanbanListProps = {
  listId: string;
  listTitle: string;
  cards: iKanbanCard[];
  onCardClick: (cardId: string) => void;
  onCardDelete: (cardId: string) => void;
  onCardAdd: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drop: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allowDrop: (e: any) => void;
  dragEnter: (listId: number) => void;
  editCardId: string;
};

const KanbanList = ({
  listId,
  listTitle,
  cards,
  onCardClick,
  onCardDelete,
  onCardAdd,
  drop,
  allowDrop,
  dragEnter,
  editCardId,
}: KanbanListProps) => {
  return (
    <div className="kanban-list flex-col grow" id={listId}>
      <h2>{listTitle}</h2>
      <div className="kanban-list-cards">
        {cards.map((card: iKanbanCard, index: number) => (
          <KanbanCard
            key={index}
            cardId={card.id}
            cardTitle={card.title}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            drop={drop}
            allowDrop={allowDrop}
            dragEnter={dragEnter}
            editMode={editCardId === card.id}
          />
        ))}
      </div>
      <div className="add-btn-group">
        <div
          className="add-btn"
          onClick={() => {
            onCardAdd();
            console.log("clicked add item");
          }}
        >
          <span className="plus-sign">+</span>
          <span>Add Item</span>
        </div>
      </div>
    </div>
  );
};

export default KanbanList;
