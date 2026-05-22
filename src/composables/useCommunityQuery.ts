import { useQuery } from "@tanstack/vue-query";
import { fetchCommunities } from "../api/property/api";

export function useCommunityQuery() {
    return useQuery({ queryKey: ["communities"], queryFn: fetchCommunities });
}
