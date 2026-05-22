import { useQuery } from "@tanstack/vue-query";
import { fetchFeaturedProperties } from "../api/property/api";

export function useFeaturedPropertyQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["featured-property"],
		queryFn: fetchFeaturedProperties,
		enabled: enabled,
	});
}
