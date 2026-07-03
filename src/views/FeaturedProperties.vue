<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
const lang = ref(localStorage.getItem("lang") ?? "en");
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useFeaturedPropertyQuery } from "../composables/useFeaturedPropertyQuery";
import { imagePath, formatPrice, isImageAsset } from "../utils/helpers";
import { defineAsyncComponent } from "vue";
import axios from "../services/axios";
import PropertyCarousel from "../components/PropertyCarousel.vue";

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
	if (property.completion_status === "off_plan") {
		return `From ${formatPrice(property.price)} AED`;
	}
	if (property.purpose === "rent") {
		return `${formatPrice(property.price)} AED / year`;
	}
	if (property.property_type_slug === "holiday-homes") {
		return `${formatPrice(property.price)} AED / night`;
	}
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
			<div class="space-y-4">
				<div class="h-10 w-3/4 bg-gray-200 rounded"></div>
				<div class="h-10 w-1/2 bg-gray-200 rounded"></div>
			</div>
			<div class="lg:col-span-4 flex gap-4">
				<div v-for="i in 3" :key="i" class="flex-1 rounded-2xl overflow-hidden" style="background:#1a1a1a;">
					<div class="h-52 bg-gray-100 w-full"></div>
					<div class="p-4 space-y-3">
						<div class="h-4 w-3/4 bg-gray-200 rounded"></div>
						<div class="h-3 w-1/2 bg-gray-200 rounded"></div>
						<div class="h-4 w-2/3 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Error -->
		<Error
			v-else-if="displayError"
			message="Failed to load properties."
			:retry="refetch"
		/>

		<!-- Main Layout -->
		<div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-12">
			<!-- Left Section -->
			<div class="lg:col-span-1">
				<h2
					class="text-4xl font-heading font-bold mb-6 leading-snug"
					style="color:#C9A028;"
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

			<!-- Carousel Section -->
			<div class="lg:col-span-4">
				<PropertyCarousel :watchItems="displayProperties" :autoPlay="true" :interval="1500">
					<div
						v-for="property in displayProperties"
						:key="property.id"
						class="flex-none w-full sm:w-1/2 xl:w-1/3 px-3"
					>
						<router-link
							:to="`/property/${property.slug}`"
							class="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
							style="background:#1a1a1a; box-shadow: 0 4px 20px rgba(0,0,0,0.4);"
						>
							<!-- ── Image ── -->
							<div class="relative overflow-hidden" style="height:210px;">
								<img
									:src="primaryImage(property)"
									:alt="property.name"
									loading="lazy"
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
								<!-- Gradient overlay -->
								<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none"></div>

								<!-- Handover date badge — top left -->
								<div
									v-if="property.handover_date"
									class="absolute top-3 left-3 flex items-center gap-1 bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full"
								>
									<svg class="w-3 h-3 shrink-0" style="color:#C9A028;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
									</svg>
									{{ property.handover_date }}
								</div>

							</div>

							<!-- ── Info section ── -->
							<div class="p-4 space-y-2.5">
								<!-- Property name -->
								<h3
									class="notranslate font-bold text-base line-clamp-1 leading-snug"
									style="color:#ffffff;"
									translate="no"
									lang="en"
									:data-original="property.name"
								>
									{{ property.name }}
								</h3>

								<!-- Location + Developer row -->
								<div class="flex items-center gap-3 text-xs" style="color:#aaaaaa;">
									<span
										v-if="property.explore_location || property.location"
										class="flex items-center gap-1 min-w-0 truncate"
									>
										<svg class="w-3 h-3 shrink-0" style="color:#C9A028;" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
										</svg>
										<span class="truncate">{{ property.explore_location || property.location }}</span>
									</span>
									<span
										v-if="property.developer_name"
										class="flex items-center gap-1 shrink-0 font-semibold"
										style="color:#C9A028;"
									>
										<svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
										</svg>
										<span class="truncate max-w-[90px]">{{ property.developer_name }}</span>
									</span>
								</div>

								<!-- Divider -->
								<div style="border-top:1px solid rgba(255,255,255,0.08);"></div>

								<!-- Price + CTA -->
								<div class="flex items-center justify-between">
									<span class="font-bold text-sm leading-none" style="color:#C9A028;">
										{{ getPropertyTypePrice(property) }}
									</span>
									<span
										class="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all duration-300"
										style="background:#C9A028; color:#0A0A0A;"
									>
										Visit →
									</span>
								</div>
							</div>
						</router-link>
					</div>
				</PropertyCarousel>
			</div>
		</div>
	</section>
</template>
