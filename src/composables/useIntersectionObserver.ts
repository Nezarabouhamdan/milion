import { ref, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";

export function useIntersectionObserver(
	targetRef: Ref<HTMLElement | null>,
	options = { threshold: 0.1 },
) {
	const isVisible = ref(false);
	let observer: IntersectionObserver | null = null;

	const handleIntersect: IntersectionObserverCallback = (entries) => {
		for (const entry of entries) {
			isVisible.value = entry.isIntersecting;
		}
	};

	onMounted(() => {
		if (targetRef.value) {
			observer = new IntersectionObserver(handleIntersect, options);
			observer.observe(targetRef.value);
		}
	});

	onUnmounted(() => {
		observer?.disconnect();
	});

	return { isVisible };
}
