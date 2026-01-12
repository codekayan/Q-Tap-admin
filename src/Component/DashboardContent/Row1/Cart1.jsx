import { Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export const Cart1 = ({ Client }) => {
    const theme = useTheme();
    const COLORS = [
        { gradientId: 'gradient1', start: theme.palette.chart.orangeLight, end: theme.palette.chart.orange, stroke: theme.palette.orangePrimary.main },
        { gradientId: 'gradient2', start: theme.palette.chart.pinkLight, end: theme.palette.chart.pink, stroke: '#AD4181' },
        { gradientId: 'gradient3', start: 'rgb(170, 214, 243)', end: '#2EA6F7', stroke: '#2EA6F7' }
    ];
    const GRADIENT_STYLES = [
        { start: '#ef7d00', end: 'rgb(248, 203, 158)' },
        { start: '#AD4181', end: 'rgb(255, 174, 216)' },
        { start: '#2EA6F7', end: 'rgb(170, 214, 243)' }
    ];
    const [clients, setClients] = React.useState([]);

    React.useEffect(() => {
        let isMounted = true;
        const processClients = async () => {
            if (isMounted && Client) {
                // Filter valid client objects and exclude invalid entries (like numbers) and test clients
                const clientArray = Object.values(Client)
                    .filter(item => typeof item === 'object' && item.id && item.id !== 11)
                    .slice(0, 3); // Limit to 3 clients
                setClients(clientArray);
            } else if (isMounted) {
                setClients([]);
            }
        };
        processClients();
        return () => {
            isMounted = false;
        };
    }, [Client]);

    // Generate pie chart data for each client
    const pieData = clients.map(client => [
        { name: client.name, value: parseFloat(client.percentage) },
        { name: 'Remaining', value: 100 - parseFloat(client.percentage) }
    ]);

    return (
        <Box>
            <Box display="flex" justifyContent="center" marginTop="15px">
                {clients.map((client, index) => (
                    <Box key={client.id} sx={{ marginX: '10px' }}>
                        <PieChart width={78} height={78}>
                            <defs>
                                <linearGradient id={COLORS[index].gradientId} x1="0" y1="0" x2="100%" y2="0">
                                    <stop offset="0%" stopColor={COLORS[index].start} />
                                    <stop offset="100%" stopColor={COLORS[index].end} />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={pieData[index]}
                                cx={39}
                                cy={39}
                                innerRadius={20}
                                outerRadius={32}
                                fill="#D8E0E0"
                                paddingAngle={0}
                            >
                                <Cell 
                                    fill={`url(#${COLORS[index].gradientId})`} 
                                    stroke={COLORS[index].stroke} 
                                    strokeWidth={0.2} 
                                    cornerRadius={5} 
                                />
                                <Cell fill="#D8E0E0" />
                            </Pie>
                            <text
                                x={45}
                                y={45}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={COLORS[index].stroke}
                                fontSize="13"
                            >
                                {`${parseInt(client.percentage)}%`}
                            </text>
                        </PieChart>
                    </Box>
                ))}
            </Box>

            <Box marginTop="20px" sx={{ paddingLeft: "20px" }}>
                {clients.map((client, index) => (
                    <Box key={client.id} display="flex" alignItems="center" marginBottom="5px">
                        <Box
                            component="span"
                            sx={{
                                background: `linear-gradient(to right, ${GRADIENT_STYLES[index].start}, ${GRADIENT_STYLES[index].end})`,
                                width: '15px',
                                borderRadius: "20px",
                                height: '6px',
                                display: 'inline-block',
                                marginRight: '8px'
                            }}
                        />
                        <Typography 
                            variant="body2" 
                            color={theme.palette.text.gray} 
                            sx={{ fontSize: "9px" }}
                        >
                            {client.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};