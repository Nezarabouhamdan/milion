import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { Slider } from "../../types/sliders";

const API_URL = "/front/sliders/all";

export async function getActiveSliders(): Promise<SuccessResponse<Slider[]>> {
	const response = await axios.get<SuccessResponse<Slider[]>>(API_URL);
	return response.data;
}
