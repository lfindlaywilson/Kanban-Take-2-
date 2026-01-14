// localStorage utility functions

export const storage = {
  // Save data to localStorage
  save: (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  },

  // Load data from localStorage
  load: (key, defaultValue = null) => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Error loading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  // Clear all localStorage data
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Check if localStorage is available
  isAvailable: () => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Get all keys in localStorage
  keys: () => {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  },

  // Get storage size (approximate)
  getSize: () => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating localStorage size:', error);
      return 0;
    }
  },
};

// Specific storage keys for the Kanban app
export const STORAGE_KEYS = {
  BOARD: 'kanbanBoard',
  THEME: 'theme',
  USER_PREFERENCES: 'userPreferences',
};

// Helper functions for specific data
export const boardStorage = {
  save: (data) => storage.save(STORAGE_KEYS.BOARD, data),
  load: (defaultValue) => storage.load(STORAGE_KEYS.BOARD, defaultValue),
  clear: () => storage.remove(STORAGE_KEYS.BOARD),
};

export const themeStorage = {
  save: (theme) => storage.save(STORAGE_KEYS.THEME, theme),
  load: (defaultTheme = 'dark') => storage.load(STORAGE_KEYS.THEME, defaultTheme),
};

export const preferencesStorage = {
  save: (preferences) => storage.save(STORAGE_KEYS.USER_PREFERENCES, preferences),
  load: (defaults = {}) => storage.load(STORAGE_KEYS.USER_PREFERENCES, defaults),
};

export default storage;
