import { useState, useEffect } from "react";
import { COUNTRIES_CODES } from "../../utils/constant-variables/countries-codes";
import { useTranslation } from "react-i18next";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useTheme } from "@emotion/react";
import { useResendPhoneOtp } from "../../Hooks/Queries/phone-validation-register/useResendPhoneOtp";
import { useSendPhoneOtp } from "../../Hooks/Queries/phone-validation-register/useSendPhoneOtp";
import { useVerifyPhoneOtp } from "../../Hooks/Queries/phone-validation-register/useVerifyPhoneOtp";
import { toast } from "react-toastify";

const PhoneFieldWithOtp = ({
  phone,
  setPhone,
  setCountryCode,
  countryCode,
  otp,
  setOtp,
  isPhoneVerify,
  setPhoneVerify,
  isRounded = true,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [error, setError] = useState("");
  const [isVerifiedStep, setIsVerifiedStep] = useState(false);
  const [timer, setTimer] = useState(0);

  const { mutate: resendOtp, isPending: isPendingResend } = useResendPhoneOtp();
  const { mutate: sendOtp, isPending: isPendingSend } = useSendPhoneOtp();
  const { mutate: verifyOtp, isPending: isPendingVerify } = useVerifyPhoneOtp();

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    setPhone(value);
    setPhoneVerify(false);
    setIsVerifiedStep(false);
    setOtp("");
  };

  const validatePhone = () => {
    try {
      const parsed = parsePhoneNumberFromString(phone, countryCode);
      if (!parsed?.isValid()) throw new Error("Invalid number");
      setError("");
      return true;
    } catch {
      setError("InvalidPhoneNumber");
      return false;
    }
  };
  const handleVerifyOtp = () => {
    verifyOtp(
      { phone_number: `${countryCode}${phone}`, otp_code: otp },
      {
        onError: (err) => {
          console.log("handleVerifyOtp error:", err);
          toast.error("some thing go wrong");
        },
        onSuccess: (res) => {
          console.log("handleVerifyOtp response:", res);
          setPhoneVerify(true);
          toast.success(res?.data?.message);
        },
      }
    );
  };
  const handleResendOtp = () => {
    resendOtp(
      { phone_number: `${countryCode}${phone}` },
      {
        onError: (err) => {
          console.log("resendOtp error:", err);
          toast.error("some thing go wrong");
        },
        onSuccess: (res) => {
          console.log("resendOtp response:", res);
          setTimer(30);
          toast.success(res?.data?.message);
        },
      }
    );
  };

  const handleVerifyClick = () => {
    if (validatePhone()) {
      sendOtp(
        { phone_number: `${countryCode}${phone}` },
        {
          onError: (err) => {
            console.log("sendOtp error:", err);
            toast.error("some thing go wrong");
          },
          onSuccess: (res) => {
            console.log("sendOtp response:", res);
            setIsVerifiedStep(true);
            setTimer(30);
            toast.success(res?.data?.message);
          },
        }
      );
    }
  };

  // countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const canVerify = countryCode && phone && !error;

  return (
    <div className="space-y-2">
      {/* Phone field */}
      <div className="flex gap-2 mt-2">
        <Select value={countryCode} onValueChange={setCountryCode}>
          <SelectTrigger
            style={{
              "--border-color": theme.palette.action.disabled,
              "--hover-border-color": theme.palette.text.primary,
            }}
            className={`${
              isRounded ? "rounded-[9999px]" : ""
            } border border-[var(--border-color)] hover:border-[var(--hover-border-color)] w-[110px] focus:ring-2 focus:ring-primary focus:outline-none`}
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

        <div className="relative w-full">
          <PhoneOutlinedIcon
            sx={{ fontSize: "18px" }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="tel"
            style={{
              "--border-color": theme.palette.action.disabled,
              "--hover-border-color": theme.palette.text.primary,
            }}
            className={`${
              isRounded ? "rounded-[9999px]" : ""
            } pl-10 border border-[var(--border-color)] hover:border-[var(--hover-border-color)] focus:ring-primary focus:border-primary`}
            placeholder="123 456 789"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={validatePhone}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{t(`validation.${error}`)}</p>
      )}

      {/* Verify button */}
      {!isVerifiedStep && canVerify && !isPhoneVerify && (
        <Button
          onClick={handleVerifyClick}
          className="w-full mt-2"
          disabled={isPendingSend}
        >
          {t("Verify")}
        </Button>
      )}

      {/* OTP step */}
      {isVerifiedStep && !isPhoneVerify && (
        <div className="space-y-2 mt-2">
          <Input
            type="text"
            placeholder={t("Enter OTP")}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            onClick={handleVerifyOtp}
            className="w-full mt-2"
            disabled={isPendingVerify}
          >
            {t("send")}
          </Button>
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              {t("Resend in")} {timer}s
            </p>
          ) : (
            <Button
              variant="outline"
              onClick={handleResendOtp}
              className="w-full"
              disabled={isPendingResend}
            >
              {t("Resend OTP")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneFieldWithOtp;
