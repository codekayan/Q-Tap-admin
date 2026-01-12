
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell } from 'recharts';

const data01 = [{ name: 'Pro', value: 10 }, { name: 'Remaining', value: 90 }];


const COLORS = ['#30ADF8', '#D8E0E0'];

 const Chart2 = ({ dashboardClientData }) => {
    const { t } = useTranslation();

    // Parse visit_only_percentage to a number (remove '%' and convert)
    const visitPercentage = parseFloat(dashboardClientData?.visit_only_percentage || '0') || 0;

    // Data for the pie chart
    const data = [
        { name: 'Visits', value: visitPercentage },
        { name: 'Remaining', value: 100 - visitPercentage },
    ];
    return (
        <Box display={"flex"} justifyContent="space-between" alignItems="center"
            padding={"0px 15px"}  >

            <Box >
                <Box display={"flex"} textAlign={"center"} alignItems={"center"} >
                    <Box component="span" sx={{ backgroundColor: COLORS[1], width: '15px', borderRadius: "20px", height: '6px', display: 'inline-block', marginRight: '8px' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "8px", color: "gray" }}>{t("orders")}</Typography>
                </Box>


                <Box display={"flex"} textAlign={"center"} alignItems={"center"} marginTop={"5px"}>
                    <Box component="span" sx={{ background: "linear-gradient(to right , #237DF3 , #43EDFF)", width: '15px', borderRadius: "20px", height: '6px', display: 'inline-block', marginRight: '8px' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "8px", color: "gray" }}>{t("visits")}</Typography>
                </Box>
            </Box>

            <PieChart width={110} height={110}>
                <defs>
                    <linearGradient id="gradientColor" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#43EDFF" />
                        <stop offset="100%" stopColor="#237DF3" />
                    </linearGradient>
                </defs>
                <Pie
                    data={data}
                    cx={55}
                    cy={55}
                    innerRadius={33}
                    outerRadius={50}
                    fill="#D8E0E0"
                    paddingAngle={0}
                    startAngle={0}
                    endAngle={360} // Standard pie chart
                >
                    <Cell fill={visitPercentage === 0 ? '#d3d3d3' : 'url(#gradientColor)'} />
                    <Cell fill="#d3d3d3" />
                </Pie>
                <text
                    x={60}
                    y={60}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={COLORS[0]}
                    fontSize="18"
                >
                    {Number(visitPercentage).toFixed(1)}%
                </text>
            </PieChart>


        </Box >
    )
}

export default Chart2
