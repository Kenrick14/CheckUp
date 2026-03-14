import React, { useState, useEffect, useRef } from 'react';
import { playerSearch } from '../services/PlayerService';
import PlayerStatsDisplay from './PlayerStatsDisplay';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const isSelectedRef = useRef(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]); // array of up to 2 players
  const [comparisonStats, setComparisonStats] = useState({});


  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (isSelectedRef.current) {
      isSelectedRef.current = false;
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await playerSearch(query);
        // filter out players already selected
        const filtered = response.data.filter(
          p => !selectedPlayers.some(sp => sp.id === p.id)
        );
        setResults(filtered);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleStatsLoaded = (playerId, stats) => {
    setComparisonStats(prev => ({ ...prev, [playerId]: stats }));
  };

  const handleSelect = (player) => {
    if (selectedPlayers.length >= 2) return; // max 2 players
    isSelectedRef.current = true;
    setSelectedPlayers(prev => [...prev, player]);
    setQuery('');
    setShowDropdown(false);
    setResults([]);
  };

  const handleRemove = (playerId) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId));
    setComparisonStats(prev => {
        const updated = { ...prev };
        delete updated[playerId];
        return updated;
    });
};

  return (
    <div>
      {/* only show search box if less than 2 players selected */}
      {selectedPlayers.length < 2 && (
        <div className='center' style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <input
            className="search-box container mt-4 mb-4 p-3 border rounded bg-light shadow"
            type="text"
            placeholder={selectedPlayers.length === 1 ? "Search for a second player..." : "Search players..."}
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
                  onMouseDown={() => handleSelect(player)}
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
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>{player.position} · {player.teamName}</span>
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
      )}

      {/* player cards side by side */}
      <div className={`container-fluid mt-3 ${selectedPlayers.length === 2 ? 'd-flex gap-3' : ''}`}>
        {selectedPlayers.map((player, index) => (
          <div key={player.id} style={{ flex: selectedPlayers.length === 2 ? '1' : 'unset' }}>
              <PlayerStatsDisplay
                  playerId={player.id}
                  onRemove={() => handleRemove(player.id)}
                  playerIndex={index}
                  totalPlayers={selectedPlayers.length}
                  onStatsLoaded={(stats) => handleStatsLoaded(player.id, stats)}
                  comparisonStats={comparisonStats}
              />
          </div>
        ))}
      </div>

    </div>
  );
}

export default SearchBox;