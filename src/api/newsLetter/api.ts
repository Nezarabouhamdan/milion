import { api } from "../../utils/request";
import { useResponse } from "../../composables/useResponse";
import { useToast } from "../../composables/useToast";
import type { AxiosError } from "axios";
import type { ApiResponse, SuccessResponse } from "../../types/response";

const API_URL = "/front/news-letter";
const toast = useToast();
const { handleError } = useResponse();

export async function useNewsletter(
	params: Record<string, any>,
): Promise<boolean> {
	try {
		const response = await api.post(`${API_URL}/subscribe`, params);
		toast.showToast(response, "success");
		return true;
	} catch (error) {
		handleError(error as AxiosError<ApiResponse>);
		return false;
	}
}
