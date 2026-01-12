import { useMutation } from "@tanstack/react-query";
import { createPlanDiscountCouponApi } from "../../../../../api/admin/plan-discount-coupon/actions/createPlanDiscountCoupon.service";

export const useCreatePlanDiscountCoupon = () => {
    return useMutation({
        mutationFn: ({ data }) => createPlanDiscountCouponApi(data),
    });
};