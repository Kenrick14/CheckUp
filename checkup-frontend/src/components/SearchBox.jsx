import React, { useState, useEffect, useRef } from 'react';
import { playerSearch } from '../services/PlayerService';
import PlayerStatsDisplay from './PlayerStatsDisplay';
import ComparisonTable from './ComparisonTable';
import LeadersSection from './LeadersSection';
import '../styling/SearchBox.css';

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
    <div className="searchbox-page">
      <div className="searchbox-layout">

        {/* left side */}
        <div className="searchbox-left">

          {/* search input */}
          {selectedPlayers.length < 2 && (
            <div className="searchbox-input-wrapper">
              <input
                className="searchbox-input"
                type="text"
                placeholder={selectedPlayers.length === 1
                  ? "Search for a second player..."
                  : "Search players..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />

              {loading && (
                <div className="searchbox-loading">Loading...</div>
              )}

              {showDropdown && results.length > 0 && (
                <ul className="searchbox-dropdown">
                  {results.map((player) => (
                    <li
                      key={player.id}
                      className="searchbox-dropdown-item"
                      onMouseDown={() => handleSelect(player)}
                    >
                      <span className="player-name">
                        {player.first_name} {player.last_name}
                      </span>
                      <span className="player-meta">
                        {player.position} · {player.teamName}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && results.length === 0 && !loading && (
                <div className="searchbox-no-results">No players found</div>
              )}
            </div>
          )}

          {/* player cards */}
          {selectedPlayers.length === 2 ? (
            <div className="searchbox-cards-row">
              <div className="searchbox-card-col">
                <PlayerStatsDisplay
                  playerId={selectedPlayers[0].id}
                  onRemove={() => handleRemove(selectedPlayers[0].id)}
                  onStatsLoaded={(stats) => handleStatsLoaded(selectedPlayers[0].id, stats)}
                  comparisonStats={comparisonStats}
                />
              </div>

              {bothStatsLoaded && (
                <div className="searchbox-comparison-col">
                  <ComparisonTable
                    comparisonStats={comparisonStats}
                    selectedPlayers={selectedPlayers}
                  />
                </div>
              )}

              <div className="searchbox-card-col">
                <PlayerStatsDisplay
                  playerId={selectedPlayers[1].id}
                  onRemove={() => handleRemove(selectedPlayers[1].id)}
                  onStatsLoaded={(stats) => handleStatsLoaded(selectedPlayers[1].id, stats)}
                  comparisonStats={comparisonStats}
                />
              </div>
            </div>
          ) : (
            <div>
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
        <div className="searchbox-right">
          <LeadersSection />
        </div>

      </div>
    </div>
  );
}

export default SearchBox;