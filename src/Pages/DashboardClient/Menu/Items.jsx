import React from 'react';
import { Box, Typography, Card, CardMedia, Grid, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BASE_URL, BASE_URL_IMG } from "../../../utils/constants"

const Item = ({ item, onItemSelect, handleAddToCart }) => {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', padding: '15px' }}>
            <Box>
                <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
                    <Card
                        sx={{
                            cursor: 'pointer',
                            borderRadius: '10px 10px 0px 10px',
                            padding: '13px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            background :theme.palette.bodyColor.white_333
                        }}
                        onClick={() => onItemSelect(item.id)}
                    >
                        <CardMedia
                            component="img"
                            image={`${BASE_URL_IMG}${item.img}`}
                            alt={item.name}
                            sx={{
                                height: "150px",
                                width: "150px",
                                borderRadius: '10px',
                                objectFit: 'cover',
                            }}
                        />
                        <Box sx={{ flex: 1, padding: '0px 10px', marginTop: '10px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography
                                        variant="h1"
                                        sx={{ fontSize: '12px', fontWeight: '900', color: theme.palette.text.gray_white }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ fontSize: '9px', mb: 1, marginTop: '5px' }}
                                    >
                                        {item.Brief}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex' }}>
                                    <span
                                        className="icon-star"
                                        style={{ fontSize: '10px', marginRight: '3px', color: 'orange' }}
                                    ></span>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ fontSize: '9px' }}
                                    >
                                        {item.rating || '4.5'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    marginTop: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: theme.palette.orangePrimary.main,
                                        }}
                                    >
                                        {item.price}{' '}
                                        <span style={{ color: 'gray', fontSize: '8px' }}>EGP</span>
                                    </Typography>
                                </Box>
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart();
                                    }}
                                    sx={{
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: theme.palette.orangePrimary.main,
                                        color: 'white',
                                        borderRadius: '50%',
                                        padding: '6px',
                                        display: 'flex',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: '13px' }} />
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Box>
        </Box>
    );
};

export default Item;