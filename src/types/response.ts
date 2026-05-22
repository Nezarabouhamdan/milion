export interface ApiResponse extends Response {
    message?: string;
    data: string[];
    errors?: { [key: string]: string[] };
}

export interface SingleSuccessResponse<T> {
    status: "success";
    message: string;
    data: T;
}

export interface SuccessResponse<T> {
    status: "success";
    message: string;
    data: T[];
}

export interface ErrorResponse<T> {
    status: "error";
    message: string;
    errors: T;
}

export interface ValidationErrors {
    [key: string]: string[];
}
