import { api } from "../../utils/request";
import { useResponse } from "../../composables/useResponse";
import { useToast } from "../../composables/useToast";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../../types/response";

const API_URL = "/front/enquire";
const toast = useToast();
const { handleError } = useResponse();

export async function enquireForBuying(
    params: Record<string, any>,
): Promise<boolean> {
    try {
        const response = await api.post(`${API_URL}`, params);
        toast.showToast(response, "success");
        return true;
    } catch (error) {
        handleError(error as AxiosError<ApiResponse>);
        return false;
    }
}

export async function enquireForSelling(
    params: Record<string, any>,
): Promise<boolean> {
    try {
        const response = await api.post(`${API_URL}/sell`, params);
        toast.showToast(response, "success");
        return true;
    } catch (error) {
        handleError(error as AxiosError<ApiResponse>);
        return false;
    }
}
