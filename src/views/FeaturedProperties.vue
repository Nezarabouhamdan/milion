<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useFeaturedPropertyQuery } from "../composables/useFeaturedPropertyQuery";
import { imagePath, formatPrice, isImageAsset } from "../utils/helpers";
import { defineAsyncComponent } from "vue";

const Error = defineAsyncComponent(
	() => import("../components/common/Error.vue"),
);

const featuredPropertyRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(featuredPropertyRef);

const primaryImage = (property) => {
	const imgs = (property.images ?? []).filter((a) => isImageAsset(a.url));
	const img = imgs.find((a) => a.is_primary) ?? imgs[0];
	return img ? imagePath(img.url) : "/placeholder.jpg";
};

const {
	data: propertyList,
	isLoading,
	refetch,
	isError,
} = useFeaturedPropertyQuery(isVisible.value);

const properties = computed(() => propertyList.value ?? []);

const getPropertyTypePrice = (property: any) => {
	//console.log(property.purpose, property.price, property.property_type_slug);
	if (property.completion_status === "off_plan") {
		return `From ${formatPrice(property.price)} AED`;
	}

	// Check if the purpose is rent
	if (property.purpose === "rent") {
		return `${formatPrice(property.price)} AED per year`;
	}

	// Check if the property is a holiday-home
	if (property.property_type_slug === "holiday-homes") {
		return `${formatPrice(property.price)} AED per night`;
	}

	// Default case for other properties
	return `${formatPrice(property.price)} AED`;
};

onMounted(() => {
	refetch();
});
</script>

<template>
	<section ref="featuredPropertyRef" class="container py-24 md:py-32">
		<!-- Skeleton Loader -->
		<div
			v-if="isLoading"
			class="grid grid-cols-1 lg:grid-cols-5 gap-12 animate-pulse"
		>
			<!-- Left Placeholder -->
			<div class="space-y-4">
				<div class="h-10 w-3/4 bg-gray-200 rounded"></div>
				<div class="h-10 w-1/2 bg-gray-200 rounded"></div>
			</div>

			<!-- Grid Placeholder -->
			<div
				class="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
			>
				<div
					v-for="i in 8"
					:key="i"
					class="relative overflow-hidden rounded-lg shadow-sm bg-gray-100"
				>
					<div class="h-64 bg-gray-200 w-full rounded-t"></div>
					<div class="absolute bottom-6 left-6 space-y-2">
						<div class="h-4 w-32 bg-gray-300 rounded"></div>
						<div class="h-3 w-24 bg-gray-300 rounded"></div>
					</div>
					<div
						class="absolute top-4 left-4 h-8 w-24 bg-white/60 rounded-md"
					></div>
					<div
						class="absolute bottom-6 right-6 h-10 w-28 bg-white/60 rounded-md"
					></div>
				</div>
			</div>
		</div>

		<!-- Error -->
		<Error
			v-else-if="isError"
			message="Failed to load properties."
			:retry="refetch"
		/>

		<!-- Property Grid -->
		<div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-12">
			<!-- Left Section -->
			<div class="lg:col-span-1">
				<h2
					class="text-4xl font-heading font-bold mb-6 leading-snug" style="color:#D4AF37;"
				>
					<span class="inline-block border-l-4 pl-3" style="border-color:#D4AF37;"
						>featured</span
					><br />
					<span class="block font-black">properties</span>
				</h2>
				<router-link
					href="/properties"
					class="w-full inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-semibold hover:border-primary hover:text-primary transition rounded-md mb-4"
				>
					view all properties →
				</router-link>
				<!-- CTA Buttons -->
				<div class="flex flex-col gap-4">
					<router-link
						to="/properties?purpose=buy"
						class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-sm font-semibold hover:border-primary hover:text-primary transition"
					>
						buy a property →
					</router-link>
					<router-link
						to="/sell"
						class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-sm font-semibold hover:border-primary hover:text-primary transition"
					>
						sell a property →
					</router-link>
					<router-link
						to="/properties?purpose=rent"
						class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-sm font-semibold hover:border-primary hover:text-primary transition"
					>
						rent a property →
					</router-link>
				</div>
			</div>

			<!-- Property Grid -->
			<div class="lg:col-span-4">
				<div
					class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
				>
					<div
						v-for="property in properties"
						:key="property.id"
						class="relative group overflow-hidden rounded-lg shadow-sm"
					>
						<img
							:src="primaryImage(property)"
							:alt="property.name"
							loading="lazy"
							class="w-full h-64 object-cover transition-transform group-hover:scale-105 group-hover:opacity-80 group-hover:shadow-lg duration-300"
						/>
						<div
							class="absolute inset-0 bg-property-gradient z-10"
						></div>

						<!-- Text Info -->
						<div class="absolute bottom-6 left-6 z-20 text-white">
							<h3 class="text-lg text-white font-semibold mb-1">
								{{ property.name }}
							</h3>
						</div>

						<!-- Price Badge -->
						<div
							class="absolute top-4 left-4 bg-white text-dark text-sm font-semibold px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition duration-300 z-20 shadow"
						>
							{{ getPropertyTypePrice(property) }}
						</div>

						<!-- View Property Button -->
						<div
							class="absolute bottom-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition duration-300"
						>
							<a
								:href="`/property/${property.slug}`"
								class="bg-white text-primary text-sm font-semibold px-5 py-2 rounded-md hover:bg-black-100 hover:text-white transition"
							>
								View Property
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
