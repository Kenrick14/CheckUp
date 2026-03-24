import React from 'react';

const stats = [
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
            ? ['table-success', 'table-danger']
            : ['table-danger', 'table-success'];
    };

    const formatValue = (stats, key) => {
        const val = stats[key];
        if (val == null) return '0';
        if (key === 'fgPercentage' || key === 'tpPercentage' || key === 'ftPercentage') return `${val}%`;
        if (key === 'plusMinus') return val > 0 ? `+${val}` : `${val}`;
        return val;
    };

    const getDiff = (key) => {
        const val1 = player1Stats[key] ?? 0;
        const val2 = player2Stats[key] ?? 0;
        const diff = (val1 - val2).toFixed(1);
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    return (
        <div className="card shadow-sm border mt-4">
            <div className="card-header bg-white border-bottom p-2">
                <p className="mb-0 text-muted text-uppercase"
                    style={{ fontSize: '10px', letterSpacing: '0.05em', fontWeight: '500' }}>
                    comparison
                </p>
            </div>
            <div className="card-body p-0">
                <table className="table table-bordered mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="text-center p-1" style={{ fontSize: '10px' }}>
                                {player1Stats.lastName}
                            </th>
                            <th className="text-center p-1" style={{ fontSize: '10px', width: '45px' }}>
                            </th>
                            <th className="text-center p-1" style={{ fontSize: '10px' }}>
                                {player2Stats.lastName}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map(({ label, key, higherIsBetter }) => {
                            const val1 = player1Stats[key] ?? 0;
                            const val2 = player2Stats[key] ?? 0;
                            const [hl1, hl2] = getHighlight(val1, val2, higherIsBetter);

                            return (
                                <tr key={key}>
                                    <td className={`text-center p-1 ${hl1}`} style={{ fontSize: '11px' }}>
                                        {formatValue(player1Stats, key)}
                                    </td>
                                    <td className="text-center p-1 table-light"
                                        style={{ fontSize: '10px', fontWeight: '500' }}>
                                        {label}
                                    </td>
                                    <td className={`text-center p-1 ${hl2}`} style={{ fontSize: '11px' }}>
                                        {formatValue(player2Stats, key)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default ComparisonTable;