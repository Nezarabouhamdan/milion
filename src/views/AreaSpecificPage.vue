<script setup lang="ts">
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "../components/ui/accordion";
import { ref, computed } from "vue";
import { useSeoMeta } from "@unhead/vue";
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";
import axios from "../services/axios";
import * as lucideIcons from "lucide-vue-next";
import { imagePath, isImageAsset } from "../utils/helpers";
import type { Property } from "../types/property";
import PropertyCard from "../components/PropertyCard.vue";

const route = useRoute();
const areaId = computed(() => route.params.id);

const {
	data: areaResponse,
	isLoading,
	isError,
} = useQuery({
	queryKey: ["area", areaId],
	queryFn: async () => {
		const response = await axios.get(
			`/front/property/area/${areaId.value}`,
		);
		return response.data;
	},
});

const area = computed(() => areaResponse.value?.data ?? null);

const { data: areaPropertiesResponse, isFetching: isFetchingProperties } =
	useQuery({
		queryKey: ["area-properties", areaId],
		queryFn: async () => {
			const response = await axios.get("/front/property/list", {
				params: { area_id: areaId.value },
			});
			return response.data;
		},
		enabled: !!areaId.value,
		keepPreviousData: true,
	});

const areaProperties = computed(
	() => areaPropertiesResponse.value?.data.data ?? [],
);

const primaryImage = (property: Property) => {
	const imgs = (property.assets ?? property.images ?? []).filter((a) => isImageAsset(a.url));
	const img = imgs.find((a) => a.is_primary) ?? imgs[0];
	return img ? imagePath(img.url) : "/placeholder.jpg";
};

useSeoMeta({
	title: computed(
		() => `${area.value?.name} - Million Homes Real Estate Broker LLC`,
	),
	description: computed(() => area.value?.og_description),
	ogImage: computed(() => imagePath(area.value?.og_image) ?? ""),
	ogTitle: computed(() => area.value?.name),
	ogDescription: computed(() => area.value?.og_title),
	ogType: "website",
	twitterCard: "summary_large_image",
	ogUrl: typeof window !== "undefined" ? window.location.href : "",
});
</script>

<template>
	<section
		class="bg-gradient-to-b from-gray-50 to-white py-20 min-h-screen overflow-x-hidden"
	>
		<div class="container mx-auto px-4 max-w-7xl">
			<!-- Loading State -->
			<div v-if="isLoading" class="flex justify-center py-24">
				<div class="text-center">
					<div
						class="animate-spin h-14 w-14 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto"
					></div>
					<p class="mt-4 text-gray-500 font-medium text-lg">
						Loading area details...
					</p>
				</div>
			</div>

			<!-- Error State -->
			<div
				v-else-if="isError"
				class="text-center py-24 max-w-md mx-auto bg-white p-10 rounded-2xl shadow-lg"
			>
				<lucideIcons.AlertCircle
					class="w-16 h-16 text-red-500 mx-auto mb-4"
				/>
				<h3 class="text-xl font-bold text-gray-800 mb-2">
					Unable to Load Area
				</h3>
				<p class="text-gray-600">
					Please refresh the page or try again later.
				</p>
			</div>

			<!-- Area Content -->
			<div v-else-if="area" class="space-y-12">
				<!-- Area Header -->
				<div class="text-center max-w-3xl mx-auto space-y-4">
					<h1
						class="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight"
					>
						{{ area.name }}
					</h1>
					<p class="text-lg text-gray-600 leading-relaxed">
						{{
							area.description ||
							"Discover the unique charm, amenities, and properties of this area."
						}}
					</p>
				</div>

				<!-- Area Details -->
				<div class="bg-white rounded-2xl shadow-xl p-8 space-y-10">
					<!-- Images -->
					<div
						v-if="area.images?.length"
						class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 rounded-lg"
					>
						<div
							v-for="img in area.images"
							:key="img.id"
							class="relative aspect-4/3 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
						>
							<img
								:src="imagePath(img.url)"
								class="w-full h-56 object-cover object-center"
								style="height: 224px"
							/>
						</div>
					</div>

					<!-- About Section -->
					<div
						v-if="area.about"
						class="text-gray-700 text-base leading-relaxed text-left about-content"
						v-html="area.about"
					></div>

					<!-- Explore Map Link -->
					<div v-if="area.explore_map_link" class="text-center">
						<a
							:href="area.explore_map_link"
							target="_blank"
							rel="noopener"
							class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black-100 text-white hover:bg-blue-700 transition font-semibold"
						>
							<lucideIcons.MapPin class="w-5 h-5" /> Explore on
							Map
						</a>
					</div>

					<!-- Transport and Residential Options -->
					<Accordion type="multiple" class="w-full space-y-6">
						<!-- Bus Stations -->
						<AccordionItem
							value="bus"
							class="border border-gray-200 rounded-lg shadow-sm"
						>
							<AccordionTrigger
								class="text-xl font-semibold flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100"
							>
								<lucideIcons.Bus
									class="h-6 w-6 text-blue-600 no-transform"
								/>
								Bus Stations ({{
									area.bus_stations?.length ?? 0
								}})
							</AccordionTrigger>
							<AccordionContent class="px-6 py-4">
								<div
									v-if="area.bus_stations?.length"
									class="grid gap-3"
								>
									<div
										v-for="station in area.bus_stations"
										:key="station.id"
										class="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm"
									>
										<lucideIcons.Bus
											class="h-5 w-5 text-blue-600 no-transform"
										/>
										<div>
											<p
												class="font-medium text-gray-800"
											>
												{{ station.name }}
											</p>
											<p class="text-sm text-gray-500">
												{{ station.distance }}
											</p>
										</div>
									</div>
								</div>
								<p
									v-else
									class="italic text-gray-500 text-center"
								>
									No bus stations nearby.
								</p>
							</AccordionContent>
						</AccordionItem>

						<!-- Metro Stations -->
						<AccordionItem
							value="metro"
							class="border border-gray-200 rounded-lg shadow-sm"
						>
							<AccordionTrigger
								class="text-xl font-semibold flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100"
							>
								<lucideIcons.Train
									class="h-6 w-6 text-blue-600 no-transform"
								/>
								Metro Stations ({{
									area.metro_stations?.length ?? 0
								}})
							</AccordionTrigger>
							<AccordionContent class="px-6 py-4">
								<div
									v-if="area.metro_stations?.length"
									class="grid gap-3"
								>
									<div
										v-for="station in area.metro_stations"
										:key="station.id"
										class="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm"
									>
										<lucideIcons.Train
											class="h-5 w-5 text-blue-600"
										/>
										<div>
											<p
												class="font-medium text-gray-800"
											>
												{{ station.name }}
											</p>
											<p class="text-sm text-gray-500">
												{{ station.distance }}
											</p>
										</div>
									</div>
								</div>
								<p
									v-else
									class="italic text-gray-500 text-center"
								>
									No metro stations nearby.
								</p>
							</AccordionContent>
						</AccordionItem>

						<!-- Airports -->
						<AccordionItem
							value="airport"
							class="border border-gray-200 rounded-lg shadow-sm"
						>
							<AccordionTrigger
								class="text-xl font-semibold flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100"
							>
								<lucideIcons.Plane
									class="h-6 w-6 text-blue-600 no-transform"
								/>
								Airports ({{ area.airports?.length ?? 0 }})
							</AccordionTrigger>
							<AccordionContent class="px-6 py-4">
								<div
									v-if="area.airports?.length"
									class="grid gap-3"
								>
									<div
										v-for="airport in area.airports"
										:key="airport.id"
										class="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm"
									>
										<lucideIcons.Plane
											class="h-5 w-5 text-blue-600"
										/>
										<div>
											<p
												class="font-medium text-gray-800"
											>
												{{ airport.name }}
											</p>
											<p class="text-sm text-gray-500">
												{{ airport.distance }}
											</p>
										</div>
									</div>
								</div>
								<p
									v-else
									class="italic text-gray-500 text-center"
								>
									No airports nearby.
								</p>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="residential"
							class="border border-gray-200 rounded-lg shadow-sm"
						>
							<AccordionTrigger
								class="text-xl font-semibold flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100"
							>
								<lucideIcons.Home
									class="h-6 w-6 text-blue-600 no-transform"
								/>
								Residential Options ({{
									area.residental_options?.length ?? 0
								}})
							</AccordionTrigger>
							<AccordionContent class="px-6 py-4">
								<div
									v-if="area.residental_options?.length"
									class="grid gap-3"
								>
									<div
										v-for="option in area.residental_options"
										:key="option.id"
										class="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm"
									>
										<lucideIcons.Home
											class="h-5 w-5 text-blue-600"
										/>
										<div>
											<p
												class="font-medium text-gray-800"
											>
												{{ option.title }}
											</p>
											<p class="text-sm text-gray-500">
												{{ option.description }}
											</p>
											<div
												v-if="
													option.price_options?.length
												"
												class="mt-2"
											>
												<p
													class="text-sm font-medium text-gray-700"
												>
													Price Options:
												</p>
												<ul
													class="list-disc list-inside text-sm text-gray-500"
												>
													<li
														v-for="price in option.price_options"
														:key="price.id"
													>
														{{ price.size }}:
														{{ price.price_range }}
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<p
									v-else
									class="italic text-gray-500 text-center"
								>
									No residential options available.
								</p>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>

				<!-- Properties Section -->
				<div v-if="area" class="space-y-10">
					<h3
						class="text-3xl font-semibold text-gray-800 text-center"
					>
						Properties in {{ area.name }}
					</h3>

					<!-- Properties Loading -->
					<div
						v-if="isFetchingProperties"
						class="flex justify-center py-16"
					>
						<div
							class="animate-spin h-12 w-12 border-t-2 border-blue-600 border-b-2 rounded-full"
						></div>
						<p class="mt-3 text-gray-500 font-medium">
							Loading properties...
						</p>
					</div>

					<!-- Properties Grid -->
					<div
						v-else-if="areaProperties.length > 0"
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						<PropertyCard
							v-for="property in areaProperties"
							:key="property.id"
							:property="property"
							:viewMode="'grid'"
							:primaryImage="primaryImage"
						/>
					</div>

					<!-- No Properties -->
					<div
						v-else
						class="text-center italic text-gray-500 text-lg py-12"
					>
						No properties found in this area.
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.no-transform {
	transform: none !important;
}

/* Ensure container doesn't overflow */
.container {
	max-width: 1280px;
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	padding-left: 1rem;
	padding-right: 1rem;
}

/* CKEditor styles for about content */
.about-content {
	width: 100%;
	max-width: none;
}

.about-content h1,
.about-content h2,
.about-content h3,
.about-content h4,
.about-content h5,
.about-content h6 {
	font-weight: 700;
	color: #1f2937;
	margin: 1rem 0 0.5rem;
	line-height: 1.4;
}

.about-content h1 {
	font-size: 2rem;
}

.about-content h2 {
	font-size: 1.75rem;
}

.about-content h3 {
	font-size: 1.5rem;
}

.about-content h4 {
	font-size: 1.25rem;
}

.about-content h5 {
	font-size: 1.125rem;
}

.about-content h6 {
	font-size: 1rem;
}

.about-content p {
	margin: 1rem 0;
	line-height: 1.6;
	color: #4b5563;
}

.about-content p + p {
	margin-top: 1rem;
}

.about-content strong {
	font-weight: 700;
	color: #1f2937;
}

.about-content em {
	font-style: italic;
}

.about-content ul,
.about-content ol {
	margin: 1rem 0;
	padding-left: 2rem;
}

.about-content li {
	margin-bottom: 0.5rem;
	line-height: 1.6;
}

.about-content img {
	max-width: 100%;
	height: auto;
	display: block;
}

.about-content table {
	width: 100%;
	border-collapse: collapse;
	margin: 1rem 0;
}

.about-content th,
.about-content td {
	border: 1px solid #e5e7eb;
	padding: 0.5rem;
	text-align: left;
}

.about-content th {
	background-color: #f3f4f6;
	font-weight: 600;
}

.about-content a {
	color: #2563eb;
	text-decoration: underline;
}

.about-content a:hover {
	color: #1d4ed8;
}

/* Ensure no horizontal scroll */
section {
	overflow-x: hidden;
}
</style>
