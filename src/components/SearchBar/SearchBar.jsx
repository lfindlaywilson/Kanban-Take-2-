import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setActiveTag, clearFilters, selectSearchQuery, selectActiveTag } from '../../store/slices/boardSlice';
import './SearchBar.scss';

const TAG_COLORS = [
  { id: 'green', label: 'Green', color: '#00ff88' },
  { id: 'blue', label: 'Blue', color: '#00d9ff' },
  { id: 'purple', label: 'Purple', color: '#a855f7' },
  { id: 'pink', label: 'Pink', color: '#ff00aa' },
  { id: 'orange', label: 'Orange', color: '#ff9500' },
  { id: 'red', label: 'Red', color: '#ff3b5c' },
];

function SearchBar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const activeTag = useSelector(selectActiveTag);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  const handleTagClick = (tagId) => {
    if (activeTag === tagId) {
      dispatch(setActiveTag(null));
    } else {
      dispatch(setActiveTag(tagId));
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = searchQuery || activeTag;

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrapper">
        <svg
          className="search-bar__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button
            className="search-bar__clear"
            onClick={handleClearSearch}
            aria-label="Clear search"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className="search-bar__filters">
        <div className="search-bar__tags">
          {TAG_COLORS.map((tag) => (
            <button
              key={tag.id}
              className={`search-bar__tag ${activeTag === tag.id ? 'active' : ''}`}
              onClick={() => handleTagClick(tag.id)}
              style={{ '--tag-color': tag.color }}
              aria-label={`Filter by ${tag.label}`}
              title={tag.label}
            >
              <div className="search-bar__tag-dot" />
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            className="search-bar__clear-all"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
