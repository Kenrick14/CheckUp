import React, { useState, useEffect } from 'react';
import { seasonPlayerStats, recentPlayerStats } from '../services/PlayerService';
import '../styling/PlayerStatsDisplay.css';

function PlayerStatsDisplay({ playerId, onRemove, onStatsLoaded, comparisonStats }) {
  const [seasonAvg, setSeasonAvg] = useState(null);
  const [recentGame, setRecentGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [avgRes, recentRes] = await Promise.all([
        seasonPlayerStats(playerId),
        recentPlayerStats(playerId)
      ]);
      setSeasonAvg(avgRes.data);
      setRecentGame(recentRes.data);
      onStatsLoaded(avgRes.data);
    } catch (err) {
      setError('Failed to load player data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getHighlight = (statKey, higherIsBetter = true) => {
    const otherStats = Object.entries(comparisonStats)
      .find(([id]) => Number(id) !== playerId)?.[1];

    if (!otherStats || !seasonAvg) return '';

    const myValue = seasonAvg[statKey];
    const otherValue = otherStats[statKey];

    if (myValue === otherValue) return '';

    const isBetter = higherIsBetter ? myValue > otherValue : myValue < otherValue;
    return isBetter ? 'stat-card--better' : 'stat-card--worse';
  };

  useEffect(() => {
    if (playerId) fetchPlayerData();
  }, [playerId]);

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

  if (loading) return <p className="psd-loading">Loading...</p>;
  if (error) return <p className="psd-error">{error}</p>;
  if (!seasonAvg) return null;

  const isHomeTeam = seasonAvg.teamName === recentGame?.game?.home_team?.name;
  const opponent = isHomeTeam
    ? recentGame?.game?.visitor_team?.name
    : recentGame?.game?.home_team?.name;
  const gameResult = recentGame?.game?.home_team_score > recentGame?.game?.visitor_team_score
    ? (isHomeTeam ? 'W' : 'L')
    : (isHomeTeam ? 'L' : 'W');

  return (
    <div className="psd-card">

      {/* header */}
      <div className="psd-header">
        <div className="psd-initials">
          {getInitials(seasonAvg.firstName, seasonAvg.lastName)}
        </div>
        <div className="psd-header-info">
          <h5 className="psd-name">{seasonAvg.firstName} {seasonAvg.lastName}</h5>
          <span className="psd-meta">{seasonAvg.position} · {seasonAvg.teamName}</span>
        </div>
        <button className="psd-remove-btn" onClick={onRemove}>✕</button>
      </div>

      <div className="psd-body">

        {/* season averages */}
        <div className="psd-section">
          <p className="psd-section-label">2025-26 season averages</p>
          <div className="psd-stat-grid">
            {[
              { value: seasonAvg.avgPoints, label: 'PPG', key: 'avgPoints' },
              { value: seasonAvg.avgAssists, label: 'APG', key: 'avgAssists' },
              { value: seasonAvg.avgRebounds, label: 'RPG', key: 'avgRebounds' },
              { value: seasonAvg.avgSteals, label: 'SPG', key: 'avgSteals' },
              { value: seasonAvg.avgBlocks, label: 'BPG', key: 'avgBlocks' },
              { value: seasonAvg.avgTurnovers, label: 'TOV', key: 'avgTurnovers', higherIsBetter: false },
              { value: seasonAvg.plusMinus > 0 ? `+${seasonAvg.plusMinus}` : seasonAvg.plusMinus, label: '+/-', key: 'plusMinus' },
            ].map(({ value, label, key, higherIsBetter = true }) => (
              <StatCard
                key={label}
                value={value}
                label={label}
                highlightClass={getHighlight(key, higherIsBetter)}
              />
            ))}
          </div>

          {/* shooting */}
          <div className="psd-divider" />
          <p className="psd-section-label">shooting</p>
          <div className="psd-stat-grid psd-stat-grid--3">
            {[
              { value: `${seasonAvg.fgPercentage ?? 0}%`, label: 'FG%', key: 'fgPercentage' },
              { value: `${seasonAvg.tpPercentage ?? 0}%`, label: '3P%', key: 'tpPercentage' },
              { value: `${seasonAvg.ftPercentage ?? 0}%`, label: 'FT%', key: 'ftPercentage' },
            ].map(({ value, label, key }) => (
              <StatCard
                key={label}
                value={value}
                label={label}
                highlightClass={getHighlight(key)}
              />
            ))}
          </div>
        </div>

        {/* most recent game */}
        <div className="psd-section">
          <p className="psd-section-label">most recent game</p>
          {recentGame ? (
            <>
              <p className="psd-game-meta">
                vs {opponent} · {gameResult} · {recentGame.game.date}
              </p>
              <div className="psd-stat-grid psd-stat-grid--3">
                {[
                  { value: recentGame.pts, label: 'PTS' },
                  { value: recentGame.ast, label: 'AST' },
                  { value: recentGame.reb, label: 'REB' },
                  { value: recentGame.stl, label: 'STL' },
                  { value: recentGame.blk, label: 'BLK' },
                  { value: recentGame.plus_minus > 0 ? `+${recentGame.plus_minus}` : recentGame.plus_minus, label: '+/-' },
                ].map(({ value, label }) => (
                  <StatCard key={label} value={value} label={label} />
                ))}
              </div>
              <div className="psd-divider" />
              <div className="psd-stat-grid psd-stat-grid--3">
                {[
                  { value: `${recentGame.fgm}/${recentGame.fga}`, label: 'FG' },
                  { value: `${recentGame.fg3m}/${recentGame.fg3a}`, label: '3P' },
                  { value: `${recentGame.ftm}/${recentGame.fta}`, label: 'FT' },
                ].map(({ value, label }) => (
                  <StatCard key={label} value={value} label={label} />
                ))}
              </div>
            </>
          ) : (
            <p className="psd-no-game">No recent game data</p>
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ value, label, highlightClass = '' }) {
  return (
    <div className={`stat-card ${highlightClass}`}>
      <p className="stat-card__value">{value ?? '-'}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
}

export default PlayerStatsDisplay;