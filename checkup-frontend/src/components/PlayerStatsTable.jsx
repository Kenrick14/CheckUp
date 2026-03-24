import React, { useState, useEffect } from 'react';
import { allSeasonPlayerStats } from '../services/PlayerService';

function PlayerStatsTable() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'avgPoints', direction: 'desc' });
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const pageSize = 20;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await allSeasonPlayerStats();
      setStats(response.data.content);
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

  // get unique teams and positions from data for filter dropdowns
  const teams = [...new Set(stats.map(p => p.teamName))].sort();
  const positions = [...new Set(stats.map(p => p.position).filter(Boolean))].sort();

  // filter
  const filtered = stats.filter(player => {
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeam === '' || player.teamName === selectedTeam;
    const matchesPosition = selectedPosition === '' || player.position === selectedPosition;
    return matchesName && matchesTeam && matchesPosition;
  });

  // sort
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortConfig.key] ?? 0;
    const bVal = b[sortConfig.key] ?? 0;
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'desc'
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }
    return sortConfig.direction === 'desc' ? bVal - aVal : aVal - bVal;
  });

  // paginate
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0); // reset to first page on filter change
  };

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
    setPage(0);
  };

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTeam('');
    setSelectedPosition('');
    setPage(0);
  };

  if (error) return <p className="text-danger p-3">{error}</p>;

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="card shadow-sm border">
        <div className="card-header bg-white border-bottom p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-500">2025-26 season averages</h5>
            <small className="text-muted">{sorted.length} players</small>
          </div>

          {/* filters */}
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={selectedTeam}
                onChange={handleTeamChange}
              >
                <option value="">All teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={selectedPosition}
                onChange={handlePositionChange}
              >
                <option value="">All positions</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </div>
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
                  {paginated.length > 0 ? paginated.map((player) => (
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
                  )) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center text-muted p-3">
                        No players found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* pagination */}
        <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center p-3">
          <small className="text-muted">Page {page + 1} of {totalPages || 1}</small>
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
              disabled={page >= totalPages - 1}
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