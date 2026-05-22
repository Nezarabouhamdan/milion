import axios from "../../services/axios";
import type { SingleSuccessResponse } from "../../types/response";
import type { SettingsResponse } from "../../types/settings";

const API_URL = "/front/settings";

export async function fetchSettings(): Promise<
	SingleSuccessResponse<SettingsResponse>
> {
	const response = await axios.get<SingleSuccessResponse<SettingsResponse>>(
		`${API_URL}`,
	);
	return response.data?.data;
}
