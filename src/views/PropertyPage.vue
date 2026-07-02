<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { usePropertyTypeQuery } from "../composables/usePropertyTypeQuery";
import { useRoute, useRouter } from "vue-router";
import { useAmenityQuery } from "../composables/useAmenityQuery";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { imagePath, isImageAsset, formatPrice } from "../utils/helpers";
import axios from "../services/axios";
import type { Property } from "../types/property";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../components/ui/tabs";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import {
	Check,
	ChevronsUpDown,
	Search,
	BedDouble,
	Bath,
	Ruler,
	X,
} from "lucide-vue-next";
import { cn } from "../lib/utils";
import { debounce } from "lodash-es";

import PropertyCard from "../components/PropertyCard.vue";
import PropertyCarousel from "../components/PropertyCarousel.vue";

const defaultFilters = ref<{
	purpose: string | null;
	completion_status: "ready" | "off_plan" | "";
	property_type: number[];
}>({
	purpose: null,
	completion_status: "",
	property_type: [],
});

// Filters
const selectedPropertyTypes = ref<number[]>([]);
const selectedAmenities = ref<number[]>([]);
const minPrice = ref("");
const maxPrice = ref("");
const bedrooms = ref<string | null>("any");
const bathrooms = ref<string | null>("any");
const maidRoom = ref<boolean | null>(null);
const purpose = ref<string | null>(null);
const minSize = ref("");
const maxSize = ref("");
const selectedMetroStation = ref<string | null>(null);
const selectedNearbyAmenity = ref<string | null>(null);
const activeTab = ref<"ready" | "off_plan">("ready");
const currentPage = ref(1);
const propertySearch = ref("");
const searchInput = ref("");
const searchOpen = ref(false);
const showFilters = ref(false);
const showAdvancedFilters = ref(false);
const viewMode = ref<"grid" | "list">("grid");
const location = ref("");

// Search-specific refs
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchContainerRef = ref<HTMLDivElement | null>(null);
const isSearchFocused = ref(false);
const searchTimeout = ref<NodeJS.Timeout | null>(null);

// Fetch filter options
const { data: propertyTypes } = usePropertyTypeQuery();
const { data: amenities } = useAmenityQuery();

const queryClient = useQueryClient();

// Debounced search input watcher
const debouncedSearchInput = ref("");
watch(
	searchInput,
	debounce((newValue: string) => {
		debouncedSearchInput.value = newValue;
	}, 300),
);

// Fetch areas and communities for search with improved error handling
const searchSuggestionsQuery = useQuery({
	queryKey: ["searchSuggestions", debouncedSearchInput],
	queryFn: async ({ signal }) => {
		if (
			!debouncedSearchInput.value ||
			debouncedSearchInput.value.length < 2
		) {
			return { areas: [], properties: [] };
		}

		try {
			const response = await axios.get(
				"/front/property/search/suggestions",
				{
					params: { query: debouncedSearchInput.value },
					signal,
				},
			);
			return response.data || { areas: [], properties: [] };
		} catch (error) {
			if (error.name === "AbortError") {
				return { areas: [], properties: [] };
			}
			console.error("Error fetching search suggestions:", error);
			throw error;
		}
	},
	enabled: computed(() => debouncedSearchInput.value.length >= 2),
	staleTime: 5 * 60 * 1000,
	gcTime: 10 * 60 * 1000,
	refetchOnWindowFocus: false,
	retry: (failureCount, error) => {
		if (error?.name === "AbortError") return false;
		return failureCount < 2;
	},
});

const searchSuggestions = computed(
	() =>
		searchSuggestionsQuery.data.value ?? {
			areas: [],
			properties: [],
		},
);
const isFetchingSuggestions = computed(
	() => searchSuggestionsQuery.isFetching.value,
);
const searchError = computed(() => searchSuggestionsQuery.error.value);

// Fetch properties API
const {
	data: propertyResponse,
	refetch: rawRefetch,
	isFetching,
} = useQuery({
	queryKey: [
		"properties",
		selectedPropertyTypes,
		selectedAmenities,
		minPrice,
		maxPrice,
		bedrooms,
		bathrooms,
		maidRoom,
		purpose,
		minSize,
		maxSize,
		selectedMetroStation,
		selectedNearbyAmenity,
		activeTab,
		currentPage,
		propertySearch,
		location,
	],
	queryFn: async () => {
		const response = await axios.get("/front/property/list", {
			params: {
				property_type_id: selectedPropertyTypes.value.length
					? selectedPropertyTypes.value
					: undefined,
				amenities: selectedAmenities.value.length
					? selectedAmenities.value
					: undefined,
				min_price: minPrice.value || undefined,
				max_price: maxPrice.value || undefined,
				bedrooms: bedrooms.value !== "any" ? bedrooms.value : undefined,
				bathrooms:
					bathrooms.value !== "any" ? bathrooms.value : undefined,
				maid_room: maidRoom.value,
				purpose: purpose.value,
				min_size_sqft: minSize.value || undefined,
				max_size_sqft: maxSize.value || undefined,
				metro_station: selectedMetroStation.value,
				nearby_amenity: selectedNearbyAmenity.value,
				completion_status: activeTab.value,
				page: currentPage.value,
				search: propertySearch.value || undefined,
				location: location.value || undefined,
			},
		});
		return response.data;
	},
	keepPreviousData: true,
});

// Debounce refetch to prevent multiple API calls
const refetch = debounce(rawRefetch, 300);

// Computed properties
const properties = computed(() => propertyResponse.value?.data.data ?? []);
const totalPages = computed(() => propertyResponse.value?.data.last_page ?? 1);

// Enhanced search functionality
const shouldShowSuggestions = computed(() => {
	return (
		searchOpen.value &&
		searchInput.value.length >= 2 &&
		isSearchFocused.value
	);
});

const hasSearchResults = computed(() => {
	return (
		searchSuggestions.value.areas?.length > 0 ||
		searchSuggestions.value.properties?.length > 0
	);
});

// Toggle property type selection
const toggleTypeSelection = (id: number) => {
	const selected = selectedPropertyTypes.value.includes(id);

	const findTypeById = (id: number) => {
		for (const type of propertyTypes.value) {
			if (type.id === id) return type;
			if (type.children?.length) {
				const child = type.children.find((c) => c.id === id);
				if (child) return child;
			}
		}
		return null;
	};

	const type = findTypeById(id);

	if (!type) return;

	if (selected) {
		selectedPropertyTypes.value = selectedPropertyTypes.value.filter(
			(tid) =>
				tid !== id &&
				!type.children?.some((child: any) => child.id === tid),
		);
	} else {
		selectedPropertyTypes.value.push(id);
		if (type.children?.length) {
			type.children.forEach((child: any) => {
				if (!selectedPropertyTypes.value.includes(child.id)) {
					selectedPropertyTypes.value.push(child.id);
				}
			});
		}
	}
};

const isIndeterminate = (type: any) => {
	if (!type.children?.length) return false;

	const childIds = type.children.map((child: any) => child.id);
	const selectedChildren = childIds.filter((id) =>
		selectedPropertyTypes.value.includes(id),
	);

	return (
		selectedChildren.length > 0 &&
		(selectedChildren.length < childIds.length ||
			!selectedPropertyTypes.value.includes(type.id))
	);
};

// Input validation
const validateNumberInput = (value: string, type: "price" | "size") => {
	const num = parseInt(value);
	if (value === "") return "";
	if (isNaN(num) || num < 0) return "0";
	return num.toString();
};

const validateMinMax = (min: string, max: string) => {
	if (min && max && parseInt(min) > parseInt(max)) {
		return min;
	}
	return max;
};

const getLocationName = ref(
	computed(() => {
		if (!route.query.location) {
			return null;
		}

		let location = properties.value[0];
		return location?.location_area ?? null;
	}),
);

// Watch price and size inputs
watch(minPrice, (newVal) => {
	minPrice.value = validateNumberInput(newVal, "price");
	maxPrice.value = validateMinMax(minPrice.value, maxPrice.value);
});
watch(maxPrice, (newVal) => {
	maxPrice.value = validateNumberInput(newVal, "price");
	maxPrice.value = validateMinMax(minPrice.value, maxPrice.value);
});
watch(minSize, (newVal) => {
	minSize.value = validateNumberInput(newVal, "size");
	maxSize.value = validateMinMax(minSize.value, maxSize.value);
});
watch(maxSize, (newVal) => {
	maxSize.value = validateNumberInput(newVal, "size");
	maxSize.value = validateMinMax(minSize.value, maxSize.value);
});

const router = useRouter();
const route = useRoute();

const primaryImage = (property: Property) => {
	const imgs = (property.assets ?? property.images ?? []).filter((a) => isImageAsset(a.url));
	const img = imgs.find((a) => a.is_primary) ?? imgs[0];
	return img ? imagePath(img.url) : "/placeholder.jpg";
};

const goToPage = (page: number) => {
	if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const resetFilters = () => {
	selectedPropertyTypes.value = [];
	selectedAmenities.value = [];
	minPrice.value = "";
	maxPrice.value = "";
	bedrooms.value = "any";
	bathrooms.value = "any";
	maidRoom.value = null;
	purpose.value = defaultFilters.value.purpose;
	minSize.value = "";
	maxSize.value = "";
	selectedMetroStation.value = null;
	selectedNearbyAmenity.value = null;
	propertySearch.value = "";
	searchInput.value = "";
	activeTab.value = "";
	currentPage.value = 1;
	location.value = null;

	updateRouteQuery();
};

// Toggle filters
const toggleFilters = () => {
	showFilters.value = !showFilters.value;
};

const sortedAreas = computed(() => {
	return [...(searchSuggestions.value.areas || [])].sort((a, b) =>
		a.name.localeCompare(b.name),
	);
});

const sortedProperties = computed(() => {
	return [...(searchSuggestions.value.properties || [])].sort((a, b) =>
		a.title.localeCompare(b.title),
	);
});

const handleSearchFocus = () => {
	isSearchFocused.value = true;
	if (searchInput.value.length >= 2) {
		searchOpen.value = true;
	}
};

const handleSearchBlur = () => {
	// Only close the popover if the click is outside the search container
	if (!isSearchFocused.value) {
		searchOpen.value = false;
	}
};

const handleSearchInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	searchInput.value = target.value;

	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}

	if (searchInput.value.length >= 2) {
		searchOpen.value = true;
		isSearchFocused.value = true; // Ensure focus state
	} else {
		searchOpen.value = false;
		if (!searchInput.value) {
			propertySearch.value = "";
			updateRouteQuery();
		}
	}
};

const handleSearchKeydown = (event: KeyboardEvent) => {
	if (event.key === "Enter") {
		event.preventDefault();
		handleSearchSubmit();
	} else if (event.key === "Escape") {
		searchOpen.value = false;
		if (searchInputRef.value) {
			searchInputRef.value.blur();
		}
	}
};

const handleSearchSubmit = () => {
	if (searchInput.value.trim()) {
		propertySearch.value = searchInput.value.trim();
		searchOpen.value = false;
		updateRouteQuery();
		nextTick(() => {
			if (searchInputRef.value) {
				searchInputRef.value.focus();
				isSearchFocused.value = true; // Ensure focus state is maintained
				if (searchInput.value.length >= 2) {
					searchOpen.value = true; // Reopen dropdown if input is valid
				}
			}
		});
	}
};

const handleSearchSelect = (name: string) => {
	searchOpen.value = false;
	propertySearch.value = name;
	searchInput.value = name;
	updateRouteQuery();

	nextTick(() => {
		if (searchInputRef.value) {
			searchInputRef.value.focus();
		}
	});
};

const clearSearch = () => {
	searchInput.value = "";
	propertySearch.value = "";
	location.value = null;
	searchOpen.value = false;
	updateRouteQuery();
	nextTick(() => {
		if (searchInputRef.value) {
			searchInputRef.value.focus();
			isSearchFocused.value = true; // Ensure focus state is maintained
		}
	});
};

// Update route query
const updateRouteQuery = debounce(() => {
	const query: Record<string, string | string[] | undefined> = {
		property_type: selectedPropertyTypes.value.length
			? selectedPropertyTypes.value.join(",")
			: undefined,
		minPrice: minPrice.value || undefined,
		maxPrice: maxPrice.value || undefined,
		bedrooms: bedrooms.value !== "any" ? bedrooms.value : undefined,
		bathrooms: bathrooms.value !== "any" ? bathrooms.value : undefined,
		purpose: purpose.value || undefined,
		completion_status: activeTab.value || undefined,
		search: propertySearch.value || undefined,
		location: location.value || undefined,
	};
	router.replace({ query });
}, 300);

// Sync filters with route query on mount and when route changes
const syncFiltersFromRoute = () => {
	const query = route.query;

	defaultFilters.value.purpose = (query.purpose as string) ?? null;
	defaultFilters.value.completion_status =
		(query.completion_status as "ready" | "off_plan") ?? "";
	defaultFilters.value.property_type = query.property_type
		? (query.property_type as string)
				.split(",")
				.map(Number)
				.filter((id) => !isNaN(id))
		: [];

	purpose.value = defaultFilters.value.purpose;
	activeTab.value = defaultFilters.value.completion_status;
	selectedPropertyTypes.value = [...defaultFilters.value.property_type];
	propertySearch.value = (query.search as string) ?? "";
	searchInput.value = (query.search as string) ?? "";

	minPrice.value = (query.minPrice as string) ?? "";
	maxPrice.value = (query.maxPrice as string) ?? "";
	bedrooms.value = (query.bedrooms as string) ?? "any";
	bathrooms.value = (query.bathrooms as string) ?? "any";
	purpose.value = (query.purpose as string) ?? "buy";
	location.value = (query.location as string) ?? null;
};

// Watch route query changes with debounce
watch(() => route.query, syncFiltersFromRoute, { immediate: true, deep: true });

// Watch filter changes with debounce
watch(
	[
		selectedPropertyTypes,
		selectedAmenities,
		minPrice,
		maxPrice,
		bedrooms,
		bathrooms,
		maidRoom,
		purpose,
		minSize,
		maxSize,
		selectedMetroStation,
		selectedNearbyAmenity,
		activeTab,
		propertySearch,
		currentPage,
		location,
	],
	() => {
		refetch();
		updateRouteQuery();
	},
	{ flush: "post" },
);

onMounted(syncFiltersFromRoute);

const getPropertyTypePrice = (property: Property) => {
	if (property.completion_status === "off_plan") {
		return `From ${formatPrice(property.price)} AED`;
	}
	if (property.purpose === "rent") {
		return `${formatPrice(property.price)} AED / year`;
	}
	if ((property as any).property_type?.slug === "holiday-homes") {
		return `${formatPrice(property.price)} AED / night`;
	}
	return `${formatPrice(property.price)} AED`;
};
</script>

<template>
	<section class="bg-gray-50 min-h-screen font-sans antialiased">
		<!-- HEADER -->
		<div class="container py-12 md:py-16 text-center">
			<h1
				class="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black-600 to-blue-500 tracking-tight"
			>
				Find Your Dream Property
			</h1>
			<p
				class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mt-4 leading-relaxed"
			>
				Explore our exclusive collection of properties designed for your
				lifestyle.
			</p>
		</div>

		<!-- TABS -->
		<div class="container mb-8" v-if="false">
			<Tabs v-model="activeTab">
				<TabsList class="flex justify-center gap-2 bg-transparent p-0">
					<TabsTrigger
						value="ready"
						v-if="route.query?.completion_status !== 'off_plan'"
						class="px-6 py-3 text-sm sm:text-base font-medium rounded-full transition-all duration-300 data-[state=active]:bg-black-100 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:shadow-sm hover:bg-black-50"
					>
						Ready Properties
					</TabsTrigger>
					<TabsTrigger
						value="off_plan"
						v-if="route.query?.completion_status !== 'ready'"
						class="px-6 py-3 text-sm sm:text-base font-medium rounded-full transition-all duration-300 data-[state=active]:bg-black-100 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:shadow-sm hover:bg-black-50"
					>
						Off-Plan Properties
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>

		<!-- FILTERS TOGGLE BUTTON & SEARCH -->
		<div class="container mb-8">
			<div
				class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl p-4 shadow-sm w-full"
			>
				<!-- Enhanced Property Search -->
				<div class="w-full sm:w-2/3 relative" ref="searchContainerRef">
					<Popover v-model:open="searchOpen">
						<PopoverTrigger as-child>
							<div
								class="relative w-full"
								@click="handleSearchFocus"
							>
								<input
									ref="searchInputRef"
									v-model="searchInput"
									@input="handleSearchInput"
									@focus="handleSearchFocus"
									@blur="handleSearchBlur"
									@keydown="handleSearchKeydown"
									placeholder="Search properties, areas... (min 2 characters)"
									class="w-full rounded-lg px-4 py-3 border border-gray-200 text-sm bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm pr-20 focus:ring-2 focus:ring-black-500 focus:border-black-500 focus:outline-none"
									autocomplete="off"
									spellcheck="false"
								/>
								<!-- Clear button -->
								<button
									v-if="searchInput"
									@click.stop="clearSearch"
									class="absolute right-10 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
									type="button"
								>
									<X class="h-4 w-4" />
								</button>
								<!-- Search icon -->
								<Search
									class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
								/>
							</div>
						</PopoverTrigger>
						<PopoverContent
							class="w-full p-0 z-50 max-w-none"
							v-if="shouldShowSuggestions"
							align="start"
							:style="{
								width: searchContainerRef?.offsetWidth + 'px',
							}"
						>
							<Command
								class="bg-white border border-gray-200 rounded-lg shadow-lg"
							>
								<!-- Loading State -->
								<div
									v-if="isFetchingSuggestions"
									class="py-6 text-center"
								>
									<div
										class="animate-spin rounded-full h-6 w-6 border-t-2 border-black-600 border-r-2 mx-auto"
									></div>
									<p class="text-sm text-gray-500 mt-2">
										Searching...
									</p>
								</div>

								<!-- Error State -->
								<CommandEmpty
									v-else-if="searchError"
									class="py-4 px-4 text-center text-sm text-red-500"
								>
									<div
										class="flex items-center justify-center gap-2"
									>
										<span>⚠️</span>
										<span
											>Search failed. Please try
											again.</span
										>
									</div>
								</CommandEmpty>

								<!-- No Results -->
								<CommandEmpty
									v-else-if="
										!hasSearchResults &&
										!isFetchingSuggestions
									"
									class="py-4 px-4 text-center text-sm text-gray-500"
								>
									<div
										class="flex flex-col items-center gap-2"
									>
										<span>🔍</span>
										<span
											>No results found for "{{
												searchInput
											}}"</span
										>
										<button
											@click="handleSearchSubmit"
											class="text-black-600 hover:text-black-800 underline text-xs mt-1"
										>
											Search anyway
										</button>
									</div>
								</CommandEmpty>

								<!-- Results -->
								<CommandList
									v-else-if="hasSearchResults"
									class="max-h-80 overflow-auto"
								>
									<!-- Areas Section -->
									<CommandGroup
										v-if="sortedAreas.length"
										heading="📍 Areas"
										class="border-b border-gray-100 last:border-b-0"
									>
										<CommandItem
											v-for="area in sortedAreas.slice(
												0,
												5,
											)"
											:key="'area-' + area.id"
											:value="area.name"
											@select="
												handleSearchSelect(area.name)
											"
											class="cursor-pointer rounded-md px-3 py-2.5 text-sm hover:bg-black-50 hover:text-black-700 transition-colors flex items-center gap-2"
										>
											<Check
												:class="
													cn(
														'h-4 w-4 text-green-600',
														propertySearch ===
															area.name
															? 'opacity-100'
															: 'opacity-0',
													)
												"
											/>
											<span
												class="truncate font-medium"
												>{{ area.name }}</span
											>
											<span
												class="text-xs text-gray-500 ml-auto"
												>Area</span
											>
										</CommandItem>
									</CommandGroup>

									<!-- Properties Section -->
									<CommandGroup
										v-if="sortedProperties.length"
										heading="🏠 Properties"
									>
										<CommandItem
											v-for="property in sortedProperties.slice(
												0,
												5,
											)"
											:key="'property-' + property.id"
											:value="property.title"
											@select="
												handleSearchSelect(
													property.title,
												)
											"
											class="cursor-pointer rounded-md px-3 py-2.5 text-sm hover:bg-black-50 hover:text-black-700 transition-colors flex items-center gap-2"
										>
											<Check
												:class="
													cn(
														'h-4 w-4 text-green-600',
														propertySearch ===
															property.title
															? 'opacity-100'
															: 'opacity-0',
													)
												"
											/>
											<span
												class="notranslate truncate font-medium"
												translate="no"
												lang="en"
												:data-original="property.title"
												>{{ property.title }}</span
											>
											<span
												class="text-xs text-gray-500 ml-auto"
												>Property</span
											>
										</CommandItem>
									</CommandGroup>
								</CommandList>

								<!-- Search suggestion footer -->
								<div
									v-if="
										hasSearchResults &&
										!isFetchingSuggestions
									"
									class="border-t border-gray-100 p-2"
								>
									<button
										@click="handleSearchSubmit"
										class="w-full text-left px-3 py-2 text-sm text-black-600 hover:text-black-800 hover:bg-black-50 rounded-md transition-colors flex items-center gap-2"
									>
										<Search class="h-4 w-4" />
										<span
											>Search for "{{
												searchInput
											}}"</span
										>
									</button>
								</div>
							</Command>
						</PopoverContent>
					</Popover>
				</div>

				<!-- Filter Toggle & View Mode -->
				<div
					class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end"
				>
					<!-- View Mode Toggle -->
					<div class="flex gap-1 bg-gray-100 rounded-lg p-1">
						<button
							@click="viewMode = 'grid'"
							:class="[
								'p-2 rounded-md transition-colors',
								viewMode === 'grid'
									? 'bg-white text-black-600 shadow-sm'
									: 'text-gray-500 hover:text-black-600',
							]"
							title="Grid View"
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
						<button
							@click="viewMode = 'list'"
							:class="[
								'p-2 rounded-md transition-colors',
								viewMode === 'list'
									? 'bg-white text-black-600 shadow-sm'
									: 'text-gray-500 hover:text-black-600',
							]"
							title="List View"
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"
								/>
							</svg>
						</button>
					</div>
					<!-- Filter Toggle Button -->
					<Button
						@click="toggleFilters"
						class="flex items-center gap-2 px-4 py-2 bg-black-100 text-white rounded-lg hover:bg-black-700 transition-all duration-200 shadow-sm"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1m-17 4h16m-16 4h16m-16 4h16"
							/>
						</svg>
						<span>{{
							showFilters ? "Hide Filters" : "Show Filters"
						}}</span>
					</Button>
				</div>
			</div>
		</div>

		<!-- FILTERS -->
		<div
			v-if="showFilters"
			class="container bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300"
		>
			<div
				class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 mb-6"
			>
				<div>
					<h2 class="text-2xl font-semibold text-gray-800">
						Refine Your Search
					</h2>
					<p class="text-sm text-gray-500 mt-1">
						Tailor your search to find the perfect property.
					</p>
				</div>
				<Button
					@click="resetFilters"
					variant="ghost"
					class="text-sm text-black-600 hover:text-black-800 font-medium mt-4 sm:mt-0"
				>
					Clear All Filters
				</Button>
			</div>

			<div class="space-y-6">
				<!-- BASIC FILTERS -->
				<div
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
				>
					<!-- PROPERTY TYPE -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1"
							>Property Type</label
						>
						<Popover>
							<PopoverTrigger as-child>
								<Button
									variant="outline"
									class="w-full text-left"
								>
									<span>{{
										selectedPropertyTypes.length
											? `${selectedPropertyTypes.length} selected`
											: "Select Types"
									}}</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent
								class="w-full bg-white max-h-96 overflow-auto"
							>
								<Command>
									<CommandList>
										<CommandGroup heading="Property Types">
											<template
												v-for="type in propertyTypes?.filter(
													(t) =>
														t.slug !==
														'holiday-homes',
												)"
												:key="type.id"
											>
												<CommandItem
													@select="
														toggleTypeSelection(
															type.id,
														)
													"
													class="cursor-pointer"
												>
													<input
														type="checkbox"
														:checked="
															selectedPropertyTypes.includes(
																type.id,
															)
														"
														:indeterminate="
															isIndeterminate(
																type,
															)
														"
														class="mr-2"
													/>
													{{ type.name }}
												</CommandItem>
												<div
													v-if="type.children?.length"
													class="ml-4"
													v-for="child in type.children"
													:key="child.id"
												>
													<CommandItem
														@select="
															toggleTypeSelection(
																child.id,
															)
														"
														class="cursor-pointer"
													>
														<input
															type="checkbox"
															:checked="
																selectedPropertyTypes.includes(
																	child.id,
																)
															"
															class="mr-2"
														/>
														{{ child.name }}
													</CommandItem>
												</div>
											</template>
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					<!-- PURPOSE -->
					<div v-if="false">
						<label
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Purpose
						</label>
						<Select v-model="purpose">
							<SelectTrigger
								class="w-full bg-white border-gray-200 text-sm rounded-lg"
							>
								<SelectValue placeholder="All Purposes" />
							</SelectTrigger>
							<SelectContent
								class="bg-white roundedFORD-lg shadow-lg"
							>
								<SelectItem :value="null"
									>All Purposes</SelectItem
								>
								<SelectItem value="buy">Buy</SelectItem>
								<SelectItem value="rent">Rent</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<!-- BEDROOMS -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Bedrooms
						</label>
						<Select v-model="bedrooms">
							<SelectTrigger
								class="w-full bg-white border-gray-200 text-sm rounded-lg"
							>
								<SelectValue placeholder="Any" />
							</SelectTrigger>
							<SelectContent
								class="bg-white rounded-lg shadow-lg"
							>
								<SelectItem value="any">Any</SelectItem>
								<SelectItem value="studio">Studio</SelectItem>
								<SelectItem
									v-for="n in 8"
									:key="n"
									:value="n.toString()"
								>
									{{ n }}
								</SelectItem>
								<SelectItem value="8+">8+</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<!-- BATHROOMS -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Bathrooms
						</label>
						<Select v-model="bathrooms">
							<SelectTrigger
								class="w-full bg-white border-gray-200 text-sm rounded-lg"
							>
								<SelectValue placeholder="Any" />
							</SelectTrigger>
							<SelectContent
								class="bg-white rounded-lg shadow-lg"
							>
								<SelectItem value="any">Any</SelectItem>
								<SelectItem
									v-for="n in 6"
									:key="n"
									:value="n.toString()"
								>
									{{ n }}
								</SelectItem>
								<SelectItem value="6+">6+</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<!-- PRICE RANGE -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">
						Price Range (AED)
					</label>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<input
							v-model="minPrice"
							type="number"
							min="0"
							placeholder="Min Price"
							class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black-500 focus:border-black-500 transition bg-white text-sm placeholder-gray-400"
						/>
						<input
							v-model="maxPrice"
							type="number"
							min="0"
							placeholder="Max Price"
							class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black-500 focus:border-black-500 transition bg-white text-sm placeholder-gray-400"
						/>
					</div>
				</div>

				<!-- ADVANCED FILTERS -->
				<div>
					<Button
						@click="showAdvancedFilters = !showAdvancedFilters"
						variant="ghost"
						class="flex items-center gap-2 text-black-600 text-sm font-medium sm:hidden"
					>
						{{ showAdvancedFilters ? "Hide" : "Show" }} Advanced
						Filters
						<svg
							class="w-4 h-4 transition-transform"
							:class="{ 'rotate-180': showAdvancedFilters }"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</Button>

					<div
						:class="[
							'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4',
							{ 'hidden sm:grid': !showAdvancedFilters },
						]"
					>
						<!-- MAID ROOM -->
						<div>
							<label
								class="block text-sm font-medium text-gray-700 mb-1"
							>
								Maid Room
							</label>
							<Select v-model="maidRoom">
								<SelectTrigger
									class="w-full bg-white border-gray-200 text-sm rounded-lg"
								>
									<SelectValue placeholder="Any" />
								</SelectTrigger>
								<SelectContent
									class="bg-white rounded-lg shadow-lg"
								>
									<SelectItem :value="null">Any</SelectItem>
									<SelectItem :value="true">Yes</SelectItem>
									<SelectItem :value="false">No</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<!-- SIZE RANGE -->
						<div class="sm:col-span-2">
							<label
								class="block text-sm font-medium text-gray-700 mb-1"
							>
								Size (sqft)
							</label>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<input
									v-model="minSize"
									type="number"
									min="0"
									placeholder="Min Size"
									class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black-500 focus:border-black-500 transition bg-white text-sm placeholder-gray-400"
								/>
								<input
									v-model="maxSize"
									type="number"
									min="0"
									placeholder="Max Size"
									class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black-500 focus:border-black-500 transition bg-white text-sm placeholder-gray-400"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- PROPERTIES -->
		<div class="container py-6 space-y-8">
			<div
				v-if="properties.length > 0"
				class="flex justify-between items-center"
			>
				<h3
					v-if="getLocationName"
					class="text-lg font-semibold"
					style="color:#C9A028;"
				>
					{{ properties?.length ?? 0 }} Properties Found in
					{{ getLocationName }}
				</h3>

				<h3 v-else class="text-lg font-semibold" style="color:#C9A028;">
					{{ properties?.length ?? 0 }} Properties Found
				</h3>
			</div>

			<!-- PROPERTY CAROUSEL -->
			<PropertyCarousel
				v-if="properties.length > 0"
				:watchItems="properties"
				:autoPlay="true"
				:interval="1500"
			>
				<div
					v-for="property in properties"
					:key="property.id"
					class="flex-none w-full sm:w-1/2 lg:w-1/3 px-3"
				>
					<router-link
						:to="`/property/${property.slug}`"
						class="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
						style="background:#1a1a1a; box-shadow:0 4px 24px rgba(0,0,0,0.45);"
					>
						<!-- Image -->
						<div class="relative overflow-hidden" style="height:215px;">
							<img
								:src="primaryImage(property)"
								:alt="property.title"
								loading="lazy"
								class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none"></div>

							<!-- Handover badge -->
							<div
								v-if="property.handover_date"
								class="absolute top-3 left-3 flex items-center gap-1 bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full"
							>
								<svg class="w-3 h-3 shrink-0" style="color:#C9A028;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
								</svg>
								{{ property.handover_date }}
							</div>

							<!-- Featured badge -->
							<div
								v-if="property.is_featured == 1"
								class="absolute top-3 right-3 text-black text-[11px] font-bold px-2.5 py-1 rounded-full"
								style="background:#C9A028;"
							>
								Featured
							</div>
						</div>

						<!-- Info -->
						<div class="p-4 space-y-2.5">
							<h3
								class="notranslate font-bold text-base line-clamp-1 leading-snug"
								style="color:#ffffff;"
								translate="no"
								lang="en"
								:data-original="property.title"
							>
								{{ property.title }}
							</h3>

							<!-- Location + Developer -->
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

							<!-- Beds / Baths / Size (for ready properties) -->
							<div
								v-if="property.completion_status !== 'off_plan' && property.property_type?.slug !== 'holiday-homes'"
								class="flex items-center gap-3 text-xs"
								style="color:#888888;"
							>
								<span v-if="property.bedrooms" class="flex items-center gap-1">
									<svg class="w-3 h-3" style="color:#C9A028;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
									</svg>
									{{ property.bedrooms }} Bed
								</span>
								<span v-if="property.bathrooms" class="flex items-center gap-1">
									<svg class="w-3 h-3" style="color:#C9A028;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
									</svg>
									{{ property.bathrooms }} Bath
								</span>
								<span v-if="property.size_sqft" class="flex items-center gap-1">
									{{ property.size_sqft }} sqft
								</span>
							</div>

							<div style="border-top:1px solid rgba(255,255,255,0.08);"></div>

							<!-- Price + CTA -->
							<div class="flex items-center justify-between">
								<span class="font-bold text-sm leading-none" style="color:#C9A028;">
									{{ getPropertyTypePrice(property) }}
								</span>
								<span
									class="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all duration-300 group-hover:scale-105"
									style="background:#C9A028; color:#0A0A0A;"
								>
									Visit →
								</span>
							</div>
						</div>
					</router-link>
				</div>
			</PropertyCarousel>

			<!-- EMPTY STATE -->
			<div
				v-else-if="!isFetching"
				class="rounded-2xl text-center py-12 px-6"
				style="background:#1a1a1a;"
			>
				<p class="text-base" style="color:#aaaaaa;">
					No properties found. Try adjusting your filters!
				</p>
				<button
					@click="resetFilters"
					class="mt-6 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200"
					style="background:#C9A028; color:#0A0A0A;"
				>
					Reset Filters
				</button>
			</div>

			<!-- LOADING -->
			<div v-if="isFetching" class="text-center py-12">
				<div
					class="animate-spin rounded-full h-10 w-10 border-t-2 border-black-600 border-r-2 mx-auto"
				></div>
				<p class="text-gray-600 mt-4 text-base">
					Loading properties...
				</p>
			</div>

			<!-- PAGINATION -->
			<div
				v-if="totalPages > 1 && properties.length > 0"
				class="flex justify-center items-center gap-2 flex-wrap"
			>
				<button
					v-for="page in totalPages"
					:key="page"
					@click="goToPage(page)"
					:style="page === currentPage
						? 'background:#C9A028; color:#0A0A0A;'
						: 'background:#1a1a1a; color:#aaaaaa; border:1px solid rgba(201,160,40,0.25);'"
					class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 hover:border-[#C9A028]"
				>
					{{ page }}
				</button>
			</div>
		</div>
	</section>
</template>

<style scoped>
/* Modern Font Stack */
:root {
	--font-sans:
		"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
		Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* Container */
.container {
	@apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Typography */
body {
	font-family: var(--font-sans);
}

/* Animations */
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}

/* Badges */
.badge {
	@apply text-xs font-medium px-2.5 py-1 rounded-full shadow-sm;
}

/* Smooth Scroll */
html {
	scroll-behavior: smooth;
}

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

/* Hover Effects */
.group:hover .group-hover:scale-105 {
	transform: scale(1.05);
}

/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

input[type="number"] {
	-moz-appearance: textfield;
}

/* Enhanced Command Styles */
:deep(.command) {
	@apply bg-white rounded-lg shadow-lg;
}

:deep(.command-group) {
	@apply py-2;
}

:popover-content {
	width: 100% !important;
	max-width: 100% !important;
	background-color: white !important;
}

:deep(.command-group-heading) {
	@apply px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide;
}

:deep(.command-item) {
	@apply flex items-center w-full px-4 py-2 text-sm cursor-pointer transition-colors;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
	.filters-grid {
		@apply grid-cols-1;
	}
}
</style>
