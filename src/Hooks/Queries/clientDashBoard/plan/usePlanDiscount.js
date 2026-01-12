import { useQuery } from "@tanstack/react-query";
import { getPlanDiscount } from "../../api/Client/getDiscountsForPlane";

export const usePlanDiscount = () => {
    return useQuery({
        queryKey: ['plan-discount'],
        queryFn: getPlanDiscount,
    });
};