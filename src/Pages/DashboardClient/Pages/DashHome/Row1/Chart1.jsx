import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/system';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#fff', border: '1px solid #ccc', padding: '0px 5px', fontSize: '10px', borderRadius: '5px' }}>
                <p>{`${payload[0].payload.name}: ${payload[0].value / 1000}k`}</p>
            </div>
        );
    }
    return null;
};

const Chart1 = ({ dashboardClientData }) => {
    const [allData, setAllData] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [page, setPage] = useState(0);
    const theme = useTheme();

    useEffect(() => {
        const data = Object.values(dashboardClientData?.data || []);
        setAllData(data);
        setDisplayedData(data.slice(0, 6)); // Show first 6 items initially
    }, [dashboardClientData]);

    const handleTogglePage = () => {
        const newPage = page === 0 ? 1 : 0;
        setPage(newPage);
        const startIndex = newPage * 6;
        const endIndex = startIndex + 6;
        setDisplayedData(allData.slice(startIndex, endIndex));
    };

    const hasMoreData = allData.length > 6;

    return (
        <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={155}>
                <BarChart
                    data={displayedData}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: -30, bottom: -10 }}
                >
                    <XAxis
                        type="number"
                        tickFormatter={(tick) => `${tick / 1000}k`}
                        tick={{ fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        dataKey="month_name"
                        type="category"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{ fontSize: '10px' }}
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar
                        dataKey="total_order"
                        fill="#000000"
                        background={{ fill: '#d3d3d3' }}
                        barSize={7}
                        radius={[10, 10, 10, 10]}
                    />
                </BarChart>
            </ResponsiveContainer>

            {hasMoreData && (
                <button
                    onClick={handleTogglePage}
                    style={{
                        position: 'absolute',
                        insetInlineEnd: 0,
                        top: 0,
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        fontSize: '22px',
                        marginTop: '-14px',
                        marginRight: '10px',
                        border: 'none',
                        background: 'transparent',
                        color: theme.palette.orangePrimary.main,
                    }}
                    onMouseEnter={(e) => (e.target.style.color = theme.palette.chart.orangeLight)}
                    onMouseLeave={(e) => (e.target.style.color = theme.palette.orangePrimary.main)}
                >
                    {page === 0 ? '>' : '<'}
                </button>
            )}
        </div>
    );
};

export default Chart1;
