import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Typography, Divider } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { useTranslation } from 'react-i18next';
export const UsersLog = ({ users_logs }) => {
    const rows = [
        { userName: 'Admin', time: '11:15 PM', date: '22.06.2024', status: 'Active now', statusColor: 'orange' },
        { userName: 'Kitchen', time: '11:15 PM', date: '22.06.2024', status: 'Active now', statusColor: 'orange' },
        { userName: 'Pos', time: '11:15 PM', date: '22.06.2024', status: 'Inactive', statusColor: 'gray' },
        {}, {}, {}, {}

    ];
    const { t } = useTranslation();
    const theme = useTheme()
    return (
        <TableContainer component={Paper} sx={{ borderRadius: "20px", boxShadow: 'none', minHeight: "50vh", maxHeight: "62vh", overflow: 'auto' }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ padding: "20px 20px 0px 20px" }}>
                <Grid item>
                    <Typography variant="body1" component="div" sx={{ fontSize: '13px', color: theme.palette.text.gray_white }}>
                        {t("usersLog")}
                    </Typography>
                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/assets/Clients.svg" alt="icon" style={{ color: theme.palette.text.gray_white , width: "18px", height: "18px" }} />
                    </Box>
                </Grid>
                <Divider
                    sx={{
                        width: '100%',
                        borderBottomWidth: '1px',
                        borderColor: 'orange',
                        textAlign: 'center',
                        marginTop: "5px"
                    }}
                />
            </Grid>


            <Table sx={{ borderCollapse: 'separate', borderSpacing: '0px', padding: "10px" }}>
                <TableHead>
                    <TableRow sx={{ height: "30px" }}>
                        <TableCell sx={{ textAlign: "left", fontSize: "11px", border: 'none', padding: "0px 20px" }}>{t("username")}</TableCell>
                        <TableCell sx={{ textAlign: "center", fontSize: "11px", border: 'none', padding: "0px 0px" }}>{t("time")}</TableCell>
                        <TableCell sx={{ textAlign: "center", fontSize: "11px", border: 'none', padding: "0px 0px" }}>{t("time")}</TableCell>
                        <TableCell sx={{ textAlign: "center", fontSize: "11px", border: 'none', padding: "0px 0px" }}>{t("status")}</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody  >
                    {users_logs?.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                padding: '0px',
                                height: '30px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                margin: '2px 0px',
                                backgroundColor: index % 2 == 0 ? theme.palette.bodyColor.secandaryInput : '',
                                '& td:first-of-type': {
                                    borderTopLeftRadius: '20px',
                                    borderBottomLeftRadius: '20px',
                                },
                                '& td:last-of-type': {
                                    borderTopRightRadius: '20px',
                                    borderBottomRightRadius: '20px',
                                },
                            }}

                        >
                            <TableCell sx={{ textAlign: 'center', border: 'none', padding: '0px', fontSize: '11px', color: theme.palette.secondaryColor.main }}>
                                <Box
                                    sx={{
                                        padding: '0px 8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color:theme.palette.text.black_white
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '0px 3px',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            marginRight: '8px',
                                        }}
                                    >
                                        <PersonOutlineOutlinedIcon sx={{ color: 'gray', fontSize: '15px' }} />
                                    </Box>
                                    {row.user.name}
                                </Box>
                            </TableCell>

                            <TableCell sx={{ textAlign: 'center', border: 'none', fontSize: '11px', color: 'gray', padding: '0px' }}>
                                {new Date(row.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', border: 'none', fontSize: '11px', color: 'gray', padding: '0px' }}>
                                {new Date(row.updated_at).toISOString().split('T')[0].split('-').join('.')}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', border: 'none', fontSize: '11px', color: row.status=="active" ?"orange" :"gray", padding: '0px' }}>
                                {row.status ? <CircleIcon sx={{ fontSize: "7px" }} /> : null} {t(row.status)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
    );
};
