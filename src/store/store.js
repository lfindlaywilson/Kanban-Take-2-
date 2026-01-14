import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    board: boardReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['board/addCard', 'board/updateCard'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['board.columns'],
      },
    }),
});

export default store;
