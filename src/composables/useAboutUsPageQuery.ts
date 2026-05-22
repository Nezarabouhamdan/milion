import { useQuery } from "@tanstack/vue-query";
import { fetchAboutUs } from "../api/aboutUs/api";

export function useAboutUsQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["about-us"],
		queryFn: fetchAboutUs,
		enabled: enabled,
	});
}
