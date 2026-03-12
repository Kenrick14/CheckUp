import React, { useState, useEffect, useRef } from 'react';
import { playerSearch } from '../services/PlayerService'; 

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await playerSearch(query); // use service here
        setResults(response.data);                  // axios returns data in response.data
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (player) => {
    console.log('Selected player:', player);
    setQuery(`${player.first_name} ${player.last_name}`);
    setShowDropdown(false);
    // TODO: fetch player averages using player.id
    // fetch(`http://localhost:8080/api/nba/stats/player/${player.id}`)
  };
   return (
    <div className='center' style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
      <input
        className="search-box container mt-4 mb-4 p-3 border rounded bg-light shadow"
        type="text"
        placeholder="Search players..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />

      {loading && (
        <div style={{ position: 'absolute', right: '20px', top: '22px' }}>
          <span>Loading...</span>
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {results.map((player) => (
            <li
              key={player.id}
              onClick={() => handleSelect(player)}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <span>{player.first_name} {player.last_name}</span>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>{player.position} · {player.team?.name}</span>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && results.length === 0 && !loading && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px 15px',
          color: '#888'
        }}>
          No players found
        </div>
      )}
    </div>
  );
}

export default SearchBox