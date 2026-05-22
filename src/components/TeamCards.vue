<script setup lang="ts">
import { ref, computed } from "vue";
import { Phone, MessageCircle } from "lucide-vue-next";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "../components/ui/dialog";

interface Member {
	name: string;
	name_jp?: string;
	slug: string | null;
	position: string;
	position_jp?: string;
	bio: string | null;
	bio_jp?: string;
	contact_number: string;
	contact_number_jp?: string;
	whatsapp_number: string;
	whatsapp_number_jp?: string;
	imageUrl: string;
}

const props = defineProps<{
	lang: string;
	teamCategories: {
		category: string;
		category_jp: string;
		slug: string;
		members: Member[];
	}[];
}>();

const selectedMember = ref<Member | null>(null);
const openMemberDetails = (member: Member) => (selectedMember.value = member);
const closeMemberDetails = () => (selectedMember.value = null);

const isChinese = computed(() => props.lang === "jp");

// fallback helper
const t = (normal: string | null | undefined, jp: string | null | undefined) =>
	isChinese.value && jp ? jp : normal;
</script>

<template>
	<section>
		<Tabs :default-value="teamCategories[0]?.slug" class="w-full">
			<TabsList class="flex justify-center flex-wrap gap-2 mb-6">
				<TabsTrigger
					v-for="category in teamCategories"
					:key="category.slug"
					:value="category.slug"
					class="px-4 py-2 rounded-lg text-sm font-semibold shadow-sm bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:bg-black-100 data-[state=active]:text-white data-[state=active]:border-black-100 transition"
				>
					{{ t(category.category, category.category_jp) }}
				</TabsTrigger>
			</TabsList>

			<TabsContent
				v-for="category in teamCategories"
				:key="category.slug"
				:value="category.slug"
			>
				<TransitionGroup
					name="fade"
					tag="div"
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
				>
					<div
						v-for="member in category.members"
						:key="member.name"
						class="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow hover:shadow-lg overflow-hidden transition-all cursor-pointer"
						@click="openMemberDetails(member)"
					>
						<img
							:src="
								member.imageUrl ||
								'/images/placeholder-avatar.png'
							"
							:alt="t(member.name, member.name_jp)"
							class="w-full h-64 object-contain bg-gray-100 group-hover:scale-105 transition-transform rounded-t-2xl"
						/>
						<div class="p-5 text-center space-y-1">
							<h3 class="text-lg font-bold text-gray-800">
								{{ t(member.name, member.name_jp) }}
							</h3>
							<p class="text-sm text-gray-500">
								{{ t(member.position, member.position_jp) }}
							</p>
							<p v-if="t(member.bio, member.bio_jp)" class="text-xs text-gray-400 line-clamp-3 mt-1">
								{{ t(member.bio, member.bio_jp) }}
							</p>
						</div>
						<div
							class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"
						></div>
					</div>
				</TransitionGroup>
			</TabsContent>
		</Tabs>

		<!-- Member Details Dialog -->
		<Dialog v-model:open="selectedMember">
			<DialogOverlay
				v-if="selectedMember"
				class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
			/>

			<DialogContent class="z-50 max-w-md bg-white">
				<DialogHeader>
					<DialogTitle>
						{{ t(selectedMember?.name, selectedMember?.name_jp) }}
					</DialogTitle>
					<DialogDescription>
						{{
							t(
								selectedMember?.position,
								selectedMember?.position_jp,
							)
						}}
					</DialogDescription>
				</DialogHeader>

				<div class="flex flex-col items-center space-y-4">
					<img
						:src="
							selectedMember?.imageUrl ||
							'/images/placeholder-avatar.png'
						"
						:alt="t(selectedMember?.name, selectedMember?.name_jp)"
						class="w-32 h-32 object-cover rounded-full shadow"
					/>
					<p
						v-if="selectedMember?.bio || selectedMember?.bio_jp"
						class="text-center text-gray-600"
					>
						{{ t(selectedMember?.bio, selectedMember?.bio_jp) }}
					</p>
					<div class="flex items-center justify-center gap-6 mt-4">
						<!-- Phone Icon Button -->
						<a
							v-if="
								selectedMember?.contact_number ||
								selectedMember?.contact_number_jp
							"
							:href="`tel:${t(selectedMember?.contact_number, selectedMember?.contact_number_jp)}`"
							target="_blank"
							rel="noopener noreferrer"
							class="p-3 bg-gray-100 rounded-full hover:bg-black-100 hover:text-white transition"
							:title="
								'Call ' +
								t(selectedMember?.name, selectedMember?.name_jp)
							"
						>
							<Phone class="w-5 h-5" />
						</a>

						<!-- WhatsApp Icon Button -->
						<a
							v-if="
								selectedMember?.whatsapp_number ||
								selectedMember?.whatsapp_number_jp
							"
							:href="`https://wa.me/${t(selectedMember?.whatsapp_number, selectedMember?.whatsapp_number_jp).replace(/[^0-9]/g, '')}`"
							target="_blank"
							rel="noopener noreferrer"
							class="p-3 bg-gray-100 rounded-full hover:bg-black-100 hover:text-white transition"
							:title="
								'WhatsApp ' +
								t(selectedMember?.name, selectedMember?.name_jp)
							"
						>
							<MessageCircle class="w-5 h-5" />
						</a>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	</section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
