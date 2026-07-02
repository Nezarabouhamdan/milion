import axios from "../../services/axios";
import { api } from "../../utils/request";
import { useResponse } from "../../composables/useResponse";
import { useToast } from "../../composables/useToast";
import type { AxiosError } from "axios";
import type { ApiResponse, SuccessResponse } from "../../types/response";
import type { Vacancy } from "../../types/vacancy";

const API_URL = "/front/vacancy";
const toast = useToast();
const { handleError } = useResponse();

export async function fetchAllVacancies(): Promise<SuccessResponse<Vacancy[]>> {
	const response = await axios.get<SuccessResponse<Vacancy[]>>(`${API_URL}`);
	return response.data.data;
}

export async function applyVacancy(
	params: Record<string, any>,
): Promise<boolean> {
	try {
		const response = await api.post(`${API_URL}/apply`, params);
		toast.showToast(response, "success");
		return true;
	} catch (error) {
		handleError(error as AxiosError<ApiResponse>);
		return false;
	}
}

export async function applyCareerRequest(
	params: Record<string, any>,
): Promise<boolean> {
	try {
		const response = await api.post(`${API_URL}/request`, params);
		toast.showToast(response, "success");
		return true;
	} catch (error) {
		handleError(error as AxiosError<ApiResponse>);
		return false;
	}
}
