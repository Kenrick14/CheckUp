import React, { useState, useEffect, useRef } from 'react';
import { playerSearch } from '../services/PlayerService';
import PlayerStatsDisplay from './PlayerStatsDisplay';
import ComparisonTable from './ComparisonTable';
import LeadersSection from './LeadersSection';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const isSelectedRef = useRef(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
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
    if (selectedPlayers.length >= 2) return;
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

  const bothStatsLoaded = selectedPlayers.length === 2 &&
    Object.keys(comparisonStats).length === 2;

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="row g-4">

        {/* left side - search and player cards */}
        <div className="col-md-8">

          {/* search box */}
          {selectedPlayers.length < 2 && (
            <div style={{ position: 'relative', maxWidth: '500px' }}>
              <input
                className="form-control p-3 shadow-sm"
                type="text"
                placeholder={selectedPlayers.length === 1 ? "Search for a second player..." : "Search players..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />

              {loading && (
                <div style={{ position: 'absolute', right: '20px', top: '12px' }}>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Loading...</span>
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

          {/* player cards - when 2 selected, show card | comparison | card */}
          {selectedPlayers.length === 2 ? (
            <div className="d-flex gap-2 align-items-start mt-3">
              {/* player 1 */}
              <div style={{ flex: 1 }}>
                <PlayerStatsDisplay
                  playerId={selectedPlayers[0].id}
                  onRemove={() => handleRemove(selectedPlayers[0].id)}
                  onStatsLoaded={(stats) => handleStatsLoaded(selectedPlayers[0].id, stats)}
                  comparisonStats={comparisonStats}
                />
              </div>

              {/* comparison table in the middle */}
              {bothStatsLoaded && (
                <div style={{ width: '220px', flexShrink: 0 }}>
                  <ComparisonTable
                    comparisonStats={comparisonStats}
                    selectedPlayers={selectedPlayers}
                  />
                </div>
              )}

              {/* player 2 */}
              <div style={{ flex: 1 }}>
                <PlayerStatsDisplay
                  playerId={selectedPlayers[1].id}
                  onRemove={() => handleRemove(selectedPlayers[1].id)}
                  onStatsLoaded={(stats) => handleStatsLoaded(selectedPlayers[1].id, stats)}
                  comparisonStats={comparisonStats}
                />
              </div>
            </div>
          ) : (
            // single player
            <div className="mt-3">
              {selectedPlayers.map(player => (
                <div key={player.id}>
                  <PlayerStatsDisplay
                    playerId={player.id}
                    onRemove={() => handleRemove(player.id)}
                    onStatsLoaded={(stats) => handleStatsLoaded(player.id, stats)}
                    comparisonStats={comparisonStats}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* right side - leaders */}
        <div className="col-md-4">
          <LeadersSection />
        </div>

      </div>
    </div>
  );
}

export default SearchBox;