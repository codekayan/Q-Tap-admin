import { Controller } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"

import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useTheme } from "@emotion/react";
import { COUNTRIES_CODES } from "../../utils/constant-variables/countries-codes";


export const PhoneFieldReactFormHook = ({ control, errors, isRounded = false, countryCodeName = "countryCode", phoneName = "phone" }) => {
    const theme = useTheme();
    function getError(errors, name) {
        return name.split('.').reduce((acc, key) => acc?.[key], errors);
    }

    const codeError = getError(errors, countryCodeName);
    const phoneError = getError(errors, phoneName);
    return (
        <>
            <div className="flex gap-2">
                {/* Country Code Select */}
                <Controller
                    name={countryCodeName}
                    control={control}
                    render={({ field }) => (
                        <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger
                                style={{
                                    "--border-color": codeError
                                        ? theme.palette.error.main
                                        : theme.palette.action.disabled,
                                    "--hover-border-color": codeError
                                        ? theme.palette.error.main
                                        : theme.palette.text.primary
                                }}
                                className={`${isRounded ? "rounded-[9999px]" : ""} border border-[var(--border-color)] hover:border-[var(--hover-border-color)] w-[110px] focus:ring-2 focus:ring-primary focus:outline-none`}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                                className="max-h-60 overflow-y-auto"
                                style={{
                                    borderColor: theme.palette.divider,
                                    backgroundColor: theme.palette.background.paper,
                                    color: theme.palette.text.primary
                                }}
                            >
                                {COUNTRIES_CODES.map((c, index) => (
                                    <SelectItem key={`${countryCodeName}-${c.code}-${c.label}-${index}`} value={c.label}>
                                        {c.label} {c.code}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Phone Input */}
                <div className="relative w-full">
                    <PhoneOutlinedIcon
                        sx={{ fontSize: "18px" }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Controller
                        name={phoneName}
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Input
                                    {...field}
                                    type="tel"
                                    style={{
                                        "--border-color": phoneError
                                            ? theme.palette.error.main
                                            : theme.palette.action.disabled,
                                        "--hover-border-color": phoneError
                                            ? theme.palette.error.main
                                            : theme.palette.text.primary
                                    }}
                                    className={`${isRounded ? "rounded-[9999px]" : ""} pl-10 border border-[var(--border-color)] hover:border-[var(--hover-border-color)] focus:ring-primary focus:border-primary`}
                                    placeholder="123 456 789"
                                />
                            </div>
                        )
                        }
                    />

                </div>
            </div>

            {/* Validation errors */}
            <div className="flex gap-2" >

                {codeError && (
                    <p className="text-sm text-red-500">{codeError.message}</p>
                )}

                {phoneError && (
                    <p className="text-sm text-red-500">{phoneError.message}</p>
                )}
            </div>
        </>
    )
}