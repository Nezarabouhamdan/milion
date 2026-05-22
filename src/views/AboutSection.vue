<script setup lang="ts">
import { inject, ref, watch, computed } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useAboutUsSectionQuery } from "../composables/useAboutUsQuery";
import { imagePath } from "../utils/helpers";
import AboutUsSkeleton from "../components/common/AboutUsSkeleton.vue";

// Inject language state and t function
const isChinese = inject("isChinese", ref(false));
const t = inject<(normal: string | null, jp: string | null) => string | null>(
	"t",
	(normal) => normal,
);

const aboutUsSectionRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(aboutUsSectionRef);

const {
	data: aboutUs,
	isLoading,
	refetch,
	isError,
} = useAboutUsSectionQuery(isVisible.value);

watch(isVisible, (visible) => {
	if (visible) refetch();
});

const hasAboutUs = computed(() => aboutUs.value);
</script>

<template>
	<section ref="aboutUsSectionRef" class="w-full bg-gray-50 py-16">
		<div class="container">
			<!-- Loading -->
			<AboutUsSkeleton v-if="isLoading" />

			<!-- Error -->
			<Error
				v-else-if="isError"
				message="Failed to load About Us section."
				:retry="refetch"
			/>

			<!-- Main Content -->
			<div
				v-else-if="hasAboutUs"
				class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
			>
				<!-- Left: Team Image -->
				<div class="w-full h-full">
					<img
						:src="imagePath(aboutUs.image?.url)"
						alt="Meet the team"
						class="w-full h-full object-cover rounded-lg shadow-md"
					/>
				</div>

				<!-- Right: Content -->
				<div class="space-y-6">
					<div>
						<span
							class="inline-block border-l-4 border-primary pl-3 text-sm uppercase tracking-widest font-medium text-gray-500 mb-2"
							>{{ isChinese ? "关于" : "about" }}</span
						>
						<h2
							class="text-5xl font-extrabold text-gray-900 leading-tight mt-2"
						>
							{{ t(aboutUs.title, aboutUs.title_jp) || "" }}
						</h2>
						<p class="font-semibold text-lg text-gray-700">
							{{
								t(aboutUs.sub_title, aboutUs.sub_title_jp) || ""
							}}
						</p>
					</div>

					<p
						v-if="aboutUs.description"
						class="text-gray-600 leading-relaxed text-base"
						v-html="t(aboutUs.description, aboutUs.description_jp)"
					></p>

					<div class="pt-4">
						<router-link
							:to="'/about-us#meet-our-team'"
							class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-sm font-semibold hover:border-primary hover:text-primary transition"
						>
							{{
								t(aboutUs.ctaText, aboutUs.ctaText_jp) ||
								(isChinese
									? "认识我们的团队 →"
									: "meet our team →")
							}}
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
