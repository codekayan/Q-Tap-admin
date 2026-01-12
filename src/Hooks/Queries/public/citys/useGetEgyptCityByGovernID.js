import { useQuery } from "@tanstack/react-query";
import { getClintPlan } from "../../../../api/Client/plan/getPlans";
import getEgyptCityByGovernIdService from "../../../../api/public/citys/getEgyptCityByGovernId.service";

export const useGetEgyptCityByGovernID = ({ govern_id }) => {
    return useQuery({
        queryKey: ['Egypt-city-by-Govern', govern_id],
        queryFn: () => getEgyptCityByGovernIdService(
            {
                govern_id
            }
        ),
    });
};