import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Load from localStorage or use default
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('kanbanBoard');
    if (serializedState === null) {
      return {
        columns: [
          {
            id: 'col-1',
            title: 'TODO',
            cards: [],
          },
          {
            id: 'col-2',
            title: 'In Progress',
            cards: [],
          },
          {
            id: 'col-3',
            title: 'Completed',
            cards: [],
          },
        ],
        searchQuery: '',
        activeTag: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return {
      columns: [
        {
          id: 'col-1',
          title: 'TODO',
          cards: [],
        },
        {
          id: 'col-2',
          title: 'In Progress',
          cards: [],
        },
        {
          id: 'col-3',
          title: 'Completed',
          cards: [],
        },
      ],
      searchQuery: '',
      activeTag: null,
    };
  }
};

const initialState = loadState();

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // Column Actions
    addColumn: (state, action) => {
      const newColumn = {
        id: uuidv4(),
        title: action.payload.title || 'New Column',
        cards: [],
      };
      state.columns.push(newColumn);
      saveState(state);
    },

    updateColumn: (state, action) => {
      const { columnId, title } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.title = title;
        saveState(state);
      }
    },

    deleteColumn: (state, action) => {
      state.columns = state.columns.filter((col) => col.id !== action.payload);
      saveState(state);
    },

    reorderColumns: (state, action) => {
      const { startIndex, endIndex } = action.payload;
      const [removed] = state.columns.splice(startIndex, 1);
      state.columns.splice(endIndex, 0, removed);
      saveState(state);
    },

    // Card Actions
    addCard: (state, action) => {
      const { columnId, title, notes, color, tags } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        const newCard = {
          id: uuidv4(),
          title: title || 'Untitled',
          notes: notes || '',
          color: color || 'green',
          tags: tags || [],
          subtasks: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        column.cards.push(newCard);
        saveState(state);
      }
    },

    updateCard: (state, action) => {
      const { columnId, cardId, updates } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        const card = column.cards.find((c) => c.id === cardId);
        if (card) {
          Object.assign(card, updates, { updatedAt: Date.now() });
          saveState(state);
        }
      }
    },

    deleteCard: (state, action) => {
      const { columnId, cardId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        column.cards = column.cards.filter((card) => card.id !== cardId);
        saveState(state);
      }
    },

    moveCard: (state, action) => {
      const {
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
      } = action.payload;

      const sourceColumn = state.columns.find((col) => col.id === sourceColumnId);
      const destinationColumn = state.columns.find((col) => col.id === destinationColumnId);

      if (sourceColumn && destinationColumn) {
        // Remove card from source
        const [movedCard] = sourceColumn.cards.splice(sourceIndex, 1);

        // Add card to destination
        destinationColumn.cards.splice(destinationIndex, 0, {
          ...movedCard,
          updatedAt: Date.now(),
        });

        saveState(state);
      }
    },

    reorderCards: (state, action) => {
      const { columnId, startIndex, endIndex } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        const [removed] = column.cards.splice(startIndex, 1);
        column.cards.splice(endIndex, 0, removed);
        saveState(state);
      }
    },

    // Subtask Actions
    addSubtask: (state, action) => {
      const { columnId, cardId, text } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        const card = column.cards.find((c) => c.id === cardId);
        if (card) {
          if (!card.subtasks) {
            card.subtasks = [];
          }
          const newSubtask = {
            id: uuidv4(),
            text: text || '',
            completed: false,
          };
          card.subtasks.push(newSubtask);
          card.updatedAt = Date.now();
          saveState(state);
        }
      }
    },

    toggleSubtask: (state, action) => {
      const { columnId, cardId, subtaskId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        const card = column.cards.find((c) => c.id === cardId);
        if (card && card.subtasks) {
          const subtask = card.subtasks.find((s) => s.id === subtaskId);
          if (subtask) {
            subtask.completed = !subtask.completed;
            card.updatedAt = Date.now();
            saveState(state);
          }
        }
      }
    },

    deleteSubtask: (state, action) => {
      const { columnId, cardId, subtaskId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        const card = column.cards.find((c) => c.id === cardId);
        if (card && card.subtasks) {
          card.subtasks = card.subtasks.filter((s) => s.id !== subtaskId);
          card.updatedAt = Date.now();
          saveState(state);
        }
      }
    },

    // Search & Filter Actions
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setActiveTag: (state, action) => {
      state.activeTag = action.payload;
    },

    clearFilters: (state) => {
      state.searchQuery = '';
      state.activeTag = null;
    },

    // Bulk Actions
    clearBoard: (state) => {
      state.columns.forEach((col) => {
        col.cards = [];
      });
      saveState(state);
    },

    resetBoard: (state) => {
      state.columns = [
        {
          id: 'col-1',
          title: 'TODO',
          cards: [],
        },
        {
          id: 'col-2',
          title: 'In Progress',
          cards: [],
        },
        {
          id: 'col-3',
          title: 'Completed',
          cards: [],
        },
      ];
      state.searchQuery = '';
      state.activeTag = null;
      saveState(state);
    },
  },
});

// Helper function to save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      columns: state.columns,
      searchQuery: state.searchQuery,
      activeTag: state.activeTag,
    });
    localStorage.setItem('kanbanBoard', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

// Selectors
export const selectAllColumns = (state) => state.board.columns;

export const selectFilteredColumns = (state) => {
  const { columns, searchQuery, activeTag } = state.board;

  if (!searchQuery && !activeTag) {
    return columns;
  }

  return columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => {
      const matchesSearch = !searchQuery ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.notes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !activeTag || card.color === activeTag;

      return matchesSearch && matchesTag;
    }),
  }));
};

export const selectSearchQuery = (state) => state.board.searchQuery;
export const selectActiveTag = (state) => state.board.activeTag;

export const selectCardById = (columnId, cardId) => (state) => {
  const column = state.board.columns.find((col) => col.id === columnId);
  return column?.cards.find((card) => card.id === cardId);
};

export const selectColumnById = (columnId) => (state) => {
  return state.board.columns.find((col) => col.id === columnId);
};

export const selectTotalCards = (state) => {
  return state.board.columns.reduce((total, col) => total + col.cards.length, 0);
};

export const {
  addColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  reorderCards,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  setSearchQuery,
  setActiveTag,
  clearFilters,
  clearBoard,
  resetBoard,
} = boardSlice.actions;

export default boardSlice.reducer;
