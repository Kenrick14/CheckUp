import React, { useState, useEffect } from 'react';
import { seasonPlayerStats, recentPlayerStats } from '../services/PlayerService';

function PlayerStatsDisplay({ playerId }) {
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
    } catch (err) {
      setError('Failed to load player data');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

        {/* player header */}
        <div className="card-header border-bottom bg-white d-flex align-items-center gap-3 p-3">
          <div>
            <h5 className="mb-0 fw-500">{seasonAvg.firstName} {seasonAvg.lastName}</h5>
            <small className="text-muted">{seasonAvg.position} &nbsp;·&nbsp; {seasonAvg.teamName}</small>
          </div>
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
                    { value: seasonAvg.avgPoints, label: 'PPG' },
                    { value: seasonAvg.avgAssists, label: 'APG' },
                    { value: seasonAvg.avgRebounds, label: 'RPG' },
                    { value: seasonAvg.avgSteals, label: 'SPG' },
                    { value: seasonAvg.avgBlocks, label: 'BPG' },
                    { value: seasonAvg.avgTurnovers, label: 'TOV' },
                    { value: seasonAvg.plusMinus > 0 ? `+${seasonAvg.plusMinus}` : seasonAvg.plusMinus, label: '+/-' },
                  ].map(({ value, label }) => (
                    <div className="col" key={label}>
                      <StatCard value={value} label={label} />
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
                      { value: `${seasonAvg.fgPercentage ?? 0}%`, label: 'FG%' },
                      { value: `${seasonAvg.tpPercentage ?? 0}%`, label: '3P%' },
                      { value: `${seasonAvg.ftPercentage ?? 0}%`, label: 'FT%' },
                    ].map(({ value, label }) => (
                      <div className="col" key={label}>
                        <StatCard value={value} label={label} />
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

function StatCard({ value, label }) {
  return (
    <div className="bg-light border rounded p-2 text-center">
      <p className="fw-500 mb-0" style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{value ?? '-'}</p>
      <p className="text-muted mb-0" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>{label}</p>
    </div>
  );
}

export default PlayerStatsDisplay;