import { Box, useTheme } from '@mui/material'
import React from 'react'


import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from "recharts";

const SalesVolumeChart = ({ salesVolumeData }) => {
    const theme = useTheme();

    return (
        <Box sx={{ height: "150px", width: '100%' }}>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesVolumeData?.data} margin={{ top: 10, right: 10, left: -10, bottom: 90 }}>
                    <XAxis dataKey="week" tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(tick) => `${tick}k`} tick={{ fontSize: 10 }}
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


                    <Tooltip formatter={(value) => `${value}k`} />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    )
}
export default SalesVolumeChart;
