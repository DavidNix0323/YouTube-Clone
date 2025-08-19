import React, { useState } from 'react';
import './searchbar.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ videos = [], onSearch }) => {

  const [query, setQuery] = useState('');

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(query.toLowerCase()) ||
    v.channel.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="searchbar-wrapper">
      <form className="searchbar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search videos or channels..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="searchbar-icon">
          <FaSearch />
        </button>
      </form>

      {query && (
        <div className="search-preview">
          {filtered.length > 0 ? (
            filtered.map(video => (
              <div key={video.id} className="preview-item">
                <strong>{video.title}</strong>
                <span>{video.channel}</span>
              </div>
            ))
          ) : (
            <div className="preview-item no-match">No matches found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

