import { ref, type Ref, unref } from "vue";
import axios from "../services/axios";

interface BlogQueryParams {
	page?: Ref<number> | number;
	title?: Ref<string> | string;
	category?: Ref<string | undefined> | string | undefined;
	sortBy?: Ref<string> | string;
	sortOrder?: Ref<string> | string;
	type?: Ref<string> | string;
}

interface BlogAsset {
	url: string;
	is_primary: boolean;
}

interface BlogData {
	id: number;
	title: string;
	slug: string;
	excerpt: string;
	type: string;
	content: string;
	category: string;
	status: string;
	publish_status: string;
	author_name: string;
	author_role: string;
	read_time: string;
	created_at: string;
	updated_at: string;
	assets: BlogAsset[];
}

interface PaginatedResponse {
	current_page: number;
	data: BlogData[];
	from: number;
	last_page: number;
	links: Array<{ url: string | null; label: string; active: boolean }>;
	per_page: number;
	to: number;
	total: number;
}

export function useAllBlogsQuery(
	immediate = true,
	queryParams: BlogQueryParams = {},
) {
	const data = ref<PaginatedResponse | null>(null);
	const isLoading = ref(false);
	const isError = ref(false);
	const error = ref(null);

	const fetch = async () => {
		isLoading.value = true;
		isError.value = false;
		error.value = null;

		try {
			const response = await axios.get("/front/blog/all", {
				params: {
					page: unref(queryParams.page) || 1,
					title: unref(queryParams.title),
					category: unref(queryParams.category),
					sortBy: unref(queryParams.sortBy) || "created_at",
					sortOrder: unref(queryParams.sortOrder) || "desc",
					type: unref(queryParams.type) || "news",
				},
			});
			data.value = response.data;
		} catch (err) {
			isError.value = true;
			error.value = err;
			console.error("Error fetching blogs:", err);
		} finally {
			isLoading.value = false;
		}
	};

	if (immediate) {
		fetch();
	}

	const refetch = () => {
		fetch();
	};

	return {
		data,
		isLoading,
		isError,
		error,
		refetch,
	};
}
