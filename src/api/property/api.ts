import axios from "../../services/axios";
import type {
	SingleSuccessResponse,
	SuccessResponse,
} from "../../types/response";
import type { Area, Property } from "../../types/property";
import type { PropertyType } from "../../types/propertyType";
import type { Community } from "../../types/community";
import type { Amenity } from "../../types/amenity";

const API_URL = "/front/property";

export async function fetchFeaturedProperties(): Promise<
	SuccessResponse<Property[]>
> {
	const response = await axios.get<SuccessResponse<Property[]>>(
		`${API_URL}/featured`,
	);
	return response.data.data;
}

// api/area/api.ts
export async function fetchAreas(): Promise<SuccessResponse<Area[]>> {
	const response = await axios.get<SuccessResponse<Area[]>>(
		"/front/property/area",
	);
	return response.data.data;
}

// api/property-type/api.ts
export async function fetchPropertyTypes(): Promise<
	SuccessResponse<PropertyType[]>
> {
	const response = await axios.get<SuccessResponse<PropertyType[]>>(
		"/front/property/property-type",
	);
	return response.data.data;
}

// api/community/api.ts
export async function fetchCommunities(): Promise<
	SuccessResponse<Community[]>
> {
	const response = await axios.get<SuccessResponse<Community[]>>(
		"/front/property/community",
	);
	return response.data.data;
}

// api/amenity/api.ts
export async function fetchAmenities(): Promise<SuccessResponse<Amenity[]>> {
	const response = await axios.get<SuccessResponse<Amenity[]>>(
		"/front/property/ammenity",
	);
	return response.data.data;
}

export async function fetchPropertyBySlug(
	slug: string,
): Promise<SingleSuccessResponse<Property>> {
	const response = await axios.get<SingleSuccessResponse<Property>>(
		"/front/property/" + slug,
	);
	return response.data.data;
}
