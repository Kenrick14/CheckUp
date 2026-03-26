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
    <div className="sb-page">

      {/* sticky hero background - hidden once players selected */}
      {selectedPlayers.length === 0 && (
        <div className="sb-hero">
          <div className="sb-hero-tag">V1</div>
          <h1 className="sb-hero-title">CheckUp</h1>
          <p className="sb-hero-sub">
            Compare NBA player stats side by side. Search any two players
            to see their season averages, shooting percentages, and recent
            game performance head to head.
          </p>
        </div>
      )}

      {/* main content */}
      <div className="sb-layout">

        {/* left column */}
        <div className="sb-left">

          {/* sticky search area */}
          <div className="sb-search-sticky">
            {selectedPlayers.length < 2 && (
              <div className="sb-input-row">
                <div className="sb-input-wrapper">
                  <input
                    className="sb-input"
                    type="text"
                    placeholder={selectedPlayers.length === 1
                      ? "Search for a second player..."
                      : "Search players..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />

                  {loading && <div className="sb-loading">Loading...</div>}

                  {showDropdown && results.length > 0 && (
                    <ul className="sb-dropdown">
                      {results.map((player) => (
                        <li
                          key={player.id}
                          className="sb-dropdown-item"
                          onMouseDown={() => handleSelect(player)}
                        >
                          <span className="sb-player-name">
                            {player.first_name} {player.last_name}
                          </span>
                          <span className="sb-player-meta">
                            {player.position} · {player.teamName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {showDropdown && results.length === 0 && !loading && (
                    <div className="sb-no-results">No players found</div>
                  )}
                </div>

                {/* arrow hint */}
                {selectedPlayers.length === 0 && (
                  <div className="sb-hint">
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                      <path
                        d="M 38 10 C 20 10, 10 10, 2 10"
                        stroke="rgba(249,115,22,0.5)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 8 4 L 2 10 L 8 16"
                        stroke="rgba(249,115,22,0.5)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="sb-hint-text">select two players to compare</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* player cards */}
          {selectedPlayers.length === 2 ? (
            <div className="sb-cards-row">
              <div className="sb-card-col">
                <PlayerStatsDisplay
                  playerId={selectedPlayers[0].id}
                  onRemove={() => handleRemove(selectedPlayers[0].id)}
                  onStatsLoaded={(stats) => handleStatsLoaded(selectedPlayers[0].id, stats)}
                  comparisonStats={comparisonStats}
                />
              </div>
              {bothStatsLoaded && (
                <div className="sb-comparison-col">
                  <ComparisonTable
                    comparisonStats={comparisonStats}
                    selectedPlayers={selectedPlayers}
                  />
                </div>
              )}
              <div className="sb-card-col">
                <PlayerStatsDisplay
                  playerId={selectedPlayers[1].id}
                  onRemove={() => handleRemove(selectedPlayers[1].id)}
                  onStatsLoaded={(stats) => handleStatsLoaded(selectedPlayers[1].id, stats)}
                  comparisonStats={comparisonStats}
                />
              </div>
            </div>
          ) : (
            <div className="sb-single-player">
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

        {/* right column - leaders */}
        <div className="sb-right">
          <LeadersSection />
        </div>

      </div>
    </div>
  );
}

export default SearchBox;