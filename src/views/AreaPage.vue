<script setup lang="ts">
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "../components/ui/accordion";
import { ref, computed, watch } from "vue";
import { useAreaQuery } from "../composables/useAreaQuery";
import * as lucideIcons from "lucide-vue-next";
import { useRouter } from "vue-router";
import { imagePath } from "../utils/helpers";

const router = useRouter();
const { data: areas, isLoading, isError } = useAreaQuery();
const searchQuery = ref("");
const currentPage = ref(1);
const areasPerPage = 6; // Increased to show more areas per page

const stripTags = (html: string | null | undefined) => {
	return (html ?? '').replace(/<[^>]+>/g, "");
};

// Group areas by emirate
const groupedAreas = computed(() => {
	if (!areas.value) return {};
	const grouped: { [key: string]: typeof areas.value } = {};
	areas.value.forEach((area) => {
		const emirate = area.emirate || "Other"; // Fallback to 'Other' if no emirate
		if (!grouped[emirate]) grouped[emirate] = [];
		grouped[emirate].push(area);
	});
	return grouped;
});

// Filter and sort areas
const filteredGroupedAreas = computed(() => {
	const filtered: { [key: string]: typeof areas.value } = {};
	Object.keys(groupedAreas.value).forEach((emirate) => {
		filtered[emirate] = groupedAreas.value[emirate]
			.filter((area) =>
				area.name
					.toLowerCase()
					.includes(searchQuery.value.toLowerCase()),
			)
			.sort((a, b) => a.name.localeCompare(b.name));
	});
	return filtered;
});

// Paginate areas
const paginatedGroupedAreas = computed(() => {
	const start = (currentPage.value - 1) * areasPerPage;
	const end = start + areasPerPage;
	let allAreas: typeof areas.value = [];
	Object.values(filteredGroupedAreas.value).forEach((areaList) => {
		allAreas = allAreas.concat(areaList);
	});
	const paginated = allAreas.slice(start, end);
	// Group paginated areas back by emirate
	const result: { [key: string]: typeof areas.value } = {};
	paginated.forEach((area) => {
		const emirate = area.emirate || "Other";
		if (!result[emirate]) result[emirate] = [];
		result[emirate].push(area);
	});
	return result;
});

const totalPages = computed(() => {
	let totalAreas = 0;
	Object.values(filteredGroupedAreas.value).forEach(
		(areaList) => (totalAreas += areaList.length),
	);
	return Math.ceil(totalAreas / areasPerPage);
});

const changePage = (page: number) => {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page;
	}
};

const navigateToArea = (areaId: string | number) => {
	router.push(`/area/${areaId}`);
};

const primaryImage = (area: Area) => {
	const img = area?.images.find((a) => a.is_primary) ?? area.images[0];
	return img ? imagePath(img.url) : "/placeholder.jpg";
};

watch(searchQuery, () => {
	currentPage.value = 1;
});
</script>

<template>
	<section
		class="bg-gradient-to-b from-gray-50 to-white py-20 min-h-screen overflow-x-hidden"
	>
		<div class="container mx-auto px-4 max-w-7xl">
			<div class="text-center max-w-3xl mx-auto space-y-4">
				<h1
					class="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight"
				>
					Discover Your Perfect Area in UAE
				</h1>
				<p class="text-lg text-gray-600 leading-relaxed">
					Explore vibrant neighborhoods, their properties, transport
					options, and amenities with ease.
				</p>
			</div>

			<div v-if="isLoading" class="flex justify-center py-24">
				<div class="text-center">
					<div
						class="animate-spin h-14 w-14 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto"
					></div>
					<p class="mt-4 text-gray-500 font-medium text-lg">
						Loading areas...
					</p>
				</div>
			</div>

			<div
				v-else-if="isError"
				class="text-center py-24 max-w-md mx-auto bg-white p-10 rounded-2xl shadow-lg"
			>
				<lucideIcons.AlertCircle
					class="w-16 h-16 text-red-500 mx-auto mb-4"
				/>
				<h3 class="text-xl font-bold text-gray-800 mb-2">
					Unable to Load Areas
				</h3>
				<p class="text-gray-600">
					Please refresh the page or try again later.
				</p>
			</div>

			<div v-else class="space-y-12">
				<div
					class="flex flex-col sm:flex-row justify-between items-center gap-4"
				>
					<div class="relative w-full sm:w-96">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search areas..."
							class="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
						/>
						<lucideIcons.Search
							class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
						/>
					</div>
				</div>

				<div
					v-for="(areaList, emirate) in paginatedGroupedAreas"
					:key="emirate"
					class="space-y-6"
				>
					<div
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						<div
							v-for="area in areaList"
							:key="area.id"
							class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
							@click="navigateToArea(area.id)"
						>
							<div class="relative bg-gray-100 h-48">
								<!-- Set a fixed height, e.g., h-48 -->
								<img
									:src="primaryImage(area)"
									class="w-full h-full object-cover"
									alt="area image"
									loading="lazy"
								/>
							</div>
							<div class="p-4">
								<h3 class="text-lg font-semibold text-gray-800">
									{{ area.name }}
								</h3>
								<p class="text-sm text-gray-500 line-clamp-2">
									{{ stripTags(area.about) }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div
					v-if="Object.keys(paginatedGroupedAreas).length === 0"
					class="text-center py-12"
				>
					<p class="text-gray-500 text-lg italic">
						No areas found matching your search.
					</p>
				</div>

				<div class="flex justify-center gap-2 mt-6">
					<button
						:disabled="currentPage === 1"
						@click="changePage(currentPage - 1)"
						class="px-4 py-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Previous
					</button>
					<span class="px-4 py-2 text-gray-700"
						>Page {{ currentPage }} of {{ totalPages }}</span
					>
					<button
						:disabled="currentPage === totalPages"
						@click="changePage(currentPage + 1)"
						class="px-4 py-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.no-transform {
	transform: none !important;
}

.container {
	max-width: 1280px;
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	padding-left: 1rem;
	padding-right: 1rem;
}

section {
	overflow-x: hidden;
}

button:disabled {
	cursor: not-allowed;
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
