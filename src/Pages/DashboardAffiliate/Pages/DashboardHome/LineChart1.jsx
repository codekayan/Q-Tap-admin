import { useTheme } from '@mui/system';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#666', fontSize: '12px', color: '#fff', padding: '5px', borderRadius: '5px' }}>
                <p>{`Month: ${label}`}</p>
                {payload.map((entry, index) => (
                    <p key={index}>{`${entry.name}: ${entry.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const LineChart1 = ({ salesData, showLine1, showLine2 }) => {
    const theme = useTheme();

    // Check if salesData exists and has the required arrays
    if (!salesData || !salesData.clicksPerMonth || !salesData.usersCountByMonth) {
        return <div>لا توجد بيانات متاحة</div>;
    }

    // Merge clicksPerMonth and usersCountByMonth into a single array for the chart
    const chartData = salesData.clicksPerMonth.map((clickItem, index) => ({
        month_name: clickItem.month_name,
        clicks_count: clickItem.clicks_count,
        users_count: salesData.usersCountByMonth[index]?.users_count || 0,
    }));

    // Determine the maximum value for YAxis domain
    const maxClicks = Math.max(...chartData.map(item => item.clicks_count), 0);
    const maxUsers = Math.max(...chartData.map(item => item.users_count), 0);
    const maxValue = Math.max(maxClicks, maxUsers);
    const yAxisMax = Math.ceil(maxValue / 10) * 10; // Round up to nearest 10

    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                <XAxis
                    dataKey="month_name"
                    tick={{ fontSize: 9, fill: theme.palette.text.gray, angle: -45, textAnchor: 'end' }}
                    tickLine={false}
                    interval={0}
                />
                <YAxis
                    style={{ fontSize: 10 }}
                    domain={[0, yAxisMax || 50]} // Dynamic domain based on data
                    ticks={Array.from({ length: Math.ceil(yAxisMax / 10) + 1 }, (_, i) => i * 10)}
                    tickFormatter={(tick) => `${tick}`}
                    tick={{ fontSize: 9, fill: theme.palette.text.gray }}
                    tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {showLine1 && (
                    <Line
                        type="linear"
                        dataKey="clicks_count"
                        name="Clicks"
                        stroke="#2DA0F6"
                        strokeWidth={2}
                        dot={{ fill: 'url(#lineChartGradient2)', r: 5, stroke: 'none', zIndex: 10 }}
                    />
                )}
                {showLine2 && (
                    <Line
                        type="linear"
                        dataKey="users_count"
                        name="Users"
                        stroke="#AD4081"
                        strokeWidth={2}
                        dot={{ fill: 'url(#lineChartGradient1)', r: 5, stroke: 'none', zIndex: 10 }}
                    />
                )}
                <defs>
                    <linearGradient id="lineChartGradient1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(250, 160, 214)" />
                        <stop offset="100%" stopColor="#AD4081" />
                    </linearGradient>
                    <linearGradient id="lineChartGradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(163, 215, 255)" />
                        <stop offset="100%" stopColor="#2DA0F6" />
                    </linearGradient>
                </defs>
            </LineChart>
        </ResponsiveContainer>
    );
};

// Default props
LineChart1.defaultProps = {
    showLine1: true,
    showLine2: true, // Set to true to show both lines by default
};

export default LineChart1;