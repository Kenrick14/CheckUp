import React, { useState, useEffect } from 'react';
import { getLeaders } from '../services/PlayerService';
import '../styling/LeadersSection.css';

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

    if (loading) return <p className="ls-loading">Loading...</p>;
    if (error) return <p className="ls-error">{error}</p>;

    return (
        <div className="ls-card">
            <div className="ls-header">
                <h5 className="ls-title">2025-26 league leaders</h5>
            </div>
            <div className="ls-body">
                {Object.entries(leaders).map(([category, players]) => (
                    <div key={category} className="ls-category">
                        <p className="ls-category-label">{category}</p>
                        <div className="ls-player-list">
                            {players.map((player, index) => (
                                <div key={player.playerId} className="ls-player-row">
                                    <div className="ls-player-left">
                                        <span className="ls-rank">{index + 1}</span>
                                        <div className="ls-player-info">
                                            <p className={`ls-player-name ${index === 0 ? 'ls-player-name--leader' : ''}`}>
                                                {player.firstName} {player.lastName}
                                            </p>
                                            <p className="ls-player-team">{player.teamName}</p>
                                        </div>
                                    </div>
                                    <span className={`ls-stat-value ${index === 0 ? 'ls-stat-value--leader' : ''}`}>
                                        {getStatValue(player, category)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LeadersSection;