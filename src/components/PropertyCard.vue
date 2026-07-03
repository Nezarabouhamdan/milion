<template>
	<router-link :to="`/property/${property.slug}`" class="group block">
		<div
			:class="[
				'bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-400',
				viewMode === 'grid'
					? 'hover:shadow-xl hover:-translate-y-1.5'
					: 'flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 hover:border-[#C9A028]/40 hover:shadow-md',
			]"
		>
			<!-- Image -->
			<div
				:class="
					viewMode === 'grid'
						? 'relative h-60 overflow-hidden'
						: 'relative w-full sm:w-1/3 h-48 sm:h-44 rounded-lg overflow-hidden'
				"
			>
				<img
					:src="primaryImage(property)"
					:alt="property.title"
					class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
				></div>
				<div
					class="absolute top-3 left-3 flex flex-col gap-2 z-10 bg-black-100 text-white rounded-full"
				>
					<span
						v-if="property.is_featured == 1"
						class="badge bg-[#C9A028] text-black text-xs font-semibold px-2.5 py-1 rounded-full"
					>
						Featured
					</span>
				</div>
			</div>

			<!-- Info -->
			<!-- Info -->
			<div
				:class="
					viewMode === 'grid'
						? 'p-5 space-y-3'
						: 'flex-1 p-3 space-y-3'
				"
			>
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

				<!-- Conditional Details -->
				<div
					class="flex flex-wrap gap-4 text-sm text-gray-600 items-center"
				>
					<!-- Holiday Homes -->
					<template
						v-if="property.property_type?.slug === 'holiday-homes'"
					>
						<span class="flex items-center gap-1">
							<BedDouble class="w-4 h-4 text-black-600" />
							{{ property.bedrooms }} Bedroom
						</span>
						<span class="flex items-center gap-1">
							<Bath class="w-4 h-4 text-black-600" />
							{{ property.bathrooms }} Bath
						</span>
						<span class="flex items-center gap-1">
							<Ruler class="w-4 h-4 text-black-600" />
							Min {{ property.min_days }} Nights
						</span>
						<span class="flex items-center gap-1">
							Guests: {{ property.no_of_guests }}
						</span>
					</template>

					<!-- Off Plan -->
					<template
						v-else-if="property.completion_status === 'off_plan'"
					>
						<span class="flex items-center gap-1">
							<Calendar class="w-4 h-4 text-black-600" />
							{{ property.handover_date }}
						</span>

						<span class="flex items-center gap-1">
							<Forklift class="w-4 h-4 text-black-600" />
							<span
								class="notranslate"
								translate="no"
								lang="en"
								:data-original="property.developer_name"
							>{{ property.developer_name }}</span>
						</span>
					</template>

					<!-- Buy or Rent -->
					<template v-else>
						<!-- Not Commercial: show bed/bath -->
						<template
							v-if="
								property.property_type_main_slug !==
								'commercial'
							"
						>
							<span class="flex items-center gap-1">
								<BedDouble class="w-4 h-4 text-black-600" />
								{{ property.bedrooms }}
							</span>
							<span class="flex items-center gap-1">
								<Bath class="w-4 h-4 text-black-600" />
								{{ property.bathrooms }}
							</span>
						</template>

						<!-- Size (Always Show) -->
						<span class="flex items-center gap-1">
							<Ruler class="w-4 h-4 text-black-600" />
							{{ property.size_sqft }} sqft
						</span>
					</template>
				</div>

				<!-- Price -->
				<div class="flex justify-between items-center">
					<span
						class="font-bold text-lg sm:text-xl"
						style="color: #C9A028;"
					>
						<template
							v-if="property.completion_status === 'off_plan'"
						>
							From AED
							{{ Number(property.price).toLocaleString() }}
						</template>
						<template v-else>
							AED {{ Number(property.price).toLocaleString() }}
							<span
								v-if="property.purpose === 'rent'"
								class="text-sm font-normal text-gray-500"
							>
								/ year
							</span>
							<span
								v-else-if="
									property.property_type?.slug ===
									'holiday-homes'
								"
								class="text-sm font-normal text-gray-500"
							>
								/ night
							</span>
						</template>
					</span>

					<span
						class="text-[#C9A028] text-sm font-medium flex items-center gap-1 transition-all duration-300 group-hover:gap-2"
					>
						Visit
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</span>
				</div>
			</div>
		</div>
	</router-link>
</template>

<script setup>
import { Button } from "../components/ui/button";
import {
	Check,
	ChevronsUpDown,
	Search,
	BedDouble,
	Bath,
	Ruler,
	Calendar,
	Forklift,
} from "lucide-vue-next";

defineProps({
	property: Object,
	viewMode: String,
	primaryImage: Function,
});
</script>
