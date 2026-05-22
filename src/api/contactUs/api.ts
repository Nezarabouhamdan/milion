import { api } from "../../utils/request";
import { useResponse } from "../../composables/useResponse";
import { useToast } from "../../composables/useToast";
import type { AxiosError } from "axios";
import type { ApiResponse, SuccessResponse } from "../../types/response";

const API_URL = "/front/contact-us";
const toast = useToast();
const { handleError } = useResponse();

export async function contactUs(params: Record<string, any>): Promise<boolean> {
	try {
		const response = await api.post(`${API_URL}`, params);
		toast.showToast(response, "success");
		return true;
	} catch (error) {
		handleError(error as AxiosError<ApiResponse>);
		return false;
	}
}
