import { useQuery } from "@tanstack/vue-query";
import { fetchAboutUsSection } from "../api/aboutUs/api";

export function useAboutUsSectionQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["about-us-section"],
		queryFn: fetchAboutUsSection,
		enabled: enabled,
	});
}
