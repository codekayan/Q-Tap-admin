import { Box, Divider, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formateDate } from '../../../../utils/formateDateFn'
import { orderPhaseType } from './OrderBody';
const Footer = ({ selectedOrder }) => {
    const { t } = useTranslation()
    const theme = useTheme()

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.secondaryColor.main,
                color: '#fff',
                padding: '10px',
                position: "fixed",
                marginTop: "auto",
                bottom: 0,
                width: selectedOrder ? { xs: '80%', md: "78%" } : { xs: "100%" },
                transition: "width 0.3s ease-in-out",
                display: "flex", zIndex: 1000,
            }}
        >
            <img src="/assets/qtapwhite.svg" alt="icon_footer" style={{ width: "80px", height: "25px" }} />
            {
                selectedOrder ?
                    (
                        <Box
                            display="flex"
                            alignItems="center"
                            marginLeft={"20px"}
                        >
                            <span class="icon-online-shop"
                                style={{
                                    backgroundImage: "linear-gradient(to right, #FDB913, #F2672E)",
                                    color: "black", padding: "8px", borderRadius: "25px"
                                }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>


                            <Box ml={1} sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="body2" color="#FFA500" fontSize={"9px"}>{t("orderPlaced")}</Typography>
                                <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(selectedOrder.created_at).time}</Typography>
                                <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(selectedOrder.created_at).formattedDate}</Typography>
                            </Box>
                            <Divider
                                sx={{
                                    backgroundColor: '#C0C0C0',
                                    height: '1px',
                                    width: '40px',
                                    margin: '0px 15px'
                                }}
                            />
                        </Box>
                    ) : (
                        <></>
                    )
            }
            {/* selectedOrder?.orders_processing?.some(item => item.status === "accepted") && */}
            {
                selectedOrder?.orders_processing?.map((item) => {

                    return item.status === "accepted" && (
                        <Box
                            display="flex"
                            alignItems="center"
                        >
                            <span class="icon-check"
                                style={{
                                    backgroundImage: "linear-gradient(to right, #FDB913, #F2672E)",
                                    color: "black", padding: "8px", borderRadius: "25px"
                                }} ></span>

                            <Box ml={1} sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="body2" color="#FFA500" fontSize={"9px"}>{t("accepted")}</Typography>
                                <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(item.created_at).time}</Typography>
                                <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(item.created_at).formattedDate}</Typography>
                            </Box>
                            <Divider
                                sx={{
                                    backgroundColor: '#C0C0C0',
                                    height: '1px',
                                    width: '40px',
                                    margin: '0px 15px'
                                }}
                            />
                        </Box>
                    )
                })

            }
            {
                selectedOrder?.orders_processing?.map((item) => {

                    return item.status === "prepared" && (
                        <>
                            <Box
                                display="flex"
                                alignItems="center"
                            >

                                <Box sx={{
                                    backgroundImage: "linear-gradient(to right, #FDB913, #F2672E)",
                                    color: "black", padding: "7px 8px", borderRadius: "50%"
                                }} >
                                    <span class="icon-chef" style={{ fontSize: "16px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                </Box>

                                <Box ml={1} sx={{ display: "flex", flexDirection: "column" }} >
                                    <Typography variant="body2" color="#FFA500" fontSize={"9px"}>{t("prepared")}</Typography>
                                    <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(item.created_at).time}</Typography>
                                    <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(item.created_at).formattedDate}</Typography>
                                </Box>
                                <Divider
                                    sx={{
                                        backgroundColor: '#C0C0C0',
                                        height: '1px',
                                        width: '40px',
                                        margin: '0px 15px'
                                    }}
                                />
                            </Box>
                        </>
                    )
                })
            }
            {
                selectedOrder?.orders_processing?.map((item) => {

                    return item.status === "served" && (
                        <Box
                            display="flex"
                            alignItems="center"
                        >
                            <Box sx={{
                                backgroundImage: "linear-gradient(to right, #FDB913, #F2672E)",
                                color: "black", padding: "7px 8px", borderRadius: "50%"
                            }} >
                                <span class="icon-waiter" style={{ fontSize: "16px", color: "white" }}></span>
                            </Box>

                            <Box ml={1} sx={{ display: "flex", flexDirection: "column" }} >
                                <Typography variant="body2" color="#FFA500" fontSize={"9px"}>{t("served")}</Typography>
                                <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(item.created_at).time}</Typography>
                                <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(item.created_at).formattedDate}</Typography>
                            </Box>
                            <Divider
                                sx={{
                                    backgroundColor: '#C0C0C0',
                                    height: '1px',
                                    width: '40px',
                                    margin: '0px 15px'
                                }}
                            />
                        </Box>
                    )
                })
            }
            {
                selectedOrder?.orders_processing?.map((item) => {
                    return item.status === 'close'&&(
                        <Box
                            display="flex"
                            alignItems="center"
                        >
                            <Box sx={{
                                backgroundImage: "linear-gradient(to right, #FDB913, #F2672E)",
                                padding: "8px", borderRadius: "50%"
                            }} >
                                <span class="icon-double-check" style={{ fontSize: "16px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>
                            </Box>
                            <Box ml={1} sx={{ display: "flex", flexDirection: "column" }} >
                                <Typography variant="body2" color="#FFA500" fontSize={"9px"}>{t("done")}</Typography>
                                <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(item.created_at).formattedDate}</Typography>
                                <Typography variant="caption" color="#FFFFFF" fontSize={"8px"}>{formateDate(item.created_at).time}</Typography>
                            </Box>

                        </Box>
                    ) })
            }
        </Box>
    );
};

export default Footer;
