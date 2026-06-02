<script setup lang="ts">
import { ref, watch } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import IconQuote from "../components/icons/IconQuote.vue";
import IconStar from "../components/icons/IconStar.vue";
import { useTestimonialsQuery } from "../composables/useTestimonialsQuery";
import { imagePath } from "../utils/helpers";

const testimonialRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(testimonialRef);

const { data, isLoading, isError, refetch } = useTestimonialsQuery(isVisible);

const testimonials = ref([]);

watch(data, (val) => {
	if (val) {
		testimonials.value = val.map((item) => ({
			...item,
		}));
	}
});

const activeIndex = ref(0);

const next = () => {
	activeIndex.value = (activeIndex.value + 1) % testimonials.value.length;
};

const prev = () => {
	activeIndex.value =
		(activeIndex.value - 1 + testimonials.value.length) %
		testimonials.value.length;
};

const setActive = (index: number) => {
	activeIndex.value = index;
};
</script>

<template>
	<section ref="testimonialRef" class="container py-24">
		<div class="text-center mb-12 max-w-2xl mx-auto space-y-4">
			<span class="text-secondary font-medium uppercase tracking-wide"
				>Client Testimonials</span
			>
			<h2 class="text-4xl font-bold" style="color:#D4AF37;">What Our Clients Say</h2>
			<p class="text-body text-base">
				Hear from our valued clients about their exceptional experiences
				with us.
			</p>
		</div>

		<!-- Loading -->
		<div
			v-if="isLoading"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
		>
			<div
				v-for="i in 3"
				:key="i"
				class="animate-pulse space-y-4 bg-gray-50 rounded-xl p-6"
			>
				<div class="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
				<div class="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
				<div class="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
				<div class="h-4 bg-gray-200 rounded"></div>
				<div class="h-4 bg-gray-200 rounded"></div>
				<div class="h-3 bg-gray-200 rounded"></div>
			</div>
		</div>

		<!-- Error -->
		<div v-else-if="isError" class="text-center text-red-500">
			Failed to load testimonials.
			<button @click="refetch" class="underline">Retry</button>
		</div>

		<!-- Carousel -->
		<div v-else-if="testimonials.length" class="relative max-w-5xl mx-auto">
			<div class="overflow-hidden rounded-xl">
				<div
					class="flex transition-transform duration-700 ease-in-out"
					:style="`transform: translateX(-${activeIndex * 100}%);`"
				>
					<div
						v-for="testimonial in testimonials"
						:key="testimonial.id"
						class="w-full flex-shrink-0 px-4"
					>
						<div
							class="bg-white text-dark rounded-xl shadow-md p-8 md:p-10 space-y-6"
						>
							<div class="flex justify-between items-start gap-6">
								<div class="flex gap-4 items-center">
									<img
										:src="imagePath(testimonial.image?.url)"
										class="w-16 h-16 rounded-full object-cover border border-gray-200"
										:alt="testimonial.name"
									/>
									<div>
										<h4 class="font-semibold text-lg">
											{{ testimonial.name }}
										</h4>
										<p class="text-sm text-gray-500">
											{{ testimonial.position }}
										</p>
									</div>
								</div>
								<IconQuote class="text-primary/10 w-10 h-10" />
							</div>
							<div class="flex gap-1">
								<svg
									v-for="i in parseInt(testimonial.rating)"
									:key="i"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="#fddc4a"
										d="m8.243 7.34l-6.38.925l-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499l-1.09 6.355l-.013.11a1 1 0 0 0 1.464.944l5.706-3l5.693 3l.1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355l4.624-4.5l.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926l-2.852-5.78a1 1 0 0 0-1.794 0z"
									/>
								</svg>
							</div>
							<p
								class="text-base leading-relaxed"
								v-html="testimonial.testimonial"
							></p>
						</div>
					</div>
				</div>
			</div>

			<!-- Arrows: Only show if more than one testimonial -->
			<template v-if="testimonials.length > 1">
				<!-- Prev Button -->
				<button
					@click="prev"
					class="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-black-100 text-primary hover:text-white p-3 rounded-full shadow transition inline-flex"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<!-- Next Button -->
				<button
					@click="next"
					class="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-black-100 text-primary hover:text-white p-3 rounded-full shadow transition inline-flex"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</template>
		</div>

		<!-- Indicators -->
		<div v-if="testimonials.length" class="flex justify-center mt-8 gap-3">
			<button
				v-for="(_, index) in testimonials"
				:key="index"
				@click="setActive(index)"
				:class="[
					'w-3 h-3 rounded-full transition-all',
					activeIndex === index ? 'bg-secondary w-8' : 'bg-gray-300',
				]"
			></button>
		</div>
	</section>
</template>
