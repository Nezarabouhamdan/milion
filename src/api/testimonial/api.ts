import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { Testimonial } from "../../types/testimonial";

const API_URL = "/front/testimonial";

export async function getTestimonials(): Promise<
	SuccessResponse<Testimonial[]>
> {
	const response = await axios.get<SuccessResponse<Testimonial[]>>(API_URL);
	return response.data.data;
}
