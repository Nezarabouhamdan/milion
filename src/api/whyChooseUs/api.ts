import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { WhyChooseUs } from "../../types/whyChooseUs";

const API_URL = "/front/why-choose-us";

export async function getWhyChooseUs(): Promise<
	SuccessResponse<WhyChooseUs[]>
> {
	const response = await axios.get<SuccessResponse<WhyChooseUs[]>>(API_URL);
	return response.data.data;
}
