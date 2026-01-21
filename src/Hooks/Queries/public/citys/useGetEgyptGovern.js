import { useQuery } from "@tanstack/react-query";
import getEgyptGovernoralesService from "../../../../api/public/citys/getEgyptGovernorales.service";

export const useGetEgyptGovern = () => {
  return useQuery({
    queryKey: ['Egypt-Govern'],
    queryFn: getEgyptGovernoralesService,
  });
};