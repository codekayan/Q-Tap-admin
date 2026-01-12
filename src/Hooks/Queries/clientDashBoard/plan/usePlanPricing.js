import { useQuery } from "@tanstack/react-query";
import { getPlanPricingApi } from "../../../../api/Client/plan/getPlans";

export const usePlanPricing = () => {
  return useQuery({
    queryKey: ['plan-pricing'],
    queryFn: getPlanPricingApi,
  });
};