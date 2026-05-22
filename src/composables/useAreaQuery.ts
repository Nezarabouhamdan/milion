import { useQuery } from "@tanstack/vue-query";
import { fetchAreas } from "../api/property/api";

export function useAreaQuery() {
    return useQuery({ queryKey: ["areas"], queryFn: fetchAreas });
}
