<script setup lang="ts">
import { computed, watch, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { usePropertyDetail } from "../composables/usePropertyDetail";
import { enquireForBuying } from "../api/enquiry/api";
import { imagePath, formatPrice } from "../utils/helpers";
import { useSeoMeta } from "@unhead/vue";
import * as lucideIcons from "lucide-vue-next";
import PropertyEnquiryModal from "../components/common/PropertyEnquiryModal.vue";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "../components/ui/accordion";
import { LANGUAGE_AGENTS } from "../config/languageAgents";

const route = useRoute();
const slug = route.params.slug as string;

const propertyRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(propertyRef);

const {
	data: propertyResponse,
	isLoading,
	isError,
	refetch,
} = usePropertyDetail(slug);

const property = computed(() => propertyResponse.value);

// Language-based agent override
const lang = ref(localStorage.getItem("lang") ?? "en");
let langObserver: MutationObserver;
onMounted(() => {
	langObserver = new MutationObserver(() => {
		lang.value = localStorage.getItem("lang") ?? document.documentElement.lang ?? "en";
	});
	langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
});
onBeforeUnmount(() => langObserver?.disconnect());

const displayAgent = computed(() => {
	const typeSlug = property.value?.property_type_slug ?? "";
	const override = LANGUAGE_AGENTS[lang.value]?.[typeSlug];
	return override ?? property.value?.agent;
});

const mainImage = ref<string | null>(null);
const showFullDescription = ref(false);
const activeTab = ref("overview");
const showShareDropdown1 = ref(false);
const showShareDropdown2 = ref(false);
const showEnquiryModal = ref(false);

// Add state for image pop-up
const showImagePopup = ref(false);
const selectedImage = ref<string | null>(null);

const getPropertyTypePrice = (property: any) => {
	// Check if the property is a holiday-home
	if (property.property_type_slug === "holiday-homes") {
		return `${formatPrice(property.price)} AED per night`;
	}

	if (property.completion_status === "off_plan") {
		return `From ${formatPrice(property.price)} AED`;
	}

	// Check if the purpose is rent
	if (property.purpose === "rent") {
		return `${formatPrice(property.price)} AED per year`;
	}

	// Default case for other properties
	return `${formatPrice(property.price)} AED`;
};

const hasTransit = computed(
	() =>
		property.value?.metro_stations?.length ||
		property.value?.bus_stations?.length ||
		property.value?.airports?.length,
);
const hasAmenities = computed(() => property.value?.nearby_amenities?.length);

const gridColsClass = computed(() =>
	hasTransit.value && hasAmenities.value
		? "md:grid-cols-2"
		: "md:grid-cols-1",
);

const openContactForm = () => {
	console.log("Contact form opened");
};

const scheduleViewing = () => {
	if (property.value?.pType === "holiday-home") {
		window.open(property.value?.air_bnb_link, "_blank");
	} else {
		showEnquiryModal.value = true;
	}
};

const scheduleViewingBookin = () => {
	if (property.value?.pType === "holiday-home") {
		window.open(property.value?.booking_com_link, "_blank");
	}
};

const copyLink = () => {
	navigator.clipboard.writeText(window.location.href);
	alert("Link copied to clipboard!");
};

const toggleShareDropdown1 = () => {
	showShareDropdown1.value = !showShareDropdown1.value;
};

const toggleShareDropdown2 = () => {
	showShareDropdown2.value = !showShareDropdown2.value;
};

const shareViaWhatsApp = () => {
	window.open(
		`https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
		"_blank",
	);
	showShareDropdown1.value = false;
};

const shareViaTelegram = () => {
	const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`;
	window.open(url, "_blank");
	showShareDropdown1.value = false;
	showShareDropdown2.value = false;
};

const shareViaBotim = () => {
	alert(
		"Botim does not support web sharing links directly. Please share manually.",
	);
	showShareDropdown1.value = false;
	showShareDropdown2.value = false;
};
// Remove these methods from <script setup>
const viewImage = (url: string) => {
	window.open(imagePath(url), "_blank");
};

const downloadImage = (url: string) => {
	const link = document.createElement("a");
	link.href = imagePath(url);
	link.download = url.split("/").pop() || "floor-plan";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

const setMainImage = (url: string) => {
	mainImage.value = url;
};

// Add method to open image pop-up
const openImagePopup = (url: string) => {
	if (!property.value?.images?.length) {
		selectedImage.value = null;
		showImagePopup.value = false;
		return;
	}
	const index =
		property.value.images.findIndex((img) => img.url === url) || 0;
	currentImageIndex.value = index;
	selectedImage.value = url;
	showImagePopup.value = true;
};

// Add method to close image pop-up
const closeImagePopup = () => {
	showImagePopup.value = false;
	selectedImage.value = null;
};

const downloadBrochure = (url: string) => {
	window.open(imagePath(url), "_blank");
};

const saveEnquiry = async (enquiry: Record<string, any>) => {
	enquiry.property_location = property?.value?.area.name;
	enquiry.property_id = property?.value?.id;
	enquiry.property_link = window.location.href;

	try {
		const result = await enquireForBuying(enquiry);
		if (result) {
			console.log("Enquiry saved successfully.", result);
			showEnquiryModal.value = false;
		}
	} catch (err) {
		console.error("Failed to save enquiry:", err);
	}
};

const overallConstructionPercentage = computed(() => {
	const floorPlans = property.value?.off_plans?.[0]?.floor_plans || [];
	if (!floorPlans.length) return 0;

	// Option 1: Average

	// Option 2: Max (if preferred)
	return Math.max(
		...floorPlans.map((plan) => Number(plan.construction_percentage || 0)),
	);
});

const formatConstructionStatus = (status: string) => {
	switch (status) {
		case "not_started":
			return "Not Started";
		case "in_progress":
			return "In Progress";
		case "completed":
			return "Completed";
		default:
			return status;
	}
};

const currentImageIndex = ref<number>(0);

const nextImage = () => {
	if (
		property?.value?.images &&
		currentImageIndex.value < property.value.images.length - 1
	) {
		currentImageIndex.value++;
		selectedImage.value =
			property.value.images[currentImageIndex.value].url;
	}
};

const prevImage = () => {
	if (currentImageIndex.value > 0) {
		currentImageIndex.value--;
		selectedImage.value =
			property.value.images[currentImageIndex.value].url;
	}
};

onMounted(() => {
	if (property?.value?.images?.length > 0) {
		mainImage.value = property?.value.images[0].url;
	}
});

watch(
	() => property?.value?.images,
	(newImages) => {
		if (newImages?.length > 0 && !mainImage.value) {
			mainImage.value = newImages[0].url;
		}
	},
	{ immediate: true },
);

watch(isVisible, (visible) => {
	if (visible) {
		refetch();
	}
});

useSeoMeta({
	title: computed(
		() => `${property.value?.name} - Million Homes Real Estate Broker LLC`,
	),
	description: computed(() => property.value?.description),
	ogImage: computed(() => imagePath(property.value?.images[0]?.url) ?? ""),
	ogTitle: computed(() => property.value?.name),
	ogDescription: computed(() => property.value?.description),
	ogType: "website",
	twitterCard: "summary_large_image",
	ogUrl: typeof window !== "undefined" ? window.location.href : "",
});
</script>

<template>
	<section ref="propertyRef" class="bg-gray-50 py-12 min-h-screen">
		<!-- Loading State -->
		<div
			v-if="isLoading"
			class="container mx-auto px-4 flex items-center justify-center py-32"
		>
			<div class="text-center">
				<div
					class="animate-spin h-14 w-14 rounded-full border-4 border-t-primary border-gray-200 mx-auto"
				></div>
				<p class="text-gray-500 mt-4 font-medium">
					Loading property details...
				</p>
			</div>
		</div>

		<!-- Error State -->
		<div
			v-else-if="isError"
			class="container mx-auto px-4 flex items-center justify-center py-32"
		>
			<div class="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
				<lucideIcons.AlertCircle
					class="h-16 w-16 text-red-500 mx-auto mb-4"
				/>
				<h3 class="text-xl font-bold text-gray-800 mb-2">
					Couldn't Load Property
				</h3>
				<p class="text-gray-600 mb-6">
					We encountered an issue while loading this property. Please
					try again.
				</p>
				<button
					@click="refetch"
					class="px-6 py-3 bg-black-100 text-white rounded-lg font-medium hover:bg-black-100/90 transition-all"
				>
					Try Again
				</button>
			</div>
		</div>

		<!-- Property Content -->
		<div v-else class="container mx-auto px-4">
			<!-- Breadcrumbs -->
			<div class="text-sm text-gray-500 mb-6 flex items-center space-x-2">
				<a href="/" class="hover:text-primary transition-colors"
					>Home</a
				>
				<lucideIcons.ChevronRight class="h-4 w-4" />
				<a
					href="/properties"
					class="hover:text-primary transition-colors"
					>Properties</a
				>
				<lucideIcons.ChevronRight class="h-4 w-4" />
				<span
					class="notranslate text-gray-700 font-medium"
					translate="no"
					lang="en"
					:data-original="property?.title"
				>{{ property?.title }}</span>
			</div>

			<!-- Property Header -->
			<div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
				<!-- Off Plan Details -->
				<div
					v-if="property?.completion_status === 'off_plan'"
					class="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b pb-4"
				>
					<div
						v-if="property?.developer_name"
						class="flex items-center"
					>
						<lucideIcons.User class="h-4 w-4 mr-2 text-primary" />
						Developer: <span
							class="notranslate"
							translate="no"
							lang="en"
							:data-original="property.developer_name"
						>{{ property.developer_name }}</span>
					</div>
					<div
						v-if="property?.off_plans?.[0]?.handover"
						class="flex items-center"
					>
						<lucideIcons.CalendarCheck
							class="h-4 w-4 mr-2 text-primary"
						/>
						<span
							>Handover:
							{{ property.off_plans[0].handover }}</span
						>
					</div>
					<div
						v-if="property?.off_plans?.[0]?.construction_status"
						class="flex items-center"
					>
						<lucideIcons.Construction
							class="h-4 w-4 mr-2 text-primary"
						/>
						<span
							>Status:
							{{
								formatConstructionStatus(
									property.off_plans[0].construction_status,
								)
							}}</span
						>
					</div>
				</div>

				<div
					class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-start gap-4 mb-6"
				>
					<!-- Title & Info -->
					<div class="w-full sm:w-auto">
						<h1
							class="notranslate text-2xl sm:text-4xl font-bold text-gray-900 mb-2"
							translate="no"
							lang="en"
							:data-original="property?.title"
						>
							{{ property?.title }}
						</h1>
						<router-link :to="`/area/${property?.area_id}`">
							<div class="flex items-center text-gray-600 mb-1">
								<lucideIcons.MapPin class="h-4 w-4 mr-2" />
								<span>{{ property?.explore_location }}</span>
							</div>
						</router-link>
						<div
							class="flex flex-wrap items-center text-gray-600 text-sm"
						>
							<div
								v-if="property?.year_built"
								class="flex items-center mb-1 mr-2"
							>
								<lucideIcons.Calendar class="h-4 w-4 mr-1" />
								<span
									v-if="
										property?.completion_status ===
										'off_plan'
									"
								>
									Handover
									{{ property?.off_plans?.[0]?.handover }}
								</span>
								<span v-else-if="property?.year_built">
									Built in {{ property?.year_built }}
								</span>
							</div>
							<span class="hidden sm:inline mx-2">•</span>
							<span
								class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-medium mb-1 mr-2"
							>
								{{
									property?.completion_status === "off_plan"
										? "Off Plan"
										: "Ready"
								}}
							</span>
							<span class="hidden sm:inline mx-2">•</span>
							<span
								class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium mb-1"
							>
								{{
									property?.purpose === "buy"
										? "For Sale"
										: "For Rent"
								}}
							</span>
						</div>
					</div>

					<!-- Price & Share -->
					<div
						class="w-full sm:w-auto flex flex-col items-start sm:items-end"
					>
						<div
							class="text-2xl sm:text-3xl font-bold text-primary mb-2 sm:mb-1"
						>
							{{ getPropertyTypePrice(property) }}
						</div>
						<div class="flex space-x-2 relative">
							<button
								@click="copyLink"
								class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
								title="Copy link"
							>
								<lucideIcons.Link
									class="h-5 w-5 text-gray-600"
								/>
							</button>
							<button
								@click="toggleShareDropdown1"
								class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
								title="Share"
							>
								<lucideIcons.Share
									class="h-5 w-5 text-gray-600"
								/>
							</button>
							<div
								v-if="showShareDropdown1"
								class="absolute right-0 top-10 bg-white border rounded-lg shadow-lg z-10"
							>
								<button
									@click="shareViaWhatsApp"
									class="block w-full text-left px-4 py-2 hover:bg-gray-100"
								>
									WhatsApp
								</button>
								<button
									@click="shareViaTelegram"
									class="block w-full text-left px-4 py-2 hover:bg-gray-100"
								>
									Telegram
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Key Features Grid -->
				<div
					class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4"
				>
					<div
						v-for="[label, [value, icon]] in Object.entries({
							...(property?.completion_status === 'off_plan'
								? {
										Developer: [
											property?.developer_name,
											lucideIcons.HardHat,
										],
										Handover: [
											property?.off_plans?.[0]?.handover,
											lucideIcons.Calendar,
										],
										'Construction Status': [
											property?.off_plans?.[0]
												?.construction_status
												? formatConstructionStatus(
														property.off_plans[0]
															.construction_status,
													)
												: null,
											lucideIcons.Percent,
										],
									}
								: property?.property_type_slug ===
									  'holiday-homes'
									? {
											Bedrooms: [
												property?.bedrooms
													? `${property.bedrooms} (${property.beds} ${property.beds == 1 ? 'bed' : 'beds'})`
													: null,
												lucideIcons.Bed,
											],
											Bathrooms: [
												property?.bathrooms,
												lucideIcons.Bath,
											],
											'Minimum Stay': [
												property?.minimum_stay
													? `${property.minimum_stay} nights`
													: null,
												lucideIcons.Calendar,
											],
											Guests: [
												property?.no_of_guests,
												lucideIcons.Users,
											],
										}
									: {
											Bedrooms: [
												property?.property_type_slug !=
													'commercial' &&
												property?.bedrooms
													? property.bedrooms
													: null,
												lucideIcons.Bed,
											],
											Bathrooms: [
												property?.property_type_slug !=
													'commercial' &&
												property?.bathrooms
													? property.bathrooms
													: null,
												lucideIcons.Bath,
											],
											Size: [
												property?.size_sqft
													? `${property.size_sqft} sqft`
													: null,
												lucideIcons.Move,
											],
											Type: [
												property?.property_type,
												lucideIcons.Home,
											],
										}),
						}).filter(([_, [value]]) => value)"
						:key="label"
						class="flex items-center p-4 rounded-lg border border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-black-100/5 transition-all"
					>
						<div class="bg-black-100/10 p-2 rounded-lg mr-3">
							<component
								:is="icon"
								class="h-5 w-5 text-primary"
							/>
						</div>
						<div>
							<p class="text-gray-500 text-sm">{{ label }}</p>
							<p class="font-semibold" :translate="label === 'Developer' ? 'no' : undefined">{{ value }}</p>
						</div>
					</div>
				</div>

				<!-- Additional Features -->
				<div class="flex flex-wrap gap-3">
					<div
						v-if="property?.maid_room == '1'"
						class="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
					>
						<lucideIcons.Check class="h-4 w-4 text-primary mr-1" />
						Maid Room
					</div>
				</div>
			</div>

			<!-- Main Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left Content (2 Columns) -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Gallery Section -->
					<div class="bg-white rounded-xl shadow-sm overflow-hidden">
						<div class="relative h-96 overflow-hidden">
							<img
								v-if="property?.images?.length"
								:src="
									imagePath(
										mainImage ?? property?.images[0].url,
									)
								"
								class="w-full h-full object-cover transition-transform duration-500 cursor-pointer"
								alt="Property"
								@click="
									openImagePopup(
										mainImage ?? property?.images[0].url,
									)
								"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
							>
								<button
									class="p-3 bg-white/90 rounded-full"
									@click="
										openImagePopup(
											mainImage ??
												property?.images[0].url,
										)
									"
								>
									<lucideIcons.Maximize2
										class="h-6 w-6 text-gray-800"
									/>
								</button>
							</div>
						</div>
						<div class="p-4 bg-gray-50 border-t">
							<div class="flex space-x-3 overflow-x-auto pb-2">
								<div
									v-for="(img, i) in property?.images"
									:key="i"
									@click="setMainImage(img.url)"
									class="cursor-pointer flex-shrink-0 w-24 h-24 rounded-lg overflowing-hidden border-2"
									:class="
										mainImage === img.url
											? 'border-primary'
											: 'border-transparent'
									"
								>
									<img
										:src="imagePath(img.url)"
										class="w-full h-full object-cover"
										:alt="`Property image ${i + 1}`"
									/>
								</div>
							</div>
						</div>
					</div>

					<!-- Navigation Tabs -->
					<div class="bg-white rounded-xl shadow-sm">
						<div class="border-b flex overflow-x-auto">
							<button
								@click="activeTab = 'overview'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="
									activeTab === 'overview'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
								"
							>
								Overview
							</button>
							<button
								@click="activeTab = 'location'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="
									activeTab === 'location'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
								"
								v-if="
									property?.metro_stations?.length ||
									property?.bus_stations?.length ||
									property?.nearby_amenities?.length ||
									property?.airports?.length
								"
							>
								Location & Nearby
							</button>
							<button
								@click="activeTab = 'amenities'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="
									activeTab === 'amenities'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
								"
								v-if="property?.other_amenities?.length"
							>
								Amenities
							</button>
							<button
								@click="activeTab = 'payment'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="
									activeTab === 'payment'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
								"
								v-if="property?.off_plans?.length"
							>
								Payment Plan
							</button>
							<button
								@click="activeTab = 'floor_plans'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="
									activeTab === 'floor_plans'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
								"
								v-if="
									property?.off_plans?.[0]?.floor_plans
										?.length
								"
							>
								Floor Plans
							</button>
							<button
								@click="activeTab = 'downloads'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="
									activeTab === 'downloads'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
								"
								v-if="property?.brochures?.length"
							>
								Brochures
							</button>
						</div>

						<!-- Tab Content -->
						<div class="p-6">
							<!-- Overview Tab -->
							<div v-if="activeTab === 'overview'">
								<h2
									class="text-xl font-bold mb-4 pb-3 border-b"
								>
									About This Property
								</h2>
								<div
									v-if="property?.description"
									class="prose max-w-none"
								>
									<div
										:class="{}"
										v-html="property?.description"
									></div>
								</div>
								<div v-else class="text-gray-500 italic">
									No description available.
								</div>

								<!-- Residential Options -->
								<div
									class="mt-8"
									v-if="property?.residential_options?.length"
								>
									<h3 class="text-lg font-bold mb-3">
										Available Units
									</h3>
									<div
										class="grid grid-cols-1 sm:grid-cols-2 gap-4"
									>
										<div
											v-for="option in property.residential_options"
											:key="option.id"
											class="p-4 border rounded-lg bg-gray-50"
										>
											<p class="font-medium">
												{{ option.title }}
											</p>
											<p class="text-sm text-gray-500">
												{{ option.description }}
											</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Location & Nearby Tab -->
							<div v-else-if="activeTab === 'location'">
								<h2
									class="text-xl font-bold mb-4 pb-3 border-b"
								>
									Location & Nearby
								</h2>
								<div
									v-if="
										property?.explore_iframe_link ||
										(property?.area &&
											property?.area.explore_iframe_link)
									"
									class="mb-6 rounded-lg overflow-hidden border h-64"
								>
									<div
										v-html="
											property?.explore_iframe_link ||
											property?.area?.explore_iframe_link
										"
										class="w-full h-full"
									></div>
								</div>
								<div
									:class="`grid grid-cols-1 ${gridColsClass} gap-6`"
								>
									<div
										v-if="
											property?.metro_stations?.length ||
											property?.bus_stations?.length ||
											property?.airports?.length
										"
									>
										<h3
											class="font-semibold text-lg mb-3 flex items-center"
										>
											<lucideIcons.Train
												class="h-5 w-5 mr-2 text-primary"
											/>
											Public Transit
										</h3>
										<Accordion
											type="multiple"
											class="w-full space-y-4"
										>
											<AccordionItem value="bus">
												<AccordionTrigger
													class="text-lg font-semibold flex items-center gap-2"
												>
													<lucideIcons.Bus
														class="h-5 w-5 text-primary"
													/>
													Bus Stations ({{
														property.bus_stations
															?.length ?? 0
													}})
												</AccordionTrigger>
												<AccordionContent>
													<div
														v-if="
															property
																.bus_stations
																?.length
														"
														class="space-y-2"
													>
														<div
															v-for="station in property.bus_stations"
															:key="station.name"
															class="flex items-center gap-3 p-3 rounded-lg bg-muted"
														>
															<lucideIcons.Bus
																class="h-4 w-4 text-primary"
															/>
															<div>
																<p
																	class="font-medium"
																>
																	{{
																		station.name
																	}}
																</p>
																<p
																	class="text-xs text-gray-500"
																>
																	{{
																		station.distance
																	}}
																</p>
															</div>
														</div>
													</div>
													<p
														v-else
														class="text-gray-500 italic"
													>
														No bus stations found.
													</p>
												</AccordionContent>
											</AccordionItem>
											<AccordionItem value="metro">
												<AccordionTrigger
													class="text-lg font-semibold flex items-center gap-2"
												>
													<lucideIcons.Train
														class="h-5 w-5 text-primary"
													/>
													Metro Stations ({{
														property.metro_stations
															?.length ?? 0
													}})
												</AccordionTrigger>
												<AccordionContent>
													<div
														v-if="
															property
																.metro_stations
																?.length
														"
														class="space-y-2"
													>
														<div
															v-for="station in property.metro_stations"
															:key="station.name"
															class="flex items-center gap-3 p-3 rounded-lg bg-muted"
														>
															<lucideIcons.Train
																class="h-4 w-4 text-primary"
															/>
															<div>
																<p
																	class="font-medium"
																>
																	{{
																		station.name
																	}}
																</p>
																<p
																	class="text-xs text-gray-500"
																>
																	{{
																		station.distance
																	}}
																</p>
															</div>
														</div>
													</div>
													<p
														v-else
														class="text-gray-500 italic"
													>
														No metro stations found.
													</p>
												</AccordionContent>
											</AccordionItem>
											<AccordionItem value="airport">
												<AccordionTrigger
													class="text-lg font-semibold flex items-center gap-2"
												>
													<lucideIcons.Plane
														class="h-5 w-5 text-primary"
													/>
													Airports ({{
														property.airports
															?.length ?? 0
													}})
												</AccordionTrigger>
												<AccordionContent>
													<div
														v-if="
															property.airports
																?.length
														"
														class="space-y-2"
													>
														<div
															v-for="airport in property.airports"
															:key="airport.name"
															class="flex items-center gap-3 p-3 rounded-lg bg-muted"
														>
															<lucideIcons.Plane
																class="h-4 w-4 text-primary"
															/>
															<div>
																<p
																	class="font-medium"
																>
																	{{
																		airport.name
																	}}
																</p>
																<p
																	class="text-xs text-gray-500"
																>
																	{{
																		airport.distance
																	}}
																</p>
															</div>
														</div>
													</div>
													<p
														v-else
														class="text-gray-500 italic"
													>
														No airports found.
													</p>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</div>
									<div
										v-if="
											property?.nearby_amenities?.length
										"
									>
										<h3
											class="font-semibold text-lg mb-3 flex items-center"
										>
											<lucideIcons.MapPin
												class="h-5 w-5 mr-2 text-primary"
											/>
											Nearby Amenities
										</h3>
										<ul class="space-y-3">
											<li
												v-for="amenity in property.nearby_amenities"
												:key="`${amenity.name}-${amenity.location}`"
												class="flex items-start"
											>
												<div
													class="bg-black-100/10 p-1.5 rounded-full mr-3 mt-0.5"
												>
													<lucideIcons.MapPin
														class="h-4 w-4 text-primary"
													/>
												</div>
												<div>
													<p class="font-medium">
														{{ amenity.name }}
													</p>
													<p
														class="text-sm text-gray-500"
													>
														{{ amenity.category }} •
														{{ amenity.distance }}
													</p>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>

							<!-- Amenities Tab -->
							<div
								v-else-if="activeTab === 'amenities'"
								v-if="property?.other_amenities?.length"
							>
								<h2
									class="text-xl font-bold mb-4 pb-3 border-b"
								>
									Property Amenities
								</h2>
								<div
									class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
								>
									<div
										v-for="amenity in property.other_amenities"
										:key="amenity.id"
										class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300"
									>
										<div class="flex items-center mb-3">
											<div
												class="bg-black-100/10 p-2 rounded-full mr-3"
											>
												<img
													v-if="amenity.image?.url"
													:src="
														imagePath(
															amenity.image.url,
														)
													"
													alt="Amenity Icon"
													class="h-8 w-8 object-contain"
												/>
												<lucideIcons.CheckCircle
													v-else
													class="h-8 w-8 text-primary"
												/>
											</div>
											<h4
												class="font-semibold text-gray-800"
											>
												{{ amenity.name }}
											</h4>
										</div>
										<p
											class="text-sm text-gray-500 line-clamp-2"
										>
											{{ amenity.description }}
										</p>
									</div>
								</div>
							</div>

							<!-- Payment Plan Tab -->
							<div
								v-else-if="activeTab === 'payment'"
								v-if="property?.off_plans?.length"
							>
								<h2
									class="text-xl font-bold mb-6 text-gray-700 pb-3 border-b"
								>
									Payment Plan Details
								</h2>
								<div
									v-for="(plan, index) in property?.off_plans"
									:key="index"
									class="mb-8"
								>
									<!-- Payment Plan Grid (Boxed Layout) -->
									<div
										class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
									>
										<div
											v-for="[
												label,
												[value, icon],
											] in Object.entries({
												'Down Payment': [
													plan.down_payment_percentage
														? `${plan.down_payment_percentage}%`
														: null,
													lucideIcons.Percent,
												],
												'During Construction': [
													plan.during_construction
														? `${plan.during_construction}%`
														: null,
													lucideIcons.Construction,
												],
												'On Handover': [
													plan.on_handover
														? `${plan.on_handover}%`
														: null,
													lucideIcons.Key,
												],
												'Post Handover': [
													plan.post_handover
														? `${plan.post_handover}%`
														: null,
													lucideIcons.Send,
												],
											}).filter(([_, [value]]) => value)"
											:key="label"
											class="flex items-center p-4 rounded-lg border border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-black-100/5 transition-all"
										>
											<div
												class="bg-black-100/10 p-2 rounded-lg mr-3"
											>
												<component
													:is="icon"
													class="h-5 w-5 text-primary"
												/>
											</div>
											<div>
												<p
													class="text-gray-500 text-sm"
												>
													{{ label }}
												</p>
												<p class="font-semibold">
													{{ value }}
												</p>
											</div>
										</div>
									</div>

									<!-- Handover and Overview -->
									<div class="bg-gray-50 p-4 rounded-lg mb-4">
										<h3 class="font-bold text-lg mb-2">
											{{ plan.title }}
										</h3>
										<div
											class="grid grid-cols-1 md:grid-cols-2 gap-4"
										>
											<div
												class="flex items-center text-sm text-gray-600"
											>
												<lucideIcons.CalendarCheck
													class="h-4 w-4 mr-2 text-primary"
												/>
												<span
													>Handover:
													{{ plan.handover }}</span
												>
											</div>
											<div
												class="flex items-center text-sm text-gray-600"
											>
												<lucideIcons.Info
													class="h-4 w-4 mr-2 text-primary"
												/>
												<span
													>Overview:
													{{
														plan.overview_payment_plan
													}}</span
												>
											</div>
										</div>
									</div>

									<!-- Description -->
									<div class="mb-4">
										<h4 class="font-semibold mb-2">
											Description
										</h4>
										<div
											class="prose max-w-none"
											v-html="plan.description"
										></div>
									</div>

									<!-- Unit Types -->
									<div class="space-y-4 text-sm">
										<div
											v-if="
												plan.unit_type?.residential &&
												Object.keys(
													plan.unit_type.residential,
												).length
											"
										>
											<p
												class="font-semibold text-gray-900 mb-1"
											>
												Unit Type | Residential
											</p>
											<p class="text-gray-400">
												{{
													Object.values(
														plan.unit_type
															.residential,
													)
														.map((t) => t.name)
														.join(", ")
												}}
											</p>
										</div>
										<div
											v-if="
												plan.unit_type?.commercial &&
												Object.keys(
													plan.unit_type.commercial,
												).length
											"
										>
											<p
												class="font-semibold text-gray-900 mb-1"
											>
												Unit Type | Commercial
											</p>
											<p class="text-gray-400">
												{{
													Object.values(
														plan.unit_type
															.commercial,
													)
														.map((t) => t.name)
														.join(", ")
												}}
											</p>
										</div>
									</div>

									<!-- Payment Plan Documents -->
									<div v-if="plan.payment_plans?.length">
										<h4 class="font-semibold mb-3">
											Payment Plan Documents
										</h4>
										<div
											class="grid grid-cols-1 sm:grid-cols-2 gap-4"
										>
											<a
												v-for="(
													doc, i
												) in plan.payment_plans"
												:key="i"
												:href="imagePath(doc.url)"
												target="_blank"
												class="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
											>
												<div
													class="bg-blue-50 p-2 rounded-lg mr-3"
												>
													<lucideIcons.FileText
														class="h-5 w-5 text-blue-500"
													/>
												</div>
												<div
													class="flex-1 overflow-hidden"
												>
													<p
														class="font-medium text-gray-800 truncate group-hover:text-primary transition-colors"
													>
														{{ doc.name }}
													</p>
												</div>
												<lucideIcons.Download
													class="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors"
												/>
											</a>
										</div>
									</div>
								</div>
							</div>

							<!-- Floor Plans Tab -->
							<div
								v-else-if="activeTab === 'floor_plans'"
								v-if="
									property?.off_plans?.[0]?.floor_plans
										?.length
								"
							>
								<h2
									class="text-xl font-bold mb-4 pb-3 border-b text-gray-800"
								>
									Floor Plans
								</h2>
								<div
									class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
								>
									<div
										v-for="floorPlan in property
											?.off_plans[0].floor_plans"
										:key="floorPlan.id"
										class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md"
									>
										<h4
											class="font-semibold text-lg text-gray-800 mb-3"
										>
											{{ floorPlan.name }}
										</h4>
										<div
											v-for="image in floorPlan.images"
											:key="image.id"
											class="flex items-center justify-between py-2 border-t border-gray-100 first:border-t-0"
										>
											<span
												class="text-sm text-gray-600 truncate"
												>{{ image.name }}</span
											>
											<div class="flex gap-2">
												<button
													@click="
														viewImage(image.url)
													"
													class="text-gray-500 hover:text-gray-700 transition-colors"
													title="View"
												>
													<svg
														class="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
														></path>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
														></path>
													</svg>
												</button>
												<button
													@click="
														downloadImage(image.url)
													"
													class="text-gray-500 hover:text-gray-700 transition-colors"
													title="Download"
												>
													<svg
														class="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
														></path>
													</svg>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Brochures Tab -->
							<div
								v-else-if="activeTab === 'downloads'"
								v-if="property?.brochures?.length"
							>
								<h2
									class="text-xl font-bold mb-4 pb-3 border-b"
								>
									Brochures & Resources
								</h2>
								<div
									class="grid grid-cols-1 sm:grid-cols-2 gap-4"
								>
									<a
										v-for="(b, i) in property?.brochures"
										:key="i"
										:href="imagePath(b.url)"
										target="_blank"
										class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
									>
										<div
											class="bg-blue-50 p-3 rounded-lg mr-4"
										>
											<lucideIcons.FileText
												class="h-6 w-6 text-blue-500"
											/>
										</div>
										<div class="flex-1 overflow-hidden">
											<p
												class="font-medium text-gray-800 truncate group-hover:text-primary transition-colors"
											>
												{{ b.name }}
											</p>
											<p class="text-sm text-gray-500">
												Click to download
											</p>
										</div>
										<lucideIcons.Download
											@click.prevent="
												downloadBrochure(b.url)
											"
											class="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors cursor-pointer"
										/>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Sidebar -->
				<div class="space-y-6">
					<!-- Contact Card -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<h2 class="text-lg font-bold mb-4">
							Interested in this property?
						</h2>
						<div class="space-y-4">
							<router-link to="/contact-us">
								<button
									class="w-full bg-black-100 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
								>
									<lucideIcons.Mail class="h-5 w-5 mr-2" />
									Contact Us
								</button>
							</router-link>
							<button
								@click="scheduleViewing"
								class="w-full border border-primary text-primary py-3 px-4 rounded-lg font-medium hover:bg-black-100/5 transition-colors flex items-center justify-center"
							>
								<lucideIcons.Calendar class="h-5 w-5 mr-2" />
								{{
									property?.pType === "holiday-home"
										? "View in AirBnB"
										: property?.completion_status ===
											  "off_plan"
											? "Express Interest"
											: "Schedule Viewing"
								}}
							</button>
							<button
								v-if="property?.booking_com_link"
								@click="scheduleViewingBookin"
								class="w-full border border-primary text-primary py-3 px-4 rounded-lg font-medium hover:bg-black-100/5 transition-colors flex items-center justify-center"
							>
								<lucideIcons.Bed class="h-5 w-5 mr-2" />
								{{
									property?.pType === "holiday-home"
										? "View in Booking.com"
										: property?.completion_status ===
											  "off_plan"
											? "Express Interest"
											: "Schedule Viewing"
								}}
							</button>
						</div>
						<div class="mt-6 pt-6 border-t" translate="no">
							<div class="flex items-center mb-4">
								<div
									class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mr-3"
								>
									<img
										v-if="displayAgent?.image"
										:src="imagePath(displayAgent.image?.url)"
										alt="Agent"
										class="w-full h-full object-cover"
									/>
									<lucideIcons.User
										v-else
										class="w-full h-full p-2 text-gray-500"
									/>
								</div>
								<div translate="no">
									<p class="font-medium">
										{{ displayAgent?.name || "Property Agent" }}
									</p>
									<p class="text-sm text-gray-500">
										{{ displayAgent?.designation || "Real Estate Agent" }}
									</p>
								</div>
							</div>
							<div class="space-y-2">
								<a
									v-if="displayAgent?.phone_number"
									:href="`tel:${displayAgent.phone_number}`"
									class="w-full border border-gray-200 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
									translate="no"
								>
									<lucideIcons.Phone
										class="h-4 w-4 mr-2 text-primary"
									/>
									{{ displayAgent.phone_number }}
								</a>
								<a
									v-if="displayAgent?.whatsapp_number"
									:href="`https://wa.me/${displayAgent.whatsapp_number.replace(/\s+/g, '')}`"
									class="w-full border border-gray-200 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
									translate="no"
								>
									<lucideIcons.MessageSquare
										class="h-4 w-4 mr-2 text-green-500"
									/>
									WhatsApp
								</a>
								<a
									v-if="displayAgent?.email"
									:href="`mailto:${displayAgent.email}`"
									class="w-full border border-gray-200 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
									translate="no"
								>
									<lucideIcons.Mail
										class="h-4 w-4 mr-2 text-primary"
									/>
									{{ displayAgent.email }}
								</a>
							</div>
							<p
								v-if="displayAgent?.rera_number"
								class="text-xs text-gray-500 mt-3"
								translate="no"
							>
								RERA: {{ displayAgent.rera_number }}
							</p>
						</div>
					</div>

					<!-- Off-Plan Progress (for off_plan only) -->
					<div
						v-if="
							property?.completion_status === 'off_plan' &&
							property?.off_plans?.[0]?.floor_plans?.length &&
							property?.off_plans?.[0]?.construction_status ==
								'in_progress'
						"
						class="bg-white rounded-xl shadow-sm p-6"
					>
						<h2 class="text-lg font-bold mb-4">
							Construction Progress
						</h2>

						<div class="space-y-4">
							<div>
								<p class="font-medium">Overall Progress</p>
								<div
									class="w-full bg-gray-200 rounded-full h-2.5"
								>
									<div
										class="bg-black-100 h-2.5 rounded-full"
										:style="{
											width: `${property?.off_plans?.[0]?.construction_percentage ?? 0}%`,
										}"
									></div>
								</div>
								<p class="text-sm text-gray-500 mt-1">
									{{
										property?.off_plans?.[0]
											.construction_percentage ?? 0
									}}% Complete
								</p>
							</div>
						</div>
					</div>

					<!-- Share This Property Card -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<h2 class="text-lg font-bold mb-4">
							Share This Property
						</h2>
						<div class="flex space-x-2 relative">
							<button
								@click="copyLink"
								class="flex-1 flex items-center justify-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
								title="Copy link"
							>
								<lucideIcons.Link
									class="h-5 w-5 text-gray-600"
								/>
							</button>
							<button
								@click="toggleShareDropdown2"
								class="flex-1 flex items-center justify-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
								title="Share"
							>
								<lucideIcons.Share
									class="h-5 w-5 text-gray-600"
								/>
							</button>
							<div
								v-if="showShareDropdown2"
								class="absolute right-0 top-10 bg-white border rounded-lg shadow-lg z-10"
							>
								<button
									@click="shareViaWhatsApp"
									class="block w-full text-left px-4 py-2 hover:bg-gray-100"
								>
									WhatsApp
								</button>
								<button
									@click="shareViaTelegram"
									class="block w-full text-left px-4 py-2 hover:bg-gray-100"
								>
									Telegram
								</button>
							</div>
						</div>
					</div>

					<!-- Download Resources -->
					<div
						v-if="property?.brochures?.length"
						class="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
					>
						<h3 class="font-bold text-lg mb-2">
							Download Resources
						</h3>
						<p class="text-sm text-gray-600 mb-4">
							Get detailed information about this property by
							downloading our brochures.
						</p>
						<div class="space-y-3">
							<a
								v-for="(brochure, i) in property?.brochures"
								:key="i"
								:href="imagePath(brochure.url)"
								target="_blank"
								class="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all group"
							>
								<div
									class="bg-black-100/10 p-2 rounded-lg mr-3"
								>
									<lucideIcons.FileText
										class="h-5 w-5 text-primary"
									/>
								</div>
								<div class="flex-1 overflow-hidden">
									<p
										class="font-medium text-gray-800 truncate group-hover:text-primary transition-colors"
									>
										{{ brochure.name }}
									</p>
								</div>
								<lucideIcons.Download
									class="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors"
								/>
							</a>
						</div>
					</div>

					<!-- QR Code Section -->
					<div
						v-if="property?.qr_image"
						class="bg-white rounded-xl shadow-sm p-6 text-center"
					>
						<h2 class="text-lg font-bold mb-4">Scan QR to View</h2>
						<div class="flex justify-center">
							<img
								:src="imagePath(property.qr_image)"
								alt="QR Code"
								class="w-40 h-40 object-contain border p-2 rounded-lg"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Image Pop-up Modal -->
		<div
			v-if="showImagePopup && selectedImage"
			class="fixed inset-0 bg-black-100/80 z-50 flex items-center justify-center"
			@click="closeImagePopup"
		>
			<div class="relative max-w-5xl w-full mx-4" @click.stop>
				<button
					class="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
					@click="closeImagePopup"
				>
					<lucideIcons.X class="h-6 w-6 text-gray-800" />
				</button>
				<button
					v-if="property?.images?.length > 1 && currentImageIndex > 0"
					class="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
					@click="prevImage"
				>
					<lucideIcons.ChevronLeft class="h-6 w-6 text-gray-800" />
				</button>
				<button
					v-if="
						property?.images?.length > 1 &&
						currentImageIndex < property?.images?.length - 1
					"
					class="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
					@click="nextImage"
				>
					<lucideIcons.ChevronRight class="h-6 w-6 text-gray-800" />
				</button>
				<img
					:src="imagePath(selectedImage)"
					class="w-full h-auto max-h-[80vh] object-contain rounded-lg"
					alt="Full-screen property image"
				/>
			</div>
		</div>

		<PropertyEnquiryModal
			:show="showEnquiryModal"
			:enquiryType="property?.purpose"
			:completionStatus="property?.completion_status"
			:selectedPropertyTypeId="property?.property_type_id"
			:selectedPropertyId="property?.id"
			:propertyId="property?.id"
			@submit="saveEnquiry"
			@cancel="showEnquiryModal = false"
		/>
	</section>
</template>

<style scoped>
::v-deep .w-full iframe {
	width: 100% !important;
	height: 100% !important;
	display: block;
}
</style>
