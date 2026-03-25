import React, { useState, useEffect } from 'react';
import { allSeasonPlayerStats } from '../services/PlayerService';
import '../styling/PlayerStatsTable.css';

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

  const teams = [...new Set(stats.map(p => p.teamName))].sort();
  const positions = [...new Set(stats.map(p => p.position).filter(Boolean))].sort();

  const filtered = stats.filter(player => {
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeam === '' || player.teamName === selectedTeam;
    const matchesPosition = selectedPosition === '' || player.position === selectedPosition;
    return matchesName && matchesTeam && matchesPosition;
  });

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

  const handleSearchChange = (e) => { setSearchQuery(e.target.value); setPage(0); };
  const handleTeamChange = (e) => { setSelectedTeam(e.target.value); setPage(0); };
  const handlePositionChange = (e) => { setSelectedPosition(e.target.value); setPage(0); };
  const handleClearFilters = () => { setSearchQuery(''); setSelectedTeam(''); setSelectedPosition(''); setPage(0); };

  if (error) return <p className="pst-error">{error}</p>;

  return (
    <div className="pst-page">
      <div className="pst-card">

        {/* header */}
        <div className="pst-header">
          <div className="pst-header-top">
            <h5 className="pst-title">2025-26 season averages</h5>
            <span className="pst-count">{sorted.length} players</span>
          </div>

          {/* filters */}
          <div className="pst-filters">
            <input
              type="text"
              className="pst-filter-input"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <select
              className="pst-filter-select"
              value={selectedTeam}
              onChange={handleTeamChange}
            >
              <option value="">All teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <select
              className="pst-filter-select"
              value={selectedPosition}
              onChange={handlePositionChange}
            >
              <option value="">All positions</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            <button className="pst-clear-btn" onClick={handleClearFilters}>
              Clear
            </button>
          </div>
        </div>

        {/* table */}
        <div className="pst-table-wrapper">
          {loading ? (
            <p className="pst-loading">Loading...</p>
          ) : (
            <table className="pst-table">
              <thead>
                <tr>
                  {columns.map(({ label, key }) => (
                    <th
                      key={key}
                      className={`pst-th ${sortConfig.key === key ? 'pst-th--active' : ''}`}
                      onClick={() => handleSort(key)}
                    >
                      {label}{getSortIcon(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map((player) => (
                  <tr key={player.playerId} className="pst-row">
                    <td className="pst-td pst-td--name">
                      {player.firstName} {player.lastName}
                    </td>
                    <td className="pst-td">{player.teamName}</td>
                    <td className="pst-td">{player.position}</td>
                    <td className="pst-td">{player.avgPoints}</td>
                    <td className="pst-td">{player.avgAssists}</td>
                    <td className="pst-td">{player.avgRebounds}</td>
                    <td className="pst-td">{player.avgSteals}</td>
                    <td className="pst-td">{player.avgBlocks}</td>
                    <td className="pst-td">{player.avgTurnovers}</td>
                    <td className="pst-td">{player.fgPercentage ?? 0}%</td>
                    <td className="pst-td">{player.tpPercentage ?? 0}%</td>
                    <td className="pst-td">{player.ftPercentage ?? 0}%</td>
                    <td className="pst-td">
                      {player.plusMinus > 0 ? `+${player.plusMinus}` : player.plusMinus}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={columns.length} className="pst-td pst-empty">
                      No players found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* pagination */}
        <div className="pst-footer">
          <span className="pst-page-info">Page {page + 1} of {totalPages || 1}</span>
          <div className="pst-pagination">
            <button
              className="pst-page-btn"
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              Previous
            </button>
            <button
              className="pst-page-btn"
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