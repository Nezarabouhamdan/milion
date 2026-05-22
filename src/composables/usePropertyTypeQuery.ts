import { useQuery } from "@tanstack/vue-query";
import { fetchPropertyTypes } from "../api/property/api";

export function usePropertyTypeQuery() {
    return useQuery({
        queryKey: ["property-types"],
        queryFn: fetchPropertyTypes,
    });
}
