import React, { useState, useEffect } from 'react';
import { allSeasonPlayerStats } from '../services/PlayerService';

function PlayerStatsTable() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'avgPoints', direction: 'desc' });
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await allSeasonPlayerStats();
      setStats(response.data.content); // or response.data if backend returns a list
    } catch (err) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setPage(0);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'desc' ? ' ↓' : ' ↑';
  };

  // sort in React
  const sorted = [...stats].sort((a, b) => {
    const aVal = a[sortConfig.key] ?? 0;
    const bVal = b[sortConfig.key] ?? 0;
    return sortConfig.direction === 'desc' ? bVal - aVal : aVal - bVal;
  });

  // paginate in React
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const columns = [
    { label: 'Player', key: 'lastName' },
    { label: 'Team', key: 'teamName' },
    { label: 'POS', key: 'position' },
    { label: 'PPG', key: 'avgPoints' },
    { label: 'APG', key: 'avgAssists' },
    { label: 'RPG', key: 'avgRebounds' },
    { label: 'SPG', key: 'avgSteals' },
    { label: 'BPG', key: 'avgBlocks' },
    { label: 'TOV', key: 'avgTurnovers' },
    { label: 'FG%', key: 'fgPercentage' },
    { label: '3P%', key: 'tpPercentage' },
    { label: 'FT%', key: 'ftPercentage' },
    { label: '+/-', key: 'plusMinus' },
  ];

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="card shadow-sm border">
        <div className="card-header bg-white border-bottom p-3">
          <h5 className="mb-0 fw-500">2025-26 season averages</h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <p className="text-muted p-3">Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    {columns.map(({ label, key }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        style={{ cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px' }}
                        className="text-center"
                      >
                        {label}{getSortIcon(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((player) => (
                    <tr key={player.playerId}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
                        {player.firstName} {player.lastName}
                      </td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.teamName}</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.position}</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.avgPoints}</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.avgAssists}</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.avgRebounds}</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.avgSteals}</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.avgBlocks}</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.avgTurnovers}</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.fgPercentage ?? 0}%</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.tpPercentage ?? 0}%</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{player.ftPercentage ?? 0}%</td>
                      <td className="text-center" style={{ fontSize: '13px' }}>
                        {player.plusMinus > 0 ? `+${player.plusMinus}` : player.plusMinus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* pagination */}
        <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center p-3">
          <small className="text-muted">Page {page + 1} of {totalPages}</small>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              Previous
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={page === totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PlayerStatsTable;