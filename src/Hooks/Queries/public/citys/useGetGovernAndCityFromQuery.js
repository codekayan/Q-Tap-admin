import { useGetEgyptCityByGovernID } from "./useGetEgyptCityByGovernID"
import { useGetEgyptGovern } from "./useGetEgyptGovern"

const useGetGovernAndCityFromQuery = (country) => {
    const { data: govern, isPending: loadingGovern } = useGetEgyptGovern()
    const { data: citys, isPending: loadingCities } = useGetEgyptCityByGovernID({ govern_id: (country.id || 1) })
   
    const governValue = govern?.data?.data || []
    const citysValue = citys?.data.data || []


    return { governValue, citysValue, loadingCities, loadingGovern }
}


export default useGetGovernAndCityFromQuery