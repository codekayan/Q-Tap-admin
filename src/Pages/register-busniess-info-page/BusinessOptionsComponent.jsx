import React from 'react';
import {
    FormControl,
    FormControlLabel,
    Checkbox,
    FormGroup,
    RadioGroup,
    Radio,
    Typography,
    FormHelperText,
    useTheme,
    Box,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const methods = [
    {
        text: "cash",
        icon: (<span className="icon-wallet" style={{ marginRight: '2px', fontSize: "20px" }}>
            <span className="path1"></span><span className="path2"></span><span className="path3"></span>
            <span className="path4"></span><span className="path5"></span><span className="path6"></span>
            <span className="path7"></span><span className="path8"></span><span className="path9"></span>
            <span className="path10"></span><span className="path11"></span><span className="path12"></span>
        </span>)
    },
    {
        text: "wallet",
        icon: (<span className="icon-wallet" style={{ marginRight: '2px', fontSize: "20px" }}>
            <span className="path1"></span><span className="path2"></span><span className="path3"></span>
            <span className="path4"></span><span className="path5"></span><span className="path6"></span>
            <span className="path7"></span><span className="path8"></span><span className="path9"></span>
            <span className="path10"></span><span className="path11"></span><span className="path12"></span>
        </span>),
    },
    {
        text: "card",
        icon: (<img
            src="/assets/cardColor.svg"
            alt="card icon"
            style={{ width: '15px', height: '15px', marginRight: '4px', marginLeft: '-5px' }}
        />),
    },

]

export default function     BusinessOptions({ control, errors }) {

    const { t } = useTranslation()
    const theme = useTheme()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Active Checkbox */}
            <FormControl error={!!errors.active}>
                <Controller
                    name="callWaiter"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...field}
                                    checked={field.value === 'active'}
                                    onChange={(e) => {
                                        const newValue = e.target.checked ? "active" : "inactive";
                                        field.onChange(newValue);
                                    }}
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 22 },
                                        color: "gray",
                                        '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                    }}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="icon-hand-up" style={{ fontSize: "20px", color: 'gray', marginRight: "6px" }}></span>
                                    <Typography sx={{ fontSize: "14px", color: "gray" }}>
                                        {t("activeCallWaiter")}
                                    </Typography>
                                </Box>
                            }
                        />
                    )}
                />
                <FormHelperText>{errors.active?.message}</FormHelperText>
            </FormControl>

            {/* 2. Pricing Way Checkboxes */}
            <FormControl error={!!errors.pricingWay}>
                <Typography variant="body1" sx={{ display: "flex", fontSize: "14px", color: "gray" ,marginBottom:"24px"}}>
                    {t("paymentMethod")}
                </Typography>
                <Controller
                    name="paymentMethods"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                        <>
                            <FormGroup>
                                <Box display="flex" justifyContent="space-between">
                                    {methods.map((method) => (
                                        <FormControlLabel
                                            key={method.text}
                                            control={
                                                <Checkbox
                                                    value={method.text}
                                                    checked={field.value.includes(method.text)}
                                                    onChange={(e) => {
                                                        console.log(field.value)
                                                        const isChecked = e.target.checked;
                                                        const updated = isChecked
                                                            ? [...field.value, method.text]
                                                            : field.value.filter((val) => val !== method.text);
                                                        field.onChange(updated);
                                                    }}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': { fontSize: 22 },
                                                        color: "gray",
                                                        '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {method.icon}
                                                    <span>
                                                        {t(`${method.text}`)}
                                                    </span>
                                                </Box>
                                            }
                                            sx={{ '& .MuiTypography-root': { fontSize: "10px", color: "gray" } }}
                                        />
                                    ))}
                                </Box>
                            </FormGroup>
                            {errors.paymentMethods && (
                                <FormHelperText error sx={{ marginLeft: 2 }}>
                                    {errors.paymentMethods.message || errors.paymentMethods?.[0]?.message}
                                </FormHelperText>
                            )}
                        </>
                    )}
                />
                <FormHelperText>{errors.pricingWay?.message}</FormHelperText>
            </FormControl>

            {/* 3. Pay Time Radio Buttons */}
            <Typography variant="body1" sx={{ display: "flex", fontSize: "14px", color: "gray" }}>
                {t("paymentTime")}
            </Typography>
            <FormControl error={!!errors.payTime}>
                <Controller
                    name="paymentTime"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <>
                            <RadioGroup {...field} row>
                                <Box display="flex" justifyContent="left">

                                    {
                                        [
                                            { value: 'before', text: 'beforeServing' },
                                            { value: 'after', text: 'afterServing' },

                                        ].map(item =>
                                        (<FormControlLabel key={item.value} value={item.value}
                                            control={
                                                <Radio
                                                    sx={{
                                                        '& .MuiSvgIcon-root': { fontSize: 20 },
                                                        color: "gray",
                                                        '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                                    }}
                                                />
                                            }
                                            label={t(`${item.text}`)}
                                            sx={{ '& .MuiTypography-root': { fontSize: "13px", color: "gray" } }}
                                        />)
                                        )
                                    }

                                </Box>
                            </RadioGroup>
                            {
                                errors.paymentTime && (
                                    <FormHelperText error sx={{ marginLeft: 2 }}>
                                        {errors.paymentTime.message}
                                    </FormHelperText>
                                )}
                        </>

                    )}
                />
                <FormHelperText>{errors.payTime?.message}</FormHelperText>
            </FormControl>
        </div >
    );
}
