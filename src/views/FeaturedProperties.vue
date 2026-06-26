<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
const lang = ref(localStorage.getItem("lang") ?? "en");
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useFeaturedPropertyQuery } from "../composables/useFeaturedPropertyQuery";
import { imagePath, formatPrice, isImageAsset } from "../utils/helpers";
import { defineAsyncComponent } from "vue";
import axios from "../services/axios";

const Error = defineAsyncComponent(
	() => import("../components/common/Error.vue"),
);

const featuredPropertyRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(featuredPropertyRef);

// Active tab
const activeTab = ref<'featured' | 'offplan'>('offplan');

const primaryImage = (property) => {
	const imgs = (property.assets ?? property.images ?? []).filter((a) => isImageAsset(a.url));
	const img = imgs.find((a) => a.is_primary) ?? imgs[0];
	return img ? imagePath(img.url) : "/placeholder.jpg";
};

// Featured properties
const {
	data: propertyList,
	isLoading,
	refetch,
	isError,
} = useFeaturedPropertyQuery(isVisible.value);

const properties = computed(() => propertyList.value ?? []);

// Off-plan properties
const offplanList = ref<any[]>([]);
const offplanLoading = ref(false);
const offplanError = ref(false);

const fetchOffplan = async () => {
	offplanLoading.value = true;
	offplanError.value = false;
	try {
		const res = await axios.get('/front/property/list', {
			params: {
				purpose: 'buy',
				completion_status: 'off_plan',
				sort_by: 'created_at',
				sort_order: 'desc',
				per_page: 9,
			}
		});
		offplanList.value = res.data?.data?.data ?? [];
	} catch {
		offplanError.value = true;
	} finally {
		offplanLoading.value = false;
	}
};

const switchTab = (tab: 'featured' | 'offplan') => {
	activeTab.value = tab;
	if (tab === 'offplan') fetchOffplan();
};

// Pre-fetch off-plan on mount so it's ready when tab is clicked
onMounted(() => {
	refetch();
	fetchOffplan();
});

const displayProperties = computed(() =>
	activeTab.value === 'featured' ? properties.value : offplanList.value
);
const displayLoading = computed(() =>
	activeTab.value === 'featured' ? isLoading.value : offplanLoading.value
);
const displayError = computed(() =>
	activeTab.value === 'featured' ? isError.value : offplanError.value
);

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

</script>

<template>
	<section ref="featuredPropertyRef" class="container py-24 md:py-32">
		<!-- Skeleton Loader -->
		<div
			v-if="displayLoading"
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
			v-else-if="displayError"
			message="Failed to load properties."
			:retry="refetch"
		/>

		<!-- Property Grid -->
		<div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-12">
			<!-- Left Section -->
			<div class="lg:col-span-1">
				<h2
					class="text-4xl font-heading font-bold mb-6 leading-snug" style="color:#C9A028;"
					translate="no"
				>
					<template v-if="lang === 'ar'">
						<span class="block font-black">عقاراتنا</span>
					</template>
					<template v-else-if="lang === 'ja'">
						<span class="inline-block border-l-4 pl-3" style="border-color:#C9A028;">私たちの</span><br />
						<span class="block font-black">物件一覧</span>
					</template>
					<template v-else-if="lang === 'zh-CN'">
						<span class="inline-block border-l-4 pl-3" style="border-color:#C9A028;">我们的</span><br />
						<span class="block font-black">房源列表</span>
					</template>
					<template v-else-if="lang === 'ru'">
						<span class="inline-block border-l-4 pl-3" style="border-color:#C9A028;">наши</span><br />
						<span class="block font-black">объекты</span>
					</template>
					<template v-else>
						<span class="inline-block border-l-4 pl-3" style="border-color:#C9A028;">our</span><br />
						<span class="block font-black">listings</span>
					</template>
				</h2>

				<!-- Tabs -->
				<div class="flex flex-col gap-2 mb-6">
					<button
						@click="switchTab('featured')"
						class="px-4 py-2 text-sm font-semibold rounded-md transition text-left"
						:style="activeTab === 'featured'
							? 'background:#C9A028; color:#0A0A0A;'
							: 'border:1px solid rgba(212,175,55,0.3); color:#aaaaaa;'"
					>
						Featured Properties
					</button>
					<button
						@click="switchTab('offplan')"
						class="px-4 py-2 text-sm font-semibold rounded-md transition text-left"
						:style="activeTab === 'offplan'
							? 'background:#C9A028; color:#0A0A0A;'
							: 'border:1px solid rgba(212,175,55,0.3); color:#aaaaaa;'"
					>
						Off Plan Projects
					</button>
				</div>

				<router-link
					:to="activeTab === 'offplan' ? '/properties?purpose=buy&completion_status=off_plan' : '/properties'"
					class="w-full inline-flex items-center px-6 py-3 text-sm font-semibold transition rounded-md mb-4"
					style="border:1px solid rgba(212,175,55,0.4); color:#C9A028;"
				>
					View All
				</router-link>
			</div>

			<!-- Property Grid -->
			<div class="lg:col-span-4">
				<div
					class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
				>
					<div
						v-for="property in displayProperties"
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
							<h3
								class="notranslate text-lg text-white font-semibold mb-1"
								translate="no"
								lang="en"
								:data-original="property.name"
							>
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

