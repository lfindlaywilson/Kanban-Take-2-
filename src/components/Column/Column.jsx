import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from '../Card/Card';
import AddCard from '../AddCard/AddCard';
import './Column.scss';

function Column({ column }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const cardIds = column.cards.map((card) => card.id);

  return (
    <div className="column">
      <div className="column__header">
        <div className="column__title-wrapper">
          <h3 className="column__title">{column.title}</h3>
          <span className="column__count">{column.cards.length}</span>
        </div>
      </div>

      <div className="column__content" ref={setNodeRef}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <div className="column__cards">
            {column.cards.length === 0 ? (
              <div className="column__empty">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                </svg>
                <p>No cards yet</p>
              </div>
            ) : (
              column.cards.map((card) => <Card key={card.id} card={card} columnId={column.id} />)
            )}
          </div>
        </SortableContext>

        <div className="column__add-card">
          <AddCard columnId={column.id} />
        </div>
      </div>
    </div>
  );
}

export default Column;
