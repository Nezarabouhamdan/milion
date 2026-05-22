<script setup lang="ts">
import { inject, ref, watch, computed } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useWhyChooseUsQuery } from "../composables/useWhyChooseUsQuery";
import { imagePath } from "../utils/helpers";
import backgroundImage from "../assets/buy_1.jpg";

// Inject language state and t function
const isChinese = inject("isChinese", ref(false));
const t = inject<(normal: string | null, jp: string | null) => string | null>(
	"t",
	(normal) => normal,
);

const whyChooseUsRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(whyChooseUsRef);

const {
	data: whyChooseUsList,
	isLoading,
	isError,
	refetch,
} = useWhyChooseUsQuery(isVisible.value);

watch(isVisible, (visible) => {
	if (visible) refetch();
});

const hasItems = computed(
	() => whyChooseUsList.value && whyChooseUsList.value.length > 0,
);
</script>

<template>
	<section
		ref="whyChooseUsRef"
		class="relative mt-24 py-24 bg-cover bg-center text-white"
		:style="{ backgroundImage: `url(${backgroundImage})` }"
	>
		<!-- Overlay -->
		<div class="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

		<div class="relative z-10 container text-center space-y-16">
			<h2
				class="text-4xl md:text-5xl text-white font-semibold tracking-tight"
			>
				{{ isChinese ? "为什么选择我们" : "Why work with us" }}
			</h2>

			<!-- SKELETON STATE -->
			<div
				v-if="isLoading"
				class="grid grid-cols-2 md:grid-cols-4 gap-10 items-start animate-pulse"
			>
				<div
					v-for="i in 4"
					:key="i"
					class="flex flex-col items-center space-y-3"
				>
					<div class="h-12 w-12 rounded-full bg-white/30"></div>
					<div class="h-4 w-24 rounded bg-white/30"></div>
				</div>
			</div>

			<!-- ERROR STATE -->
			<Error
				v-else-if="isError"
				message="Failed to load why choose us items."
				:retry="refetch"
			/>

			<!-- NORMAL CONTENT -->
			<div
				v-else-if="hasItems"
				class="grid grid-cols-2 md:grid-cols-4 gap-10 items-start"
			>
				<div
					v-for="(item, index) in whyChooseUsList"
					:key="item.id || index"
					class="flex flex-col items-center space-y-3"
				>
					<div
						class="h-24 p-3 w-24 rounded-full overflow-hidden flex items-center justify-center bg-white/20"
					>
						<img
							v-if="imagePath(item.image?.url) != ''"
							:src="imagePath(item.image?.url)"
							alt="Why Choose Us Image"
							class="w-full h-full object-cover"
						/>
					</div>
					<p class="text-lg font-medium">
						{{ t(item.title, item.title_jp) }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>
