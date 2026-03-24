import React, { useState, useEffect } from 'react';
import { getLeaders } from '../services/PlayerService';

function LeadersSection() {
    const [leaders, setLeaders] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        setLoading(true);
        try {
            const response = await getLeaders();
            setLeaders(response.data);
        } catch (err) {
            setError('Failed to load leaders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatValue = (player, category) => {
        switch (category) {
            case 'Points': return player.avgPoints;
            case 'Assists': return player.avgAssists;
            case 'Rebounds': return player.avgRebounds;
            case 'Steals': return player.avgSteals;
            case 'Blocks': return player.avgBlocks;
            case 'FG%': return `${player.fgPercentage ?? 0}%`;
            case '3P%': return `${player.tpPercentage ?? 0}%`;
            default: return '-';
        }
    };

    if (loading) return <p className="text-muted p-3">Loading...</p>;
    if (error) return <p className="text-danger p-3">{error}</p>;

    return (
        <div className="container-fluid mt-4 px-4">
            <div className="card shadow-sm border">
                <div className="card-header bg-white border-bottom p-3">
                    <h5 className="mb-0 fw-500">2025-26 league leaders</h5>
                </div>
                <div className="card-body p-3">
                    <div className="row g-3">
                        {Object.entries(leaders).map(([category, players]) => (
                            <div className="col-md-3" key={category}>
                                <div className="border rounded p-3 h-100">
                                    <p className="text-muted text-uppercase fw-500 mb-3"
                                        style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                                        {category}
                                    </p>
                                    {players.map((player, index) => (
                                        <div
                                            key={player.playerId}
                                            className="d-flex justify-content-between align-items-center py-2"
                                            style={{
                                                borderBottom: index < players.length - 1 ? '1px solid #f0f0f0' : 'none'
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="text-muted" style={{ fontSize: '12px', minWidth: '16px' }}>
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <p className="mb-0" style={{ fontSize: '13px', fontWeight: index === 0 ? '500' : '400' }}>
                                                        {player.firstName} {player.lastName}
                                                    </p>
                                                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                                                        {player.teamName}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: index === 0 ? '500' : '400',
                                                    color: index === 0 ? '#198754' : 'inherit'
                                                }}
                                            >
                                                {getStatValue(player, category)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeadersSection;