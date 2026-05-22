import { getMenu } from "../api/menu/api";
import { useQuery } from "@tanstack/vue-query";

export function useMenuQuery(enabled = true) {
	return useQuery({
		queryKey: ["menu-header"],
		queryFn: getMenu,
		enabled,
	});
}
