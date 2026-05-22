import { getFeaturedBlogs } from "../api/blog/api";
import { useQuery } from "@tanstack/vue-query";

export function useBlogsQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["blog-section"],
		queryFn: getFeaturedBlogs,
		enabled: enabled,
	});
}
