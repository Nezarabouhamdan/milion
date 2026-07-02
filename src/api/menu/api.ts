import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { Menu } from "../../types/menu";

const API_URL = "/front/menu";

export async function getMenu(): Promise<SuccessResponse<Menu[]>> {
    const response = await axios.get<SuccessResponse<Menu[]>>(API_URL);
    return response.data.data;
}
