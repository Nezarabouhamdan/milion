<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useTeamsQuery } from "../composables/useTeam";
import { imagePath } from "../utils/helpers";
import TeamCards from "../components/TeamCards.vue";
import Error from "../components/common/Error.vue";

const pageRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(pageRef);

const {
	data: teamsResponse,
	isLoading,
	isError,
	refetch,
} = useTeamsQuery(isVisible.value);

watchEffect(() => {
	if (isVisible.value) refetch();
});

const teamCategories = computed(() =>
	(teamsResponse.value || []).map((category) => ({
		category: category.name,
		slug: category.slug || category.name.toLowerCase().replace(/\s+/g, "-"),
		members: (category.team || []).map((member) => ({
			name: member.name,
			slug: member.slug,
			position: member.position,
			bio: member.bio,
			contact_number: member.contact_number,
			whatsapp_number: member.whatsapp_number,
			imageUrl:
				typeof member.image === "object" && member.image?.url
					? imagePath(member.image.url)
					: member.image || "",
		})),
	})),
);
</script>

<template>
	<div
		ref="pageRef"
		class="py-28 bg-gradient-to-b from-white via-gray-50 to-white"
	>
		<div class="container max-w-7xl space-y-20">
			<!-- Loading -->
			<PageSkeleton v-if="isLoading" />

			<!-- Error -->
			<Error
				v-else-if="isError"
				message="Failed to load team data."
				:retry="refetch"
			/>

			<!-- Content -->
			<template v-else>
				<!-- Title -->
				<section class="text-center">
					<h1
						class="text-4xl md:text-6xl font-extrabold text-black-100 leading-tight tracking-tight mb-5"
					>
						Meet Our Team
					</h1>
					<p class="text-lg text-gray-600 max-w-2xl mx-auto">
						Our dedicated professionals bring years of experience and passion for excellence.
					</p>
				</section>

				<!-- Content Card -->
				<section
					class="relative rounded-3xl p-10 md:p-14 bg-white shadow-xl border border-gray-200 overflow-hidden transition hover:shadow-2xl"
				>
					<!-- background noise overlay -->
					<div
						class="absolute inset-0 bg-[url('/textures/noise-light.png')] opacity-10 pointer-events-none rounded-3xl"
					></div>

					<TeamCards
						lang="en"
						v-if="teamCategories.length"
						:teamCategories="teamCategories"
					/>

					<!-- Loading fallback grid -->
					<div
						v-else
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
					>
						<div
							v-for="i in 8"
							:key="i"
							class="animate-pulse bg-gray-100 h-64 rounded-2xl shadow-inner"
						></div>
					</div>

					<!-- Join Our Team CTA -->
					<div class="mt-10 text-center">
						<RouterLink
							to="/careers"
							class="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-black-100 hover:bg-primary-dark transition shadow-lg"
						>
							Join Our Team
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</RouterLink>
					</div>
				</section>
			</template>
		</div>
	</div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: all 0.4s ease;
}

.fade-slide-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.fade-slide-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>