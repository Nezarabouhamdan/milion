import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { Area } from "../../types/area";

const API_URL = "/front/property/areas";

export async function getAreaList(): Promise<SuccessResponse<Area[]>> {
	const response = await axios.get<SuccessResponse<Area[]>>(API_URL);
	return response.data.data;
}
