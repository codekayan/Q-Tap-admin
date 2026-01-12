import { useQuery } from "@tanstack/react-query";
import { getPlanDiscoutnCouponApi } from "../../../../api/admin/plan-discount-coupon/getPlanDiscountCoupon.service";


export const useGetDiscountCouponsQueryKey = 'discount-coupons'

export const useGetPlanDiscountCoupons = () => {
    return useQuery({
        queryKey: [useGetDiscountCouponsQueryKey],
        queryFn: () => getPlanDiscoutnCouponApi(),

    });
};