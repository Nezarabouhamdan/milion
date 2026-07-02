import { getWhyChooseUs } from "../api/whyChooseUs/api";
import { useQuery } from "@tanstack/vue-query";

export function useWhyChooseUsQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["why-choose-us"],
		queryFn: getWhyChooseUs,
		enabled: enabled,
	});
}
