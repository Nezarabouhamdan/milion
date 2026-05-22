import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 1000000000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Set default configuration (like withCredentials)
// Intercepting requests or responses here if needed
axiosInstance.interceptors.request.use((config) => {
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => {
		// Handle response here if needed
		return response;
	},
	(error) => {
		// Handle error here
		return Promise.reject(error);
	},
);

export { axiosInstance as default, axiosInstance as axios };
