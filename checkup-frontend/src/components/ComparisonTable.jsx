import React from 'react';
import '../styling/ComparisonTable.css';

const statRows = [
    { label: 'PPG', key: 'avgPoints', higherIsBetter: true },
    { label: 'APG', key: 'avgAssists', higherIsBetter: true },
    { label: 'RPG', key: 'avgRebounds', higherIsBetter: true },
    { label: 'SPG', key: 'avgSteals', higherIsBetter: true },
    { label: 'BPG', key: 'avgBlocks', higherIsBetter: true },
    { label: 'TOV', key: 'avgTurnovers', higherIsBetter: false },
    { label: '+/-', key: 'plusMinus', higherIsBetter: true },
    { label: 'FG%', key: 'fgPercentage', higherIsBetter: true },
    { label: '3P%', key: 'tpPercentage', higherIsBetter: true },
    { label: 'FT%', key: 'ftPercentage', higherIsBetter: true },
];

function ComparisonTable({ comparisonStats, selectedPlayers }) {
    const playerIds = selectedPlayers.map(p => p.id);
    const player1Stats = comparisonStats[playerIds[0]];
    const player2Stats = comparisonStats[playerIds[1]];

    if (!player1Stats || !player2Stats) return null;

    const getHighlight = (val1, val2, higherIsBetter) => {
        if (val1 === val2) return ['', ''];
        const p1Better = higherIsBetter ? val1 > val2 : val1 < val2;
        return p1Better
            ? ['ct-cell--better', 'ct-cell--worse']
            : ['ct-cell--worse', 'ct-cell--better'];
    };

    const formatValue = (stats, key) => {
        const val = stats[key];
        if (val == null) return '0';
        if (['fgPercentage', 'tpPercentage', 'ftPercentage'].includes(key)) return `${val}%`;
        if (key === 'plusMinus') return val > 0 ? `+${val}` : `${val}`;
        return val;
    };

    return (
        <div className="ct-card">
            <div className="ct-header">
                <span className="ct-label">comparison</span>
            </div>
            <table className="ct-table">
                <thead>
                    <tr>
                        <th className="ct-th">{player1Stats.lastName}</th>
                        <th className="ct-th ct-th--center"></th>
                        <th className="ct-th ct-th--right">{player2Stats.lastName}</th>
                    </tr>
                </thead>
                <tbody>
                    {statRows.map(({ label, key, higherIsBetter }) => {
                        const val1 = player1Stats[key] ?? 0;
                        const val2 = player2Stats[key] ?? 0;
                        const [hl1, hl2] = getHighlight(val1, val2, higherIsBetter);

                        return (
                            <tr key={key} className="ct-row">
                                <td className={`ct-cell ${hl1}`}>
                                    {formatValue(player1Stats, key)}
                                </td>
                                <td className="ct-cell ct-cell--stat-label">
                                    {label}
                                </td>
                                <td className={`ct-cell ct-cell--right ${hl2}`}>
                                    {formatValue(player2Stats, key)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ComparisonTable;