import { Box, useTheme } from '@mui/material'
import React from 'react'


import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from "recharts";
import { nFormatter } from '../../../../../../utils/formatNumber';
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#fff', border: '1px solid #ccc', padding: '0px 5px', fontSize: '10px', borderRadius: '5px' }}>
                <p>{`${payload[0].payload.week}: ${payload[0].value} `}</p>
            </div>
        );
    }
    return null;
};
const SalesVolumeChartClient = ({ salesVolumeClientData }) => {
    const theme = useTheme();

    return (
        <Box sx={{ height: "150px", width: '100%' }}>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesVolumeClientData?.weeks} margin={{ top: 10, right: 10, left: -10, bottom: 90 }}>
                    <XAxis dataKey="week" tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={nFormatter} tick={{ fontSize: 10 }}
                        tickLine={false} interval={0} />


                    <Area
                        type="monotone"
                        dataKey="total_revenue"
                        fill="#d3d3d3"    // لون التعبئة للمنطقة
                        stroke="#d3d3d3"  // لون الحافة
                        strokeWidth={1}    // عرض حافة المنطقة
                        fillOpacity={0.5}  // تعيين شفافية التعبئة
                    />

                    <Line
                        type="linear"
                        dataKey="total_revenue"
                        stroke={theme.palette.orangePrimary.main}
                        strokeWidth={2}
                        dot={false}
                        connectNulls={true}
                    />


                    {/* <Tooltip formatter={(value) => `${value}k`} /> */}
                    <Tooltip contentStyle={{ fontSize: '10px' }}
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }} />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    )
}
export default SalesVolumeChartClient;
