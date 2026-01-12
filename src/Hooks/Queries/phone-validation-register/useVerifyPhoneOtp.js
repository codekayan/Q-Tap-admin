import { useMutation } from "@tanstack/react-query";
import verifyPhoneOtpApi from "../../../api/phone-validation-register/verifyPhoneOtp.service";





export const useVerifyPhoneOtp = () => {
    return useMutation({
        mutationFn: ({phone_number, otp_code}) => verifyPhoneOtpApi(phone_number, otp_code),
    });
};