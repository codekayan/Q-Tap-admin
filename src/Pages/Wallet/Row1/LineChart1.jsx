import { useTheme } from '@mui/system';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

// CustomTooltip component for formatting tooltip content
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#666', fontSize: "12px", color: '#fff', padding: '5px', borderRadius: '5px' }}>
                {`${payload[0].value}K`}
            </div>
        );
    }
    return null;
};


const LineChart1 = ({ salesData, showLine1, showLine2 }) => {
    // Access the theme
    const theme = useTheme();
    // console.log("salesData in line chart1", salesData);
    // Check for data availability
    if (!salesData) {
        return <div>لا توجد بيانات متاحة</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={210}>
            <LineChart data={salesData ? Object.values(salesData) : []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                <XAxis
                    dataKey="month_name"
                    tick={{ fontSize: 9, fill: theme.palette.text.gray, angle: -45, textAnchor: 'end' }}
                    tickLine={false}
                    interval={0}
                />
                <YAxis
                    domain={[0, 50]} // Adjust range to fit transformed values (e.g., 20k becomes 20)
                    ticks={[0, 10, 20, 30, 40, 50]}
                    tickFormatter={(tick) => `${tick}k`}
                    tick={{ fontSize: 9, fill: theme.palette.text.gray }}
                    tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {showLine1 && (
                    <Line
                        type="linear"
                        dataKey="total_revenue"
                        name="Revenue Line 1"
                        stroke="#707070"
                        strokeWidth={2}
                        dot={{ fill: 'url(#lineChartGradient2)', r: 5, stroke: 'none', zIndex: 10 }}
                    />
                )}
                {showLine2 && (
                    <Line
                        type="linear"
                        dataKey="total_revenue"
                        name="Revenue Line 2"
                        stroke="#404040"
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
    showLine2: false,
};

export default LineChart1;