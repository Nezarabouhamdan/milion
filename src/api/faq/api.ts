import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { FAQCategory } from "../../types/faq";

const API_URL = "/front/faqs/all";

export async function getFAQs(): Promise<SuccessResponse<FAQCategory[]>> {
    const response = await axios.get<SuccessResponse<FAQCategory[]>>(API_URL);
    return response.data.data;
}
