import { useQuery } from "@tanstack/vue-query";
import { getAreaList } from "../api/area/api";

export function useAreaQuery() {
	return useQuery({ queryKey: ["area-list"], queryFn: getAreaList });
}
