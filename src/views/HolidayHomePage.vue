<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import axios from "../services/axios";
import * as lucideIcons from "lucide-vue-next";
import { imagePath, isImageAsset } from "../utils/helpers";
import { useHolidayHome } from "../composables/useHolidayHome";
import type { Property } from "../types/property";
import backgroundImage from "../assets/buy_1.jpg";

// Fetch holiday home metadata
const { data: holidayHomeResponse } = useHolidayHome(true);
const holidayHomeId = computed(() => holidayHomeResponse.value?.id ?? null);

// Properties state
const propertiesResponse = ref(null);
const isLoading = ref(false);
const isError = ref(false);
const isFetching = ref(false);

watchEffect(async () => {
	if (!holidayHomeId.value) return;
	isLoading.value = true;
	isError.value = false;
	try {
		isFetching.value = true;
		const response = await axios.get("/front/property/holiday-homes", {
			params: { property_type_id: holidayHomeId.value, status: "active" },
		});
		propertiesResponse.value = response.data;
	} catch (err) {
		isError.value = true;
		console.error("Failed to fetch properties:", err);
	} finally {
		isLoading.value = false;
		isFetching.value = false;
	}
});

const holidayHomes = computed(() => propertiesResponse.value?.data?.data ?? []);
const primaryImage = (property: Property) => {
	const imgs = (property.assets ?? property.images ?? []).filter((a) => isImageAsset(a.url));
	const img = imgs.find((a) => a.is_primary) ?? imgs[0];
	return img ? imagePath(img.url) : "/placeholder.jpg";
};
</script>

<template>
	<section
		class="min-h-screen bg-neutral text-gray-800 font-sans antialiased"
	>
		<!-- Hero Section -->
		<div
			class="relative bg-cover bg-center text-white"
			:style="{ backgroundImage: `url(${backgroundImage})` }"
		>
			<div class="absolute inset-0 bg-hero-gradient"></div>
			<div
				class="relative container py-24 md:py-32 text-center space-y-6 max-w-4xl animate-slide-up"
			>
				<h1
					class="text-4xl sm:text-5xl md:text-6xl font-heading tracking-tight text-white"
				>
					Short Stays. Lasting Impressions.
				</h1>
				<p class="text-lg sm:text-xl leading-relaxed" style="color:rgba(255,255,255,0.85);">
					Escape to elegance with Our Holiday Homes — a curated collection of fully - furnished, short - term
					rentals in Dubai’s most iconic locations.
				</p>
				<p class="text-sm" style="color:rgba(255,255,255,0.65);">
					All properties are serviced, ready to move in, and equipped with premium amenities.
				</p>
				<a
					href="#properties"
					class="inline-flex items-center gap-2 px-8 py-4 bg-black-100 text-white rounded-lg font-alt shadow-gold hover:bg-white hover:text-black-100 transition-all duration-300"
				>
					<lucideIcons.Umbrella class="w-5 h-5" />
					Explore Holiday Homes
				</a>
			</div>
		</div>

		<!-- Intro Content -->
		<div
			class="container py-16 max-w-4xl text-center space-y-8 animate-slide-up"
		>
			<h2
				class="text-3xl sm:text-4xl font-heading text-primary tracking-tight"
			>
				Own a Property? Let It Earn.
			</h2>
			<p class="text-lg text-gray-500 leading-relaxed">
				Unlock the full potential of your investment. At Million Homes, we help landlords lease or sub-lease
				their properties as fully - managed holiday homes.
			</p>
			<ul
				class="space-y-3 text-left max-w-md mx-auto border-l-2 border-secondary pl-6"
			>
				<li class="flex items-center gap-2 text-gray-700">
					<lucideIcons.Check class="w-4 h-4 text-secondary" />
					Furnishing & interior setup
				</li>
				<li class="flex items-center gap-2 text-gray-700">
					<lucideIcons.Check class="w-4 h-4 text-secondary" />
					Licensing & compliance
				</li>
				<li class="flex items-center gap-2 text-gray-700">
					<lucideIcons.Check class="w-4 h-4 text-secondary" />
					Daily guest management
				</li>
				<li class="flex items-center gap-2 text-gray-700">
					<lucideIcons.Check class="w-4 h-4 text-secondary" />
					Marketing on global platforms
				</li>
				<li class="flex items-center gap-2 text-gray-700">
					<lucideIcons.Check class="w-4 h-4 text-secondary" />
					Maintenance & housekeeping
				</li>
			</ul>
			<div class="flex justify-center gap-4 flex-wrap">
				<router-link
					to="/contact-us"
					class="px-6 py-3 bg-black-100 text-white rounded-lg font-alt shadow-gold hover:bg-black-100 transition-all duration-300"
				>
					List Your Property
				</router-link>
			</div>
			<p class="text-gray-400 text-sm italic font-alt">
				Ready to check in or cash in? Our Holiday Homes is your key to elevated experiences.
			</p>
		</div>

		<!-- Loading -->
		<div
			v-if="isLoading"
			class="container flex items-center justify-center py-32 animate-fade-in"
		>
			<div class="text-center">
				<div
					class="animate-spin h-12 w-12 rounded-full border-4 border-t-secondary border-r-secondary border-gray-200 mx-auto"
				></div>
				<p class="text-gray-500 mt-4 font-medium font-alt">
					Loading properties...
				</p>
			</div>
		</div>

		<!-- Error -->
		<div
			v-else-if="isError"
			class="container flex items-center justify-center py-32 animate-fade-in"
		>
			<div
				class="bg-white p-8 rounded-xl shadow-card text-center max-w-md"
			>
				<lucideIcons.AlertCircle
					class="h-16 w-16 text-destructive mx-auto mb-4"
				/>
				<h3 class="text-xl font-heading text-primary mb-2">
					Couldn't Load Properties
				</h3>
				<p class="text-gray-500 font-alt">
					Please try again later.
				</p>
				<button
					@click="watchEffect(() => {})"
					class="mt-6 px-6 py-2 bg-black-100 text-white rounded-lg font-alt hover:bg-secondary transition-all duration-300"
				>
					Retry
				</button>
			</div>
		</div>

		<!-- Properties -->
		<div v-else id="properties" class="container py-16 space-y-10">
			<h2
				class="text-3xl font-heading text-primary text-center tracking-tight animate-slide-up"
			>
				Available Holiday Homes
			</h2>

			<div v-if="isFetching" class="text-center py-8 animate-fade-in">
				<div
					class="animate-spin rounded-full h-10 w-10 border-t-2 border-secondary border-r-2 mx-auto"
				></div>
				<p class="text-gray-500 mt-2 font-alt">
					Updating properties...
				</p>
			</div>

			<div
				v-if="holidayHomes.length > 0"
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
			>
				<div
					v-for="property in holidayHomes"
					:key="property.id"
					class="bg-card rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group animate-zoom-in"
				>
					<router-link :to="`/property/${property.slug}`">
						<div class="relative h-56">
							<img
								:src="primaryImage(property)"
								:alt="property.title"
								class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
							></div>

							<div
								class="absolute top-3 left-3 flex flex-col gap-2 z-10 bg-black-100 text-white rounded-full"
							>
								<span
									v-if="property.is_featured == 1"
									class="badge bg-black-600 text-white text-xs font-medium px-2.5 py-1 rounded-full"
								>
									Featured
								</span>
							</div>
						</div>
						<div class="p-5 space-y-3">
							<h3
								class="notranslate font-semibold text-lg sm:text-xl text-gray-800 line-clamp-1"
								translate="no"
								lang="en"
								:data-original="property.title"
							>
								{{ property.title }}
							</h3>
							<p class="text-sm text-gray-500">
								<router-link :to="`/area/${property.area_id}`">
									{{ property.explore_location }}
								</router-link>
							</p>
							<div
								class="grid grid-cols-2 gap-4 text-sm text-gray-500"
							>
								<span class="flex items-center gap-2">
									<lucideIcons.BedDouble
										class="w-4 h-4 text-secondary"
									/>
									{{ property.beds }} ({{ property.bedrooms }}
									Bedrooms)
								</span>
								<span class="flex items-center gap-2">
									<lucideIcons.Bath
										class="w-4 h-4 text-secondary"
									/>
									{{ property.bathrooms }}
								</span>
								<span class="flex items-center gap-2">
									<lucideIcons.Calendar
										class="w-4 h-4 text-secondary"
									/>
									Min. {{ property.minimum_stay }} Nights
								</span>
								<span class="flex items-center gap-2">
									<lucideIcons.Smile
										class="w-4 h-4 text-secondary"
									/>
									{{ property.no_of_guests }}
								</span>
							</div>
							<div class="flex justify-between items-center">
								<span
									class="text-secondary font-semibold text-lg font-alt"
								>
									AED
									{{
										Number(property.price).toLocaleString()
									}}
									/ night
								</span>
								<router-link
									:to="`/property/${property.slug}`"
									class="text-primary text-sm font-alt hover:text-secondary flex items-center gap-1 transition-colors"
								>
									View Details
									<lucideIcons.ChevronRight class="w-4 h-4" />
								</router-link>
							</div>
						</div>
					</router-link>
				</div>
			</div>

			<div
				v-else
				class="text-center text-gray-500 italic py-8 font-alt animate-fade-in"
			>
				No holiday homes available right now.
			</div>
		</div>
	</section>
</template>

<style scoped>
/* Custom Scrollbar */
::-webkit-scrollbar {
	@apply w-2;
}

::-webkit-scrollbar-track {
	@apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
	@apply bg-gray-400 rounded-full;
}

/* Smooth Scroll */
html {
	scroll-behavior: smooth;
}
</style>