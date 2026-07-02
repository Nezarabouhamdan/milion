import axios from "../../services/axios";
import type { SingleSuccessResponse } from "../../types/response";
import type { AboutUs } from "../../types/aboutUs";

const API_URL = "/front/about-us";

export async function fetchAboutUsSection(): Promise<
	SingleSuccessResponse<AboutUs>
> {
	const response = await axios.get<SingleSuccessResponse<AboutUs>>(
		`${API_URL}/home`,
	);
	return response.data?.data;
}

export async function fetchAboutUs(): Promise<SingleSuccessResponse<AboutUs>> {
	const response = await axios.get<SingleSuccessResponse<AboutUs>>(
		`${API_URL}`,
	);
	return response.data?.data;
}
