import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import { timeOptions } from "../../Component/Business-info/WorkingHoursDays";
import { useEffect, useState } from "react";
import { Button, IconButton, MenuItem, Typography, Grid, useTheme, Box, TextField, Select } from "@mui/material"
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';


const daysOfWeek = [
    { symbol: 'Sa', value: 'Saturday' },
    { symbol: 'Su', value: 'Sunday' },
    { symbol: 'Mo', value: 'Monday' },
    { symbol: 'Tu', value: 'Tuesday' },
    { symbol: 'We', value: 'Wednesday' },
    { symbol: 'Th', value: 'Thursday' },
    { symbol: 'Fr', value: 'Friday' },
];


const WorkDays = ({ watch, setValue, getValues, control, errors }) => {
    const { t } = useTranslation()
    const theme = useTheme()

    const [currentDay, setCurrentDay] = useState('Saturday');

    const handleSelectedDayChange = (action) => {
        const currentIndex = daysOfWeek.findIndex((day) => day.value === currentDay);
        const nextIndex = action === 'prev'
            ? (currentIndex - 1 + daysOfWeek.length) % daysOfWeek.length
            : (currentIndex + 1) % daysOfWeek.length;

        const nextDay = daysOfWeek[nextIndex].value;
        setCurrentDay(nextDay);

        // If no value exists for next day, initialize it
        const values = getValues(`workschedules.${nextDay}`);
        if (!values) {
            setValue(`workschedules.${nextDay}`, ["9:00 am", "5:00 pm"]); // empty times or defaults
        }
    };






    const handleDayToggle = (day) => {
        const current = getValues(`workschedules.${day}`);
        if (current) {
            const prev = getValues("workschedules") || {};

            const updated = { ...prev };
            delete updated[day];
            setValue("workschedules", updated);
        } else {
            setValue(`workschedules.${day}`, ["9:00 am", "5:00 pm"]);
        }
    };


    const selectedDaysWatch = watch("workschedules");

    const isSelected = (day) => Object.keys(selectedDaysWatch || {}).includes(day)

    return (
        <Grid container spacing={2} alignItems="center" sx={{ marginTop: "40px" }}>
            <Typography variant="body1" display="flex" alignItems="center"
                sx={{ fontSize: '15px', marginLeft: "20px" }}>
                <span className="icon-working-hour" style={{ marginRight: "10px", fontSize: "20px" }}>
                    <span className="path1"></span><span className="path2"></span><span className="path3"></span>
                    <span className="path4"></span><span className="path5"></span><span className="path6"></span>
                    <span className="path7"></span><span className="path8"></span>
                </span>
                {t("workHours")}
            </Typography>
            <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
                <Grid item xs={7}>
                    <Box display="flex" flexWrap="wrap">
                        {daysOfWeek.map((day) => (
                            <Button
                                key={day.value}
                                onClick={() => {
                                    console.log("Click")
                                    handleDayToggle(day.value)
                                }}
                                sx={{
                                    minWidth: '25px',
                                    height: "45px",
                                    width: "45px",
                                    margin: '3px',
                                    borderRadius: '5px',
                                    textTransform: "capitalize",
                                    fontSize: "14px",
                                    border: isSelected(day.value) ? '1px solid #ef7d00' : '1px solid gray',
                                    color: isSelected(day.value) ? '#ef7d00' : 'gray',
                                }}
                            >
                                {day.symbol}
                            </Button>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Grid container spacing={2} alignItems="center" justifyContent="end">
                        <Grid item xs={3} display="flex" justifyContent="end" alignItems="center">
                            <Box display="flex" alignItems="center"
                                sx={{
                                    backgroundColor: theme.palette.secondaryColor.main,
                                    borderRadius: '20px',
                                    height: "30px",
                                    padding: "0 5px",
                                }}>
                                <IconButton onClick={() => handleSelectedDayChange('prev')} sx={{ color: '#ef7d00' }}>
                                    <ArrowBackIos sx={{ fontSize: "11px" }} />
                                </IconButton>
                                <Typography sx={{ width: "60px", textTransform: "capitalize", color: 'white', fontSize: "10px" }}>
                                    {t(currentDay.toLowerCase())}
                                </Typography>
                                <IconButton onClick={() => handleSelectedDayChange('next')} sx={{ color: '#ef7d00' }}>
                                    <ArrowForwardIos sx={{ fontSize: "11px" }} />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Box display={"flex"} sx={{ margin: "10px 10px 0 0" }}>
                            <Grid item>
                                <Typography variant='body1' sx={{ fontSize: '11px', color: "gray", mr: 1 }}>{t("from")}</Typography>
                            </Grid>
                            <Grid item>
                                <Controller
                                    key={`${currentDay}-0`}
                                    name={`workschedules.${currentDay}.0`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            fullWidth

                                            size="small"
                                            sx={{ width: "90px", height: "30px" }}
                                            inputProps={{ sx: { padding: '2px 10px', fontSize: '12px' } }}
                                            SelectProps={{
                                                MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 150, // <-- 👈 الارتفاع الثابت للقائمة المنسدلة (يمكنك تعديله)
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            {timeOptions.map((t) => (
                                                <MenuItem key={`${t}-${currentDay}-0`} value={t}>{t}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />

                            </Grid>
                        </Box>
                        <Box display={"flex"} sx={{ margin: "3px 10px" }}>
                            <Grid item>
                                <Typography variant='body1' sx={{ fontSize: '11px', color: "gray", mr: 1 }}>{t("to")}</Typography>
                            </Grid>
                            <Grid item>
                                <Controller
                                    key={`${currentDay}-1`}
                                    name={`workschedules.${currentDay}.1`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            fullWidth

                                            size="small"
                                            sx={{ width: "90px", height: "30px" }}
                                            inputProps={{ sx: { padding: '2px 10px', fontSize: '12px' } }}
                                            SelectProps={{
                                                MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 150, // <-- 👈 الارتفاع الثابت للقائمة المنسدلة (يمكنك تعديله)
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            {timeOptions.map((t) => (
                                                <MenuItem key={`${t}-${currentDay}-1`} value={t}>{t}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </Grid>
                        </Box>

                    </Grid>
                </Grid>
            </Grid>
            {Object.entries(errors.workschedules ?? {}).map(([day, errorObj]) => (
                errorObj?.root?.message && (
                    <Typography key={day} color="error">
                        {day}: {errorObj.root.message}
                    </Typography>
                )
            ))}
        </Grid>
    )
}


export default WorkDays