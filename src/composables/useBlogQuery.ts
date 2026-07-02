import { getBlogBySlug } from "../api/blog/api";
import { useQuery } from "@tanstack/vue-query";

export function useBlogQuery(slug: string) {
	return useQuery({
		queryKey: ["blog", slug],
		queryFn: () => getBlogBySlug(slug),
		enabled: !!slug,
	});
}
