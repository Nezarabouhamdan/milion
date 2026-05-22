import { useQuery } from "@tanstack/vue-query";
import axios from "../services/axios";
import type { Slider } from "../types/sliders";
import type { SuccessResponse } from "../types/response";

const API_URL = "/front/sliders/all";

async function fetchSliders(): Promise<Slider[][]> {
	const { data } = await axios.get<SuccessResponse<Slider[]>>(API_URL);
	return data.data;
}

export function useSlidersQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["sliders"],
		queryFn: fetchSliders,
		enabled: enabled,
	});
}
