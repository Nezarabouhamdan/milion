import { ref } from "vue";
import { api } from "@/utils/request";

const settings = ref<Record<string, string>>({});
const whyJoinUs = ref<any[]>([]);

export async function fetchSiteSettings() {
	const response = await api.get("/api/settings");
	const data = response.data.data;

	// Convert settings array to object
	settings.value = Object.fromEntries(
		(data.settings ?? []).map((item) => [item.key, item.value]),
	);

	whyJoinUs.value = data.why_join_us ?? [];
}

export function useSiteSettings() {
	return { settings, whyJoinUs, fetchSiteSettings };
}
