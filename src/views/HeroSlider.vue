<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { imagePath } from "../utils/helpers";

const bgUrl = (url?: string) => !url ? "" : url.startsWith("http") ? url : imagePath(url);
import IconArrowUpRight from "../components/icons/IconArrowUpRight.vue";
import { useSlidersQuery } from "../composables/useSlidersQuery";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import SliderSkeleton from "../components/common/SliderSkeleton.vue";

const sliderRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(sliderRef);

const { data: apiSlides, isLoading, refetch, isError } = useSlidersQuery(false);

// ── TEST SLIDES — remove once real slides are added in the admin panel ──────
const STORAGE = "https://millionhomes.ae/api/storage/app/public";
const TEST_SLIDES = [
    {
        id: "test-1",
        order: 97,
        type: "image",
        title: "Palm Central By Nakheel",
        sub_title: "AED 2.7M",
        description: "Ultra-luxury waterfront residences on Palm Jebel Ali with panoramic sea views, private beach access and resort-style amenities.",
        link_title: "DISCOVER MORE",
        url: "/palm-central",
        link_url: "20 / 50 / 30",
        image: { url: `${STORAGE}/assets/TAVD7DSLHQ2IKeY3l4AFKFLLgdlsCgOt4UQA4Dzr.webp` },
    },
    {
        id: "test-2",
        order: 98,
        type: "image",
        title: "Tilal Binghatti",
        sub_title: "AED 4.2M",
        description: "Binghatti's first master-planned villa community in Dubailand. Resort-style lagoon, 50+ amenities, and premium villas & townhouses.",
        link_title: "DISCOVER MORE",
        url: "/property/Tilal-Binghatti",
        link_url: "60 / 40",
        image: { url: `${STORAGE}/assets/ufwccoKO7GcVzvtKMrPeSmfGy3YEV3GIK311R0O4.jpg` },
    },
    {
        id: "test-3",
        order: 99,
        type: "image",
        title: "Greenz by Danube",
        sub_title: "AED 3.5M",
        description: "Gated community of premium townhouses & villas in Academic City. Resort-style pools, jogging tracks and lush green landscapes.",
        link_title: "DISCOVER MORE",
        url: "/property/greenz",
        link_url: "50 / 50",
        image: { url: `${STORAGE}/assets/a3Ar04jmoTxWvxii2bIbZJV4rx1BRHfUfmarKKbR.webp` },
    },
];

const slides = computed(() => [...(apiSlides.value ?? []).filter(s => s.type !== "video"), ...TEST_SLIDES]);
// ────────────────────────────────────────────────────────────────────────────

const autoScrollEnabled = ref(true);
const autoScrollInterval = ref(5000);
let autoScrollTimer: number | null = null;

watch(isVisible, (visible) => {
	if (visible) {
		refetch();
		if (autoScrollEnabled.value && slides.value?.length > 1) startAutoScroll();
	} else {
		stopAutoScroll();
	}
});

const currentSlide = ref(0);

const hasSlides = computed(() => slides.value && slides.value.length > 0);
const currentSlideData = computed(() => slides.value?.[currentSlide.value] ?? null);
const isVideoSlide = computed(() => currentSlideData.value?.type === "video");

const goToSlide = (index: number) => {
	currentSlide.value = index;
	if (autoScrollEnabled.value) { stopAutoScroll(); startAutoScroll(); }
};
const nextSlide = () => { if (slides.value) goToSlide((currentSlide.value + 1) % slides.value.length); };
const prevSlide = () => { if (slides.value) goToSlide((currentSlide.value - 1 + slides.value.length) % slides.value.length); };

const startAutoScroll = () => {
	if (autoScrollTimer) clearInterval(autoScrollTimer);
	autoScrollTimer = setInterval(nextSlide, autoScrollInterval.value);
};
const stopAutoScroll = () => { if (autoScrollTimer) { clearInterval(autoScrollTimer); autoScrollTimer = null; } };
const toggleAutoScroll = () => {
	autoScrollEnabled.value = !autoScrollEnabled.value;
	autoScrollEnabled.value && slides.value?.length > 1 ? startAutoScroll() : stopAutoScroll();
};

onMounted(() => { if (autoScrollEnabled.value && slides.value?.length > 1) startAutoScroll(); });
onUnmounted(() => stopAutoScroll());
</script>

<template>
	<div ref="sliderRef" class="relative h-[80vh] sm:h-[85vh] md:h-[90vh] overflow-hidden shadow-2xl">

		<SliderSkeleton v-if="isLoading" />

		<div v-else-if="isError" class="flex h-full items-center justify-center bg-gray-100">
			<div class="text-center p-8">
				<h3 class="text-lg font-semibold text-red-500 mb-2">Failed to load content</h3>
				<button @click="refetch" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Try Again</button>
			</div>
		</div>

		<!-- Slides -->
		<div v-else-if="hasSlides" class="h-full">
			<transition-group name="fade" tag="div" class="h-full relative">
				<div
					v-for="(slide, index) in slides"
					:key="slide.id"
					v-show="currentSlide === index"
					class="absolute inset-0 w-full h-full"
				>
					<!-- Background: video -->
					<video
						v-if="slide.type === 'video'"
						:src="imagePath(slide.video?.url)"
						class="absolute inset-0 w-full h-full object-cover"
						autoplay loop playsinline muted
					/>

					<!-- Background: image -->
					<div
						v-else
						class="absolute inset-0 bg-cover bg-center"
						:style="`background-image: url('${bgUrl(slide.image?.url)}')`"
					/>

					<!-- Overlays -->
					<div class="absolute inset-0" style="background:rgba(0,0,0,0.65);z-index:1" />
					<div class="absolute inset-0" style="background:linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,transparent 40%,transparent 60%,rgba(0,0,0,0.7) 100%);z-index:2" />

					<!-- Center: project info + DISCOVER MORE -->
					<div class="absolute inset-0 flex flex-col items-center justify-center px-4 text-center" style="z-index:3">
						<div class="max-w-2xl w-full">

							<!-- Stats row: price + payment plan -->
							<div
								v-if="slide.sub_title || slide.link_url"
								class="flex items-center justify-center gap-6 mb-6"
							>
								<!-- Price -->
								<div v-if="slide.sub_title" class="flex items-center gap-3">
									<div style="width:40px;height:40px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);backdrop-filter:blur(4px)">
										<svg width="18" height="18" fill="none" stroke="white" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"/></svg>
									</div>
									<div class="text-left">
										<div class="text-white font-bold text-lg leading-none">{{ slide.sub_title }}</div>
										<div class="text-white/60 text-xs mt-0.5">Starting From</div>
									</div>
								</div>

								<!-- Divider -->
								<div v-if="slide.sub_title && slide.link_url" style="width:1px;height:36px;background:rgba(255,255,255,0.2)"></div>

								<!-- Payment Plan -->
								<div v-if="slide.link_url" class="flex items-center gap-3">
									<div style="width:40px;height:40px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);backdrop-filter:blur(4px)">
										<svg width="18" height="18" fill="none" stroke="white" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 8.25h-7.5M15.75 12h-7.5M15.75 15.75h-7.5"/></svg>
									</div>
									<div class="text-left">
										<div class="text-white font-bold text-lg leading-none">{{ slide.link_url }} %</div>
										<div class="text-white/60 text-xs mt-0.5">Payment Plan</div>
									</div>
								</div>
							</div>

							<!-- Project title -->
							<h1
								v-if="slide.title"
								class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3"
							>
								{{ slide.title }}
							</h1>

							<!-- Description -->
							<p
								v-if="slide.description"
								class="text-white/75 text-sm sm:text-base mb-7 leading-relaxed"
							>
								{{ slide.description }}
							</p>

							<!-- Discover More -->
							<a
								v-if="slide.url && slide.link_title"
								:href="slide.url"
								class="btn-cta btn-white inline-flex gap-2 items-center"
							>
								{{ slide.link_title }}
								<IconArrowUpRight />
							</a>
						</div>
					</div>

					<!-- Bottom bar: Buy + Sell -->
					<div class="absolute bottom-0 inset-x-0" style="z-index:4;border-top:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.45);backdrop-filter:blur(8px)">
						<div class="flex items-center justify-center gap-0">
							<router-link
								to="/properties"
								class="inline-flex items-center gap-2 px-10 py-4 text-xs font-semibold tracking-widest uppercase text-white transition"
								style="border-right:1px solid rgba(255,255,255,0.12)"
								@mouseover="($event.currentTarget as HTMLElement).style.background='rgba(201,160,40,0.18)'"
								@mouseleave="($event.currentTarget as HTMLElement).style.background='transparent'"
							>
								<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
								Buy a Property
							</router-link>
							<router-link
								to="/sell"
								class="inline-flex items-center gap-2 px-10 py-4 text-xs font-semibold tracking-widest uppercase text-white transition"
								@mouseover="($event.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.08)'"
								@mouseleave="($event.currentTarget as HTMLElement).style.background='transparent'"
							>
								<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/></svg>
								Sell a Property
							</router-link>
						</div>
					</div>
				</div>
			</transition-group>
		</div>

		<!-- Left arrow -->
		<div class="absolute top-1/2 left-4 -translate-y-1/2 z-20">
			<button
				v-if="slides && slides.length > 1"
				@click="prevSlide"
				class="bg-black/50 hover:bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
		</div>

		<!-- Right arrow -->
		<div class="absolute top-1/2 right-4 -translate-y-1/2 z-20">
			<button
				v-if="slides && slides.length > 1"
				@click="nextSlide"
				class="bg-black/50 hover:bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>

		<!-- Auto-scroll toggle -->
		<div class="absolute top-4 left-4 z-20">
			<button
				v-if="slides && slides.length > 1"
				@click="toggleAutoScroll"
				class="bg-black/50 hover:bg-primary text-white p-2 rounded-full shadow-lg transition"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						:d="autoScrollEnabled ? 'M6 6h4v12H6zm8 0h4v12h-4z' : 'M8 5v14l11-7z'"
					/>
				</svg>
			</button>
		</div>

		<!-- Dot indicators -->
		<div
			v-if="hasSlides"
			class="absolute bottom-6 right-6 flex gap-2 z-10"
		>
			<button
				v-for="(slide, index) in slides"
				:key="index"
				@click="goToSlide(index)"
				:class="[
					'h-2 rounded-full transition-all duration-300',
					currentSlide === index ? 'bg-secondary w-6' : 'bg-white/50 hover:bg-white/80 w-2',
				]"
			/>
		</div>

	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.8s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* Shared button base */
.btn-cta {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.7rem 1.4rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    white-space: nowrap;
    text-decoration: none;
}
.btn-white {
    background: #ffffff;
    color: #111111;
    border: 2px solid #ffffff;
}
.btn-white:hover {
    background: transparent;
    color: #ffffff;
}
.btn-gold {
    background: #C9A028;
    color: #111111;
    border: 2px solid #C9A028;
}
.btn-gold:hover {
    background: transparent;
    color: #C9A028;
}
.btn-ghost {
    background: transparent;
    color: #ffffff;
    border: 2px solid rgba(255,255,255,0.55);
}
.btn-ghost:hover {
    background: rgba(255,255,255,0.12);
    border-color: #ffffff;
}

/* Override global gold gradient on headings inside the slider */
h1 {
    background: none !important;
    -webkit-background-clip: unset !important;
    background-clip: unset !important;
    -webkit-text-fill-color: #ffffff !important;
    color: #ffffff !important;
}
</style>
