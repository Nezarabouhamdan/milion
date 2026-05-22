import { useQuery } from "@tanstack/vue-query";
import { fetchAmenities } from "../api/property/api";

export function useAmenityQuery() {
    return useQuery({ queryKey: ["amefities"], queryFn: fetchAmenities });
}
