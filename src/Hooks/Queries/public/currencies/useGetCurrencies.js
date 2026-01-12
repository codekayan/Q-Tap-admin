
import { useQuery } from "@tanstack/react-query";
import getCurrenciesApi from "../../../../api/public/currency/getCurrencies.service";

export const useGetCurrencies = () => {
    return useQuery({
        queryKey: ['currencies'],
        queryFn: getCurrenciesApi,
    });
};