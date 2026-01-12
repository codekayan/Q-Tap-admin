import { useMutation } from "@tanstack/react-query";
import sendPhoneOtpApi from "../../../api/phone-validation-register/sendOtp.service";





export const useSendPhoneOtp = () => {
    return useMutation({
        mutationFn: ({phone_number}) => sendPhoneOtpApi(phone_number),
    });
};