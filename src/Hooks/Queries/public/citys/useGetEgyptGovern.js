import { useQuery } from "@tanstack/react-query";
import { getClintPlan } from "../../../../api/Client/plan/getPlans";
import getEgyptGovernoralesService from "../../../../api/public/citys/getEgyptGovernorales.service";

export const useGetEgyptGovern = () => {
  return useQuery({
    queryKey: ['Egypt-Govern'],
    queryFn: getEgyptGovernoralesService,
  });
};