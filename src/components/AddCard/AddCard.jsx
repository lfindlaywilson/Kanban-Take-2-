import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCard } from '../../store/slices/boardSlice';
import './AddCard.scss';

const TAG_COLORS = [
  { id: 'green', label: 'Green', color: '#00ff88' },
  { id: 'blue', label: 'Blue', color: '#00d9ff' },
  { id: 'purple', label: 'Purple', color: '#a855f7' },
  { id: 'pink', label: 'Pink', color: '#ff00aa' },
  { id: 'orange', label: 'Orange', color: '#ff9500' },
  { id: 'red', label: 'Red', color: '#ff3b5c' },
];

function AddCard({ columnId }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState('green');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(
        addCard({
          columnId,
          title: title.trim(),
          notes: notes.trim(),
          color: selectedColor,
          tags: [],
        })
      );
      // Reset form
      setTitle('');
      setNotes('');
      setSelectedColor('green');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setNotes('');
    setSelectedColor('green');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) {
    return (
      <button className="add-card-trigger" onClick={() => setIsOpen(true)}>
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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add Card</span>
      </button>
    );
  }

  return (
    <form className="add-card" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-card__title"
        placeholder="Card title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <textarea
        className="add-card__notes"
        placeholder="Add notes (optional)..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
      />

      <div className="add-card__colors">
        <span className="add-card__colors-label">Color:</span>
        <div className="add-card__color-options">
          {TAG_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`add-card__color ${selectedColor === color.id ? 'active' : ''}`}
              onClick={() => setSelectedColor(color.id)}
              style={{ '--color': color.color }}
              aria-label={color.label}
              title={color.label}
            >
              {selectedColor === color.id && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="add-card__actions">
        <button type="submit" className="btn btn-sm btn-primary" disabled={!title.trim()}>
          Add Card
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      <p className="add-card__hint">
        Press <kbd>Ctrl+Enter</kbd> to add or <kbd>Esc</kbd> to cancel
      </p>
    </form>
  );
}

export default AddCard;
