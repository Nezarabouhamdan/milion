<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, watch, computed } from "vue";
import { imagePath } from "../utils/helpers";
import { useSettingsStore } from "../stores/settingsStore";
import { ScrollArea } from "../components/ui/scroll-area";

interface Popup {
	id: number;
	title?: string;
	link_title?: string;
	link?: string;
	image: {
		id: number;
		url: string;
	};
	start_time?: number; // Time in seconds before popup appears
	end_time?: number; // Time in seconds popup stays open
}

const props = defineProps<{
	popups: Popup[];
	autoClose?: number;
}>();

const settings = useSettingsStore();
const currentPopupIndex = ref(0);
const isVisible = ref(false); // Start as false, will show after start_time
const isTimerPaused = ref(false); // Pause state
let timer: number | undefined;
let countdownInterval: number | undefined;

const currentPopup = computed(() => props.popups[currentPopupIndex.value]);
const timeRemaining = ref(0); // Countdown timer in seconds, set per popup

const close = () => {
	isVisible.value = false;
	clearInterval(countdownInterval);
	if (currentPopupIndex.value < props.popups.length - 1) {
		const nextPopup = props.popups[currentPopupIndex.value + 1];
		const startDelay = (nextPopup.start_time ?? 0.3) * 1000; // Default to 0.3s if not specified
		setTimeout(() => {
			currentPopupIndex.value++;
			isVisible.value = true;
			timeRemaining.value =
				currentPopup.value.end_time ?? props.autoClose ?? 3;
			if (!isTimerPaused.value) startCountdown();
		}, startDelay);
	}
};

const handleClick = () => {
	if (currentPopup.value.link) {
		window.open(currentPopup.value.link, "_blank");
	}
	close();
};

const startCountdown = () => {
	countdownInterval = setInterval(() => {
		if (!isTimerPaused.value && timeRemaining.value > 0) {
			timeRemaining.value = Math.max(0, timeRemaining.value - 0.1);
			if (timeRemaining.value <= 0) {
				close();
			}
		}
	}, 100);
};

const togglePause = () => {
	isTimerPaused.value = !isTimerPaused.value;
	if (!isTimerPaused.value) startCountdown();
	else clearInterval(countdownInterval);
};

onMounted(() => {
	if (props.popups.length > 0) {
		const firstPopup = props.popups[0];
		const startDelay = (firstPopup.start_time ?? 0) * 1000;
		timeRemaining.value = firstPopup.end_time ?? props.autoClose ?? 3;
		setTimeout(() => {
			isVisible.value = true;
			if (!isTimerPaused.value) startCountdown();
		}, startDelay);

		if (props.autoClose && props.autoClose > 0) {
			timer = setTimeout(
				close,
				(firstPopup.end_time ?? props.autoClose) * 1000,
			);
		}
	}
});

onUnmounted(() => {
	if (timer) clearTimeout(timer);
	if (countdownInterval) clearInterval(countdownInterval);
});

// Reset timer when index changes
watch(currentPopupIndex, () => {
	if (timer) clearTimeout(timer);
	if (countdownInterval) clearInterval(countdownInterval);
	timeRemaining.value = currentPopup.value.end_time ?? props.autoClose ?? 3;
	if (!isTimerPaused.value && isVisible.value) {
		startCountdown();
		if (props.autoClose && props.autoClose > 0) {
			timer = setTimeout(
				close,
				(currentPopup.value.end_time ?? props.autoClose) * 1000,
			);
		}
	}
});

// Format time for display
const formattedTime = computed(() => {
	return timeRemaining.value.toFixed(1);
});

// Calculate stroke-dashoffset for progress ring
const progress = computed(() => {
	const duration = currentPopup.value.end_time ?? props.autoClose ?? 3;
	const percentage = (timeRemaining.value / duration) * 100;
	const circumference = 2 * Math.PI * 45; // Radius = 45
	return circumference - (percentage / 100) * circumference;
});
</script>

<template>
	<div
		v-if="isVisible && currentPopupIndex < popups?.length"
		class="fixed inset-0 bg-black-100/80 backdrop-blur-md z-[1000] flex items-center justify-center p-6"
		role="dialog"
	>
		<!-- Popup Box -->
		<div
			class="mt-[20vh] relative w-full max-w-[500px] max-h-[90vh] overflow-hidden cursor-pointer transform transition-all hover:scale-[1.01]"
		>
			<!-- Scrollable Content -->
			<ScrollArea class="h-[85vh] w-full" @click="handleClick">
				<div class="relative">
					<img
						:src="imagePath(popups[currentPopupIndex].image.url)"
						:alt="popups[currentPopupIndex].title || 'Popup Image'"
						class="w-full max-h-[900px] object-contain bg-black-100"
					/>
				</div>
			</ScrollArea>

			<!-- Overlay Controls (aligned to image width) -->
			<div class="absolute inset-x-0 top-0 flex justify-between items-start p-6">
				<!-- Timer -->
				<div
					v-if="(currentPopup.end_time || props.autoClose) > 0"
					class="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg flex items-center gap-4 border border-white/20"
				>
					<!-- Circular Progress Timer -->
					<div class="relative w-16 h-16">
						<svg class="w-full h-full" viewBox="0 0 100 100">
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="#ffffff"
								stroke-width="8"
							/>
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="#3b82f6"
								stroke-width="8"
								stroke-linecap="round"
								:stroke-dasharray="2 * Math.PI * 45"
								:stroke-dashoffset="progress"
								class="transition-all duration-100 ease-linear"
							/>
							<text
								x="50"
								y="50"
								text-anchor="middle"
								dy=".3em"
								class="text-white font-semibold text-sm"
							>
								{{ formattedTime }}s
							</text>
						</svg>
					</div>
					<!-- Pause/Resume Button -->
					<button
						@click.stop="togglePause"
						class="bg-gradient-to-r from-black-500 to-black-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full p-2.5 transition-all duration-300 shadow-md"
						:class="{
							'bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800':
								isTimerPaused,
						}"
					>
						<svg
							v-if="isTimerPaused"
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
								d="M14.752 11.168l-3.197-2.2A1 1 0 0010 9.768v4.464a1 1 0 001.555.832l3.197-2.2a1 1 0 000-1.664z"
							/>
						</svg>
						<svg
							v-else
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
								d="M10 9v6m4-6v6"
							/>
						</svg>
					</button>
				</div>

				<!-- Close Button -->
				<button
					@click.stop="close"
					class="bg-black-100 from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full p-2.5 transition-all duration-300 shadow-md"
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
		</div>
	</div>
</template>

<style scoped>
div[role="dialog"] {
	backdrop-filter: blur(6px);
	-webkit-backdrop-filter: blur(6px);
}

@keyframes popupFadeIn {
	from {
		opacity: 0;
		transform: translateY(30px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

div[role="dialog"] {
	animation: popupFadeIn 0.5s ease-out;
}

.truncate {
	display: block;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* Smooth button hover effect */
button {
	transform: scale(1);
	transition:
		transform 0.2s ease,
		background 0.3s ease;
}

button:hover {
	transform: scale(1.1);
}

button:active {
	transform: scale(0.95);
}
</style>
