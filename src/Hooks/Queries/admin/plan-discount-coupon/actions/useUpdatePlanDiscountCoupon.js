import { useMutation } from "@tanstack/react-query";
import { updatePlanDiscountCouponApi } from "../../../../../api/admin/plan-discount-coupon/actions/updatePlanDiscountCoupon.service";

export const useUpdatePlanDiscountCoupon = () => {
    return useMutation({
        mutationFn: ({ coupon_id, data }) => updatePlanDiscountCouponApi(coupon_id, data),
    });
};