import { useMutation } from "@tanstack/react-query";
import { deletePlanDiscountCouponApi } from "../../../../../api/admin/plan-discount-coupon/actions/deletePlanDiscountCoupon.service";

export const useDeletePlanDiscountCoupon = () => {
    return useMutation({
        mutationFn: ({ coupon_id }) => deletePlanDiscountCouponApi(coupon_id),
    });
};