import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { TeamCategory } from "../../types/team";

const API_URL = "/front/team/all";

export async function getTeams(): Promise<SuccessResponse<TeamCategory[]>> {
	const response = await axios.get<SuccessResponse<TeamCategory[]>>(API_URL);
	return response.data.data;
}
