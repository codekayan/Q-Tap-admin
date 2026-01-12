import React from 'react';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { getDashboard } from '../../../store/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from './../../../Component/componetUi/Loader';

export const Row1 = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const dashboardData = useSelector((state) => state.admins?.dashboardData);
    const { Client } = dashboardData || {};
    const [clients, setClients] = React.useState([]);

    // Define colors and gradients similar to Cart1
    const COLORS = [
        { gradientId: 'gradientFree', start: 'rgb(255, 194, 133)', end: theme.palette.orangePrimary.main, stroke: theme.palette.orangePrimary.main },
        { gradientId: 'gradientStarter', start: 'rgb(255, 174, 216)', end: '#AD4181', stroke: '#AD4181' },
        { gradientId: 'gradientPro', start: 'rgb(170, 214, 243)', end: '#2EA6F7', stroke: '#2EA6F7' },
    ];
    const GRADIENT_STYLES = [
        { start: theme.palette.orangePrimary.main, end: 'rgb(248, 203, 158)' },
        { start: '#AD4181', end: 'rgb(255, 174, 216)' },
        { start: '#2EA6F7', end: 'rgb(170, 214, 243)' },
    ];

    // Fetch and process clients
    React.useEffect(() => {
        let isMounted = true;
        const processClients = async () => {
            if (!Client) {
                dispatch(getDashboard());
            }
            if (isMounted && Client) {
                // Filter valid client objects, exclude test client (id === 11), and limit to 3
                const clientArray = Object.values(Client)
                    .filter(item => typeof item === 'object' && item.id && item.id !== 11 && item.percentage != null)
                    .slice(0, 3);
                setClients(clientArray);
            } else if (isMounted) {
                setClients([]);
            }
        };
        processClients();
        return () => {
            isMounted = false;
        };
    }, [Client, dispatch]);

    // Generate pie chart data for each client
    const pieData = clients.map(client => [
        { name: client.name, value: parseFloat(client.percentage) || 0 },
        { name: 'Remaining', value: 100 - (parseFloat(client.percentage) || 0) },
    ]);

    // Check if data is ready
    const isDataReady = clients.length > 0 && clients.every(client => client.percentage != null);

    return (
        <Box sx={{ padding: '0 20px' }}>
            <Paper elevation={3} sx={{ padding: '20px 40px', borderRadius: 5 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        overflow: 'clip',
                        overflowX: 'auto',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    {/* Client Title and Number */}
                    <Box>
                        <Typography
                            variant="h6"
                            color={theme.palette.text.gray}
                            fontSize="17px"
                            display="flex"
                            alignItems="center"
                        >
                            <PersonAddAltOutlinedIcon
                                sx={{ marginRight: 1, fontSize: '35px', color: '#D8E0E0' }}
                            />
                            {t('client')}
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: '28px',
                                color: theme.palette.orangePrimary.main,
                                marginLeft: '40px',
                            }}
                        >
                            {Client?.number_branches_clients || 0}
                        </Typography>
                    </Box>

                    {/* Charts Section */}
                    {isDataReady ? (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                {clients.map((client, index) => (
                                    <Box key={client.id}>
                                        <PieChart width={110} height={110}>
                                            <defs>
                                                <linearGradient id={COLORS[index].gradientId} x1="0" y1="0" x2="100%" y2="0">
                                                    <stop offset="0%" stopColor={COLORS[index].start} />
                                                    <stop offset="100%" stopColor={COLORS[index].end} />
                                                </linearGradient>
                                            </defs>
                                            <Pie
                                                data={pieData[index]}
                                                cx={50}
                                                cy={50}
                                                innerRadius={33}
                                                outerRadius={48}
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
                                                x={55}
                                                y={57}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fill={COLORS[index].stroke}
                                                fontSize="18"
                                            >
                                                {`${parseInt(client.percentage)}%`}
                                            </text>
                                        </PieChart>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ minWidth: '330px', height: '110px' }}
                        >
                            <Loader />
                        </Box>
                    )}

                    {/* Legend Section */}
                    {isDataReady ? (
                        <Box sx={{ marginRight: { xs: '0px', sm: '70px' } }}>
                            {clients.map((client, index) => (
                                <Box key={client.id} display="flex" alignItems="center" margin="4px 0px">
                                    <Box
                                        component="span"
                                        sx={{
                                            background: `linear-gradient(to right, ${GRADIENT_STYLES[index].start}, ${GRADIENT_STYLES[index].end})`,
                                            width: '22px',
                                            borderRadius: '20px',
                                            height: '10px',
                                            display: 'inline-block',
                                            marginRight: '8px',
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{ fontSize: '10px', color: theme.palette.text.gray }}
                                    >
                                        {client.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ marginRight: { xs: '0px', sm: '70px' }, minWidth: '100px', height: '60px' }} />
                    )}
                </Box>
            </Paper>
        </Box>
    );
};