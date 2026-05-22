import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { Blog } from "../../types/blog";

const API_URL = "/front/blog";

export async function getFeaturedBlogs(): Promise<SuccessResponse<Blog[]>> {
	const response = await axios.get<SuccessResponse<Blog[]>>(
		`${API_URL}/featured`,
	);
	return response.data.data;
}

export async function getAllBlogs(params): Promise<SuccessResponse<Blog[]>> {
	const response = await axios.get<SuccessResponse<Blog[]>>(
		`${API_URL}/all`,
		params,
	);
	return response.data.data;
}

export async function getBlogBySlug(slug: string) {
	const response = await axios.get<SuccessResponse<Blog>>(
		`${API_URL}/${slug.value ?? slug}/display`,
	);

	return response.data.data;
}

export async function getBlogCategories() {
	const response = await axios.get<SuccessResponse<[]>>(
		"front/blog/categories",
	);
	return response.data.data;
}
