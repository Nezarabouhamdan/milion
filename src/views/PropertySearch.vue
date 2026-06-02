<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAreaQuery } from "../composables/useAreaQuery";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { usePropertyTypeQuery } from "../composables/usePropertyTypeQuery";
import { useRouter } from "vue-router";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";

const router = useRouter();

const propertySearchRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(propertySearchRef);

const { data: propertyTypes } = usePropertyTypeQuery();
const selectedPropertyType = ref<string | null>(null);
const location = ref<string | null>(null);
const minPrice = ref("");
const maxPrice = ref("");
const purpose = ref("any");
const propertyCategory = ref<"all" | "commercial" | "residential" | "off_plan">(
	"all",
);

// Computed property to determine if purpose should be disabled
const isPurposeDisabled = computed(() => propertyCategory.value === "off_plan");

// Fetch areas based on selected property type and category
const { data: areas } = useAreaQuery({
	property_type: computed(() => {
		if (propertyCategory.value === "commercial") return "1";
		if (propertyCategory.value === "residential") return "2";
		if (propertyCategory.value === "off_plan") return "28";
		return selectedPropertyType.value;
	}),
});

// Validation errors
const priceError = ref("");

const validatePrices = (): boolean => {
	const min = parseFloat(minPrice.value);
	const max = parseFloat(maxPrice.value);
	priceError.value = "";

	if ((minPrice.value && min < 0) || (maxPrice.value && max < 0)) {
		priceError.value = "Prices must be positive numbers.";
		return false;
	}
	if (minPrice.value && maxPrice.value && max < min) {
		priceError.value =
			"Max price must be greater than or equal to Min price.";
		return false;
	}
	return true;
};

const applyFilters = () => {
	if (!validatePrices()) return;

	const query: Record<string, string | null | undefined> = {
		property_type: null,
		search: location.value || null,
		minPrice: minPrice.value || null,
		maxPrice: maxPrice.value || null,
		purpose: purpose.value === "any" ? "any" : purpose.value, // Ensure "any" maps to null
		completion_status: null,
	};

	if (propertyCategory.value === "all") {
		query.property_type = selectedPropertyType.value;
	} else if (propertyCategory.value === "commercial") {
		query.property_type = "1";
		query.completion_status = "ready";
	} else if (propertyCategory.value === "residential") {
		query.property_type = "2";
		query.completion_status = "ready";
	} else if (propertyCategory.value === "off_plan") {
		query.property_type = "28";
		query.completion_status = "off_plan";
		query.purpose = "buy"; // Only set purpose to "buy" for off_plan
	}

	router.push({
		path: "/properties",
		query,
	});
};

// Watch for category or property type changes to reset filters and set purpose
watch([propertyCategory, selectedPropertyType], () => {
	if (propertyCategory.value === "off_plan") {
		purpose.value = "buy";
	} else {
		purpose.value = "any";
	}
	location.value = null;
	minPrice.value = "";
	maxPrice.value = "";
	if (propertyCategory.value !== "all") {
		selectedPropertyType.value = null;
	}
});

// Filter purpose options based on property type
const availablePurposes = computed(() => {
	if (propertyCategory.value === "off_plan") {
		return [{ value: "buy", label: "Buy" }];
	}
	if (
		propertyCategory.value === "commercial" ||
		propertyCategory.value === "residential"
	) {
		return [
			{ value: "any", label: "Any" },
			{ value: "buy", label: "Buy" },
			{ value: "rent", label: "Rent" },
		];
	}
	return [
		{ value: "any", label: "Any" },
		{ value: "buy", label: "Buy" },
		{ value: "rent", label: "Rent" },
	];
});

// Property category options
const propertyCategories = [
	{ value: "all", label: "All Types" },
	{ value: "commercial", label: "Commercial" },
	{ value: "residential", label: "Residential" },
	{ value: "off_plan", label: "Off Plan" },
];
</script>

<template>
	<div
		ref="propertySearchRef"
		class="relative z-20 max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-12" style="background-color:#1a1a1a;"
		:class="{
			'scale-100 opacity-100': isVisible,
			'scale-95 opacity-0': !isVisible,
		}"
	>
		<h3
			class="text-2xl md:text-3xl font-bold mb-8 tracking-tight" style="color:#D4AF37;"
		>
			Discover Your Perfect Property
		</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
			<!-- Property Category -->
			<div class="space-y-2">
				<label class="text-sm font-medium text-gray-700"
					>Property Type</label
				>
				<Select v-model="propertyCategory">
					<SelectTrigger
						class="w-full bg-white border border-gray-200 rounded-lg h-11"
					>
						<SelectValue placeholder="Select Category" />
					</SelectTrigger>
					<SelectContent
						class="max-h-64 bg-white rounded-lg shadow-lg"
					>
						<SelectItem
							v-for="category in propertyCategories"
							:key="category.value"
							:value="category.value"
						>
							{{ category.label }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Property Type -->
			<div v-if="false" class="space-y-2">
				<label class="text-sm font-medium text-gray-700"
					>Property Type</label
				>
				<Select
					v-model="selectedPropertyType"
					:disabled="propertyCategory !== 'all'"
					:model-value="
						propertyCategory !== 'all'
							? propertyCategory.charAt(0).toUpperCase() +
								propertyCategory.slice(1)
							: null
					"
				>
					<SelectTrigger
						class="w-full bg-white border border-gray-200 rounded-lg h-11"
						:class="{
							'bg-gray-100 opacity-75':
								propertyCategory !== 'all',
						}"
					>
						<SelectValue
							:placeholder="
								propertyCategory !== 'all'
									? propertyCategory.charAt(0).toUpperCase() +
										propertyCategory.slice(1)
									: 'Select Type'
							"
						/>
					</SelectTrigger>
					<SelectContent
						class="max-h-64 bg-white rounded-lg shadow-lg"
					>
						<SelectItem :value="null">All Types</SelectItem>
						<SelectItem
							v-for="type in propertyTypes?.filter(
								(x) => x.slug !== 'holiday-homes',
							)"
							:key="type.id"
							:value="type.id.toString()"
						>
							{{ type.name }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Location -->
			<div class="space-y-2">
				<label class="text-sm font-medium text-gray-700"
					>Location</label
				>
				<Select v-model="location">
					<SelectTrigger
						class="w-full bg-white border border-gray-200 rounded-lg h-11"
					>
						<SelectValue placeholder="Select Location" />
					</SelectTrigger>
					<SelectContent
						class="max-h-64 bg-white rounded-lg shadow-lg"
					>
						<SelectItem :value="null">All Locations</SelectItem>
						<SelectItem
							v-for="area in areas?.sort((a, b) =>
								a.name.localeCompare(b.name),
							)"
							:key="area.id"
							:value="area.name"
						>
							{{ area.name }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Price Range -->
			<div class="space-y-2">
				<label class="text-sm font-medium text-gray-700"
					>Price Range</label
				>
				<div class="grid grid-cols-2 gap-3">
					<input
						v-model="minPrice"
						type="number"
						placeholder="Min Price"
						min="0"
						class="form-field h-11"
					/>
					<input
						v-model="maxPrice"
						type="number"
						placeholder="Max Price"
						min="0"
						class="form-field h-11"
					/>
				</div>
				<p v-if="priceError" class="text-red-500 text-xs mt-1">
					{{ priceError }}
				</p>
			</div>

			<!-- Purpose -->
			<div class="space-y-2">
				<label class="text-sm font-medium text-gray-700">Purpose</label>
				<Select v-model="purpose" :disabled="isPurposeDisabled">
					<SelectTrigger
						class="w-full bg-white border border-gray-200 rounded-lg h-11"
					>
						<SelectValue placeholder="Select Purpose" />
					</SelectTrigger>
					<SelectContent class="bg-white rounded-lg shadow-lg">
						<SelectItem
							v-for="option in availablePurposes"
							:key="option.value"
							:value="option.value"
						>
							{{ option.label }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Search Button -->
			<div class="flex items-end">
				<button
					@click="applyFilters"
					class="w-full bg-black-100 text-white font-semibold rounded-lg px-6 py-3 h-11 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:bg-white hover:text-black-100 transform hover:scale-105 transition-all duration-200"
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
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					Search
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.form-field {
	@apply w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-gray-200 focus:outline-none transition-all duration-200 bg-white;
}

.form-field:disabled {
	@apply bg-gray-100 opacity-75 cursor-not-allowed;
}

.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.no-spinner {
	-moz-appearance: textfield;
}

/* Custom hover and focus effects for select dropdowns */
select:focus,
select:hover {
	@apply border-primary ring-2 ring-gray-200;
}

/* Enhance disabled state for select and inputs */
select:disabled,
input:disabled {
	@apply bg-gray-100 text-gray-500 cursor-not-allowed;
}
</style>
