// composables/useVacanciesQuery.ts
import { useQuery } from "@tanstack/vue-query";
import { fetchAllVacancies } from "../api/vacancy/api";

export function useVacanciesQuery(enabled = true) {
	return useQuery({
		queryKey: ["vacancies"],
		queryFn: fetchAllVacancies,
		enabled,
	});
}
