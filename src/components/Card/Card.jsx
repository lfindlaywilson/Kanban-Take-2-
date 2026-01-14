import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { updateCard, deleteCard } from '../../store/slices/boardSlice';
import './Card.scss';

const TAG_COLORS = {
  green: '#00ff88',
  blue: '#00d9ff',
  purple: '#a855f7',
  pink: '#ff00aa',
  orange: '#ff9500',
  red: '#ff3b5c',
};

function Card({ card, columnId }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedNotes, setEditedNotes] = useState(card.notes);
  const [showFullNotes, setShowFullNotes] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--tag-color': TAG_COLORS[card.color] || TAG_COLORS.green,
  };

  const handleSave = () => {
    if (editedTitle.trim()) {
      dispatch(
        updateCard({
          columnId,
          cardId: card.id,
          updates: {
            title: editedTitle.trim(),
            notes: editedNotes.trim(),
          },
        })
      );
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(card.title);
    setEditedNotes(card.notes);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      dispatch(deleteCard({ columnId, cardId: card.id }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? 'dragging' : ''} ${isEditing ? 'editing' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="card__color-bar" />

      {isEditing ? (
        <div className="card__edit-form">
          <input
            type="text"
            className="card__edit-title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Card title..."
            autoFocus
          />
          <textarea
            className="card__edit-notes"
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add notes..."
            rows={3}
          />
          <div className="card__edit-actions">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-sm btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card__header">
            <h4 className="card__title">{card.title}</h4>
            <div className="card__actions">
              <button
                className="card__action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                aria-label="Edit card"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                className="card__action-btn card__action-btn--delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                aria-label="Delete card"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </div>

          {card.notes && (
            <div className="card__notes-wrapper">
              <p className={`card__notes ${showFullNotes ? 'expanded' : ''}`}>
                {card.notes}
              </p>
              {card.notes.length > 100 && (
                <button
                  className="card__notes-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullNotes(!showFullNotes);
                  }}
                >
                  {showFullNotes ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}

          <div className="card__footer">
            <div className="card__color-indicator" />
            <span className="card__timestamp">
              {new Date(card.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
