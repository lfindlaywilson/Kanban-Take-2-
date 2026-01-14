import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './styles/global.scss';
import './App.scss';

function App() {
  const theme = useSelector((state) => state.theme.mode);

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <div className="app__theme-toggle">
        <ThemeToggle />
      </div>
      <KanbanBoard />
    </div>
  );
}

export default App;
