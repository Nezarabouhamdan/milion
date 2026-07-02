import { useQuery } from "@tanstack/vue-query";
import { fetchHolidayHome } from "../api/holidayHome/api";

export function useHolidayHome(enabled: boolean) {
    return useQuery({
        queryKey: ["holiday-home"],
        queryFn: fetchHolidayHome,
        enabled: enabled,
    });
}
