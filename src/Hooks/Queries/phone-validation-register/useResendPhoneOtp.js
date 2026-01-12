import { useMutation } from "@tanstack/react-query";
import resendPhoneOtpApi from "../../../api/phone-validation-register/resendOtp.service";





export const useResendPhoneOtp = () => {
    return useMutation({
        mutationFn: ({phone_number}) => resendPhoneOtpApi(phone_number),
    });
};