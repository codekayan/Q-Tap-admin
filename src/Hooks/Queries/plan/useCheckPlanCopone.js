import { useMutation } from "@tanstack/react-query";
import { registerNewUserApi } from "../../../api/Client/register/registerNewUser.service";
import { checkPlanDiscountCouponApi } from "../../../api/Client/plan/actions/check.plan.discount.coupon.service";





export const useCheckDiscountCoupon = () => {
    return useMutation({
        mutationFn: ({ data }) => checkPlanDiscountCouponApi({ data }),
    });
};