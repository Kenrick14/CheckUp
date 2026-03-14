import React, { useState, useEffect } from 'react';
import { seasonPlayerStats, recentPlayerStats } from '../services/PlayerService';

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
      onStatsLoaded(avgRes.data); // notify SearchBox that stats are loaded
    } catch (err) {
      setError('Failed to load player data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

   // compare this player's stat against the other player's stat
  const getHighlight = (statKey, higherIsBetter = true) => {
    const otherStats = Object.entries(comparisonStats)
        .find(([id]) => Number(id) !== playerId)?.[1];

    if (!otherStats || !seasonAvg) return {};

    const myValue = seasonAvg[statKey];
    const otherValue = otherStats[statKey];

    if (myValue === otherValue) return {};

    const isBetter = higherIsBetter ? myValue > otherValue : myValue < otherValue;
    return { backgroundColor: isBetter ? '#d4edda' : '#f8d7da' };
  };

  useEffect(() => {
    if (playerId) fetchPlayerData();
  }, [playerId]);

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

  if (loading) return <p className="text-muted p-3">Loading...</p>;
  if (error) return <p className="text-danger p-3">{error}</p>;
  if (!seasonAvg) return null;

  const isHomeTeam = seasonAvg.teamName === recentGame?.game?.home_team?.name;
  const opponent = isHomeTeam ? recentGame?.game?.visitor_team?.name : recentGame?.game?.home_team?.name;
  const gameResult = recentGame?.game?.home_team_score > recentGame?.game?.visitor_team_score
    ? (isHomeTeam ? 'W' : 'L')
    : (isHomeTeam ? 'L' : 'W');

  return (
    
    <div className="container mt-4">
      {/* outer card */}
      <div className="card shadow-sm border" >

        {/* player header with X button */}
        <div className="card-header border-bottom bg-white d-flex align-items-center justify-content-between p-3">
          <div>
            <h5 className="mb-0 fw-500">{seasonAvg.firstName} {seasonAvg.lastName}</h5>
            <small className="text-muted">{seasonAvg.position} &nbsp;·&nbsp; {seasonAvg.teamName}</small>
          </div>
          <button
            onClick={onRemove}
            className="btn btn-sm btn-outline-secondary"
            style={{ lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div className="card-body p-3">
          <div className="row g-3">

            {/* season averages */}
            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <p className="text-muted text-uppercase fw-500 mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                  2025-26 season averages
                </p>
                <div className="row row-cols-3 g-2 mb-3">
                  {[
                    { value: seasonAvg.avgPoints, label: 'PPG', key: 'avgPoints' },
                    { value: seasonAvg.avgAssists, label: 'APG', key: 'avgAssists' },
                    { value: seasonAvg.avgRebounds, label: 'RPG', key: 'avgRebounds' },
                    { value: seasonAvg.avgSteals, label: 'SPG', key: 'avgSteals' },
                    { value: seasonAvg.avgBlocks, label: 'BPG', key: 'avgBlocks' },
                    { value: seasonAvg.avgTurnovers, label: 'TOV', key: 'avgTurnovers', higherIsBetter: false },
                    { value: seasonAvg.plusMinus > 0 ? `+${seasonAvg.plusMinus}` : seasonAvg.plusMinus, label: '+/-', key: 'plusMinus' },
                  ].map(({ value, label, key, higherIsBetter = true }) => (
                    <div className="col" key={label}>
                      <StatCard value={value} label={label} highlight={getHighlight(key, higherIsBetter)} />
                    </div>
                  ))}
                </div>

                {/* shooting */}
                <div className="border-top pt-3">
                  <p className="text-muted text-uppercase fw-500 mb-2" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    shooting
                  </p>
                  <div className="row row-cols-3 g-2">
                    {[
                      { value: `${seasonAvg.fgPercentage ?? 0}%`, label: 'FG%', key: 'fgPercentage' },
                      { value: `${seasonAvg.tpPercentage ?? 0}%`, label: '3P%', key: 'tpPercentage' },
                      { value: `${seasonAvg.ftPercentage ?? 0}%`, label: 'FT%', key: 'ftPercentage' },
                    ].map(({ value, label, key }) => (
                      <div className="col" key={label}>
                        <StatCard value={value} label={label} highlight={getHighlight(key)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* most recent game */}
            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <p className="text-muted text-uppercase fw-500 mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                  most recent game
                </p>

                {recentGame ? (
                  <>
                    <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                      vs {opponent} &nbsp;·&nbsp; {gameResult} &nbsp;·&nbsp; {recentGame.game.date}
                    </p>

                    <div className="row row-cols-2 g-2 mb-3">
                      {[
                        { value: recentGame.pts, label: 'PTS' },
                        { value: recentGame.ast, label: 'AST' },
                        { value: recentGame.reb, label: 'REB' },
                        { value: recentGame.stl, label: 'STL' },
                        { value: recentGame.blk, label: 'BLK' },
                        { value: recentGame.plus_minus > 0 ? `+${recentGame.plus_minus}` : recentGame.plus_minus, label: '+/-' },
                      ].map(({ value, label }) => (
                        <div className="col" key={label}>
                          <StatCard value={value} label={label} />
                        </div>
                      ))}
                    </div>

                    <div className="border-top pt-3">
                      <div className="row row-cols-3 g-2">
                        {[
                          { value: `${recentGame.fgm}/${recentGame.fga}`, label: 'FG' },
                          { value: `${recentGame.fg3m}/${recentGame.fg3a}`, label: '3P' },
                          { value: `${recentGame.ftm}/${recentGame.fta}`, label: 'FT' },
                        ].map(({ value, label }) => (
                          <div className="col" key={label}>
                            <StatCard value={value} label={label} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted" style={{ fontSize: '13px' }}>No recent game data</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, highlight = {} }) {
  return (
    <div className="border rounded p-2 text-center" style={{ fontSize: '13px', ...highlight }}>
      <p className="fw-500 mb-0" style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{value ?? '-'}</p>
      <p className="text-muted mb-0" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>{label}</p>
    </div>
  );
}

export default PlayerStatsDisplay;