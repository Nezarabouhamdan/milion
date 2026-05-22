import { fetchPropertyBySlug } from "../api/property/api";
import { useQuery } from "@tanstack/vue-query";

export function usePropertyDetail(slug: string) {
	return useQuery({
		queryKey: ["blog", slug],
		queryFn: () => fetchPropertyBySlug(slug),
		enabled: !!slug,
	});
}
