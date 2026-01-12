// import { FormControl, InputAdornment, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useState } from 'react'
import { COUNTRIES_CODES } from '../../utils/constant-variables/countries-codes';
import { useTranslation } from 'react-i18next';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { useTheme } from '@emotion/react';


const PhoneField = ({ phone, setPhone, setCountryCode, countryCode, isRounded = true }) => {
    const { t } = useTranslation()
    const theme = useTheme();
    const [error, setError] = useState("");

    const handlePhoneChange = (e) => {
        // Always store as string, not number
        let value = e.target.value;

        // Remove non-numeric characters
        value = value.replace(/[^0-9]/g, "");

        // Remove leading zero if exists
        value = value.replace(/^0+/, "");

        setPhone(value);
    };

    const validatePhone = () => {
        try {
            const parsed = parsePhoneNumberFromString(phone, countryCode);
            if (!parsed?.isValid()) throw new Error("Invalid number");
            setError("");
        } catch {
            setError("InvalidPhoneNumber");
        }
    };


    return (<>
        <div className="space-y-2">
            {/* <Label>Phone Number</Label> */}
            <div className="flex gap-2  mt-2">
                <Select value={countryCode} onValueChange={setCountryCode} className="" >
                    <SelectTrigger
                        style={{
                            '--border-color': theme.palette.action.disabled,
                            '--hover-border-color': theme.palette.text.primary
                        }}
                        className={`${isRounded ? "rounded-[9999px]" : ""} border border-[var(--border-color)] hover:border-[var(--hover-border-color)] w-[110px]  focus:ring-2 focus:ring-primary focus:outline-none`}
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                        className="max-h-60 overflow-y-auto"
                        style={{
                            borderColor: theme.palette.divider,
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {COUNTRIES_CODES.map((c) => (
                            <SelectItem key={c.code} value={c.label}>
                                {c.label} {c.code}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="relative  w-full">
                    <PhoneOutlinedIcon sx={{ fontSize: "18px" }} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="tel"
                        style={{
                            '--border-color': theme.palette.action.disabled,
                            '--hover-border-color': theme.palette.text.primary
                        }}
                        className={`${isRounded ? "rounded-[9999px]" : ""} pl-10 border border-[var(--border-color)] hover:border-[var(--hover-border-color)] focus:ring-primary focus:border-primary`}
                        placeholder="123 456 789"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={validatePhone}
                    />
                </div>

            </div>
            {error && <p className="text-sm text-red-500">{t(`validation.${error}`)}</p>}
        </div>
    </>)

}

export default PhoneField