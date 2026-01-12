import { useMutation } from "@tanstack/react-query";
import { resendEmailOtpApi } from "../../../../api/Client/register/resendEmailOtp.service";





export const useResendEmailOtp = () => {
    return useMutation({
        mutationFn: ({ data }) => resendEmailOtpApi({ data }),
    });
};