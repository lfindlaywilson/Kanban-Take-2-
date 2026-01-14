import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { selectFilteredColumns, moveCard, reorderCards } from '../../store/slices/boardSlice';
import Column from '../Column/Column';
import SearchBar from '../SearchBar/SearchBar';
import Card from '../Card/Card';
import './KanbanBoard.scss';

function KanbanBoard() {
  const dispatch = useDispatch();
  const columns = useSelector(selectFilteredColumns);
  const [activeCard, setActiveCard] = useState(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;

    // Find the card being dragged
    for (const column of columns) {
      const card = column.cards.find((c) => c.id === active.id);
      if (card) {
        setActiveCard({ card, columnId: column.id });
        break;
      }
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find source and destination columns
    const activeColumn = columns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );
    const overColumn = columns.find(
      (col) => col.id === overId || col.cards.some((card) => card.id === overId)
    );

    if (!activeColumn || !overColumn) return;

    const activeIndex = activeColumn.cards.findIndex((card) => card.id === activeId);
    let overIndex = overColumn.cards.findIndex((card) => card.id === overId);

    // If over a column (not a card), add to end
    if (overIndex === -1) {
      overIndex = overColumn.cards.length;
    }

    // Move card between columns
    if (activeColumn.id !== overColumn.id) {
      dispatch(
        moveCard({
          sourceColumnId: activeColumn.id,
          destinationColumnId: overColumn.id,
          sourceIndex: activeIndex,
          destinationIndex: overIndex,
        })
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the column containing the active card
    const activeColumn = columns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );

    if (!activeColumn) return;

    const activeIndex = activeColumn.cards.findIndex((card) => card.id === activeId);
    const overIndex = activeColumn.cards.findIndex((card) => card.id === overId);

    // Reorder within the same column
    if (activeIndex !== overIndex && overIndex !== -1) {
      dispatch(
        reorderCards({
          columnId: activeColumn.id,
          startIndex: activeIndex,
          endIndex: overIndex,
        })
      );
    }
  };

  return (
    <div className="kanban-board">
      <div className="kanban-board__header">
        <div className="kanban-board__title-section">
          <h1 className="kanban-board__title">Project Board</h1>
          <p className="kanban-board__subtitle">
            Manage your tasks and track progress
          </p>
        </div>
        <SearchBar />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board__columns">
          {columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="drag-overlay">
              <Card card={activeCard.card} columnId={activeCard.columnId} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
