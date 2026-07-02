import { getTeams } from "../api/team/api";
import { useQuery } from "@tanstack/vue-query";

export function useTeamsQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["teams"],
		queryFn: getTeams,
		enabled: enabled,
	});
}
