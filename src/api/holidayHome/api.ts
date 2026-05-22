import axios from "../../services/axios";
import type { SuccessResponse } from "../../types/response";
import type { PropertyType } from "../../types/propertyType";

const API_URL = "/front/property/property-type";

export async function fetchHolidayHome(): Promise<
    SuccessResponse<PropertyType>
> {
    const response = await axios.get<SuccessResponse<PropertyType>>(
        `${API_URL}/holiday-homes`,
    );
    return response.data.data;
}
