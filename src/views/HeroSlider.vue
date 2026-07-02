<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { imagePath } from "../utils/helpers";
import IconArrowUpRight from "../components/icons/IconArrowUpRight.vue";
import { useSlidersQuery } from "../composables/useSlidersQuery";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import SliderSkeleton from "../components/common/SliderSkeleton.vue";

const sliderRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(sliderRef);

const { data: slides, isLoading, refetch, isError } = useSlidersQuery(false);

// Auto-scrolling configuration
const autoScrollEnabled = ref(true);
const autoScrollInterval = ref(5000); // 5 seconds default interval
let autoScrollTimer: number | null = null;

watch(isVisible, (visible) => {
	if (visible) {
		refetch();
		if (autoScrollEnabled.value && slides.value?.length > 1) {
			startAutoScroll();
		}
	} else {
		stopAutoScroll();
	}
});

const currentSlide = ref(0);
const isVideoPlaying = ref(false);

const hasSlides = computed(() => slides.value && slides.value.length > 0);

const currentSlideData = computed(
	() => slides.value?.[currentSlide.value] ?? null,
);

const isVideoSlide = computed(() => currentSlideData.value?.type === "video");

const goToSlide = (index: number) => {
	isVideoPlaying.value = false;
	currentSlide.value = index;
	if (autoScrollEnabled.value) {
		stopAutoScroll();
		startAutoScroll();
	}
};

const nextSlide = () => {
	if (!slides.value) return;
	goToSlide((currentSlide.value + 1) % slides.value.length);
};

const prevSlide = () => {
	if (!slides.value) return;
	goToSlide(
		(currentSlide.value - 1 + slides.value.length) % slides.value.length,
	);
};

const playVideo = () => {
	if (isVideoSlide.value) isVideoPlaying.value = true;
};

const startAutoScroll = () => {
	if (autoScrollTimer) clearInterval(autoScrollTimer);
	autoScrollTimer = setInterval(() => {
		if (!isVideoPlaying.value) nextSlide();
	}, autoScrollInterval.value);
};

const stopAutoScroll = () => {
	if (autoScrollTimer) {
		clearInterval(autoScrollTimer);
		autoScrollTimer = null;
	}
};

const toggleAutoScroll = () => {
	autoScrollEnabled.value = !autoScrollEnabled.value;
	if (autoScrollEnabled.value && slides.value?.length > 1) {
		startAutoScroll();
	} else {
		stopAutoScroll();
	}
};

// Cleanup on component unmount
onUnmounted(() => {
	stopAutoScroll();
});

onMounted(() => {
	if (autoScrollEnabled.value && slides.value?.length > 1) {
		startAutoScroll();
	}
});
</script>

<template>
	<div
		ref="sliderRef"
		class="relative h-[80vh] sm:h-[85vh] md:h-[90vh] overflow-hidden shadow-2xl"
	>
		<SliderSkeleton v-if="isLoading" />

		<div
			v-else-if="isError"
			class="flex h-full items-center justify-center bg-gray-100"
		>
			<div class="text-center p-8">
				<h3 class="text-lg font-semibold text-red-500 mb-2">
					Failed to load content
				</h3>
				<button
					@click="refetch"
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
				>
					Try Again
				</button>
			</div>
		</div>

		<!-- Slider -->
		<div v-else-if="hasSlides" class="h-full">
			<transition-group name="fade" tag="div" class="h-full relative">
				<div
					v-for="(slide, index) in slides"
					:key="slide.id"
					v-show="currentSlide === index"
					class="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
				>
					<!-- VIDEO -->
					<div v-if="slide.type === 'video'" class="h-full w-full">
						<video
							:src="imagePath(slide.video?.url)"
							class="absolute inset-0 w-full h-full object-cover"
							autoplay
							loop
							playsinline
							muted
						></video>

						<!-- Text content on video -->
						<div
							class="absolute inset-0 flex items-center justify-center bg-black-100/30 text-white text-center px-4"
						>
							<div class="max-w-2xl">
								<h1
									v-if="slide.title"
									class="text-3xl sm:text-4xl md:text-6xl mb-8 leading-tight font-semibold text-white"
								>
									{{ slide.title }}
								</h1>
								<div class="flex gap-4 justify-center">
									<router-link
										to="/properties"
										class="inline-flex gap-1.5 items-center text-base sm:text-lg font-medium border border-secondary text-secondary hover:bg-secondary hover:text-black-100 rounded-lg py-3 sm:py-4 px-5 sm:px-6 transition"
									>
										Buy a Property
										<IconArrowUpRight />
									</router-link>
									<router-link
										to="/sell"
										class="inline-flex gap-1.5 items-center text-base sm:text-lg font-medium border border-white/70 text-white hover:bg-white hover:text-black-100 rounded-lg py-3 sm:py-4 px-5 sm:px-6 transition"
									>
										Sell a Property
										<IconArrowUpRight />
									</router-link>
								</div>
							</div>
						</div>
					</div>

					<!-- IMAGE -->
					<div
						v-else
						class="bg-no-repeat bg-cover bg-center h-full w-full"
						:style="`background-image: url('${imagePath(slide.image?.url || '')}')`"
					>
						<div
							class="bg-black-100/30 flex justify-center items-center h-full w-full"
						>
							<div class="container">
								<div class="max-w-2xl">
									<h3
										class="inline-flex text-xs sm:text-sm mb-6 py-1.5 px-3 text-white font-medium rounded-lg border border-white/30 bg-black/50 backdrop-blur-sm"
									>
										{{ slide.sub_title }}
									</h3>
									<h1
										class="text-3xl sm:text-4xl md:text-6xl text-white mb-8 leading-tight font-semibold"
									>
										{{ slide.title?.split(" ")[0] }}
										<span class="text-secondary">{{
											slide.title
												?.split(" ")
												.slice(1)
												.join(" ")
										}}</span>
									</h1>
									<p
										class="mb-10 text-base sm:text-xl text-white font-normal max-w-lg"
									>
										{{ slide.description }}
									</p>
									<a
										:href="slide.url"
										target="_blank"
										class="flex gap-1.5 items-center text-base sm:text-lg font-medium w-2/4 bg-white hover:bg-black-100 hover:cursor-pointer hover:text-white rounded-lg py-3 sm:py-4 px-5 sm:px-6 transition shadow-lg"
									>
										{{ slide.link_title }}
										<IconArrowUpRight />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition-group>
		</div>

		<!-- NAVIGATION -->
		<div class="absolute top-1/2 left-4 -translate-y-1/2 z-20">
			<button
				v-if="slides && slides.length > 1"
				@click="prevSlide"
				class="bg-black/50 hover:bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
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
		</div>
		<div class="absolute top-1/2 right-4 -translate-y-1/2 z-20">
			<button
				v-if="slides && slides.length > 1"
				@click="nextSlide"
				class="bg-black/50 hover:bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
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
		</div>

		<!-- Auto-scroll toggle -->
		<div class="absolute top-4 left-4 z-20">
			<button
				v-if="slides && slides.length > 1"
				@click="toggleAutoScroll"
				class="bg-black/50 hover:bg-primary text-white p-2 rounded-full shadow-lg"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						:d="
							autoScrollEnabled
								? 'M6 6h4v12H6zm8 0h4v12h-4z'
								: 'M8 5v14l11-7z'
						"
					/>
				</svg>
			</button>
		</div>

		<!-- Close video -->
		<div
			v-if="isVideoPlaying && isVideoSlide"
			class="absolute top-4 right-4 z-20"
		>
			<button
				@click="isVideoPlaying = false"
				class="bg-black/70 hover:bg-red-500 text-white p-2 rounded-full shadow-lg"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<!-- Indicators -->
		<div
			v-if="hasSlides && (!isVideoPlaying || !isVideoSlide)"
			class="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10"
		>
			<button
				v-for="(slide, index) in slides"
				:key="index"
				@click="goToSlide(index)"
				:class="[
					'w-3 h-3 rounded-full transition duration-300',
					currentSlide === index
						? 'bg-secondary w-8'
						: 'bg-white opacity-50 hover:opacity-80',
				]"
			></button>
		</div>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

::v-deep .w-full iframe {
	width: 100% !important;
	height: 100% !important;
}

@media (max-width: 640px) {
	.bg-cover {
		background-position: center center;
	}
}
</style>
