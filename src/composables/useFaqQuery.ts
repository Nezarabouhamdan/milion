import { getFAQs } from "../api/faq/api";
import { useQuery } from "@tanstack/vue-query";

export function useFAQsQuery(enabled: boolean) {
    return useQuery({
        queryKey: ["faq-page"],
        queryFn: getFAQs,
        enabled: enabled,
    });
}
