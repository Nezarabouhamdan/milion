<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useVacanciesQuery } from "../composables/useVacancyQuery";
import { applyVacancy, applyCareerRequest } from "../api/vacancy/api";
import { imagePath } from "../utils/helpers";
import { useSettingsStore } from "../stores/settingsStore";
import { useAboutUsQuery } from "../composables/useAboutUsPageQuery";
import { useSeoMeta } from "@unhead/vue";

import chairman from "../assets/ceo-img.jpeg";

// For lazy load
const pageRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(pageRef);

const settingsStore = useSettingsStore();

const fileInputRef = ref<HTMLInputElement | null>(null);

const {
	data: vacanciesData,
	isLoading,
	isError,
	refetch,
} = useVacanciesQuery(isVisible.value);

const { data: aboutUs } = useAboutUsQuery(true);

watchEffect(() => {
	if (isVisible.value) refetch();
});

const deSlugify = (str: string) => {
	return str.replace(/_/g, " ");
};

// Modal controls
const selectedVacancy = ref(null);
const showVacancyModal = ref(false);
const openVacancyModal = (vacancy: any) => {
	selectedVacancy.value = vacancy;
	showVacancyModal.value = true;
};
const closeVacancyModal = () => (showVacancyModal.value = false);

// Form
const applyForm = ref({
	name: "",
	email: "",
	phone_code: "971",
	contact_number: "",
	message: "",
});
const applyFile = ref<File | null>(null);
const isSubmitting = ref(false);

const cvInput = ref<HTMLInputElement | null>(null);
const sendCvForm = ref({
	name: "",
	email: "",
	phone_code: "971",
	contact_number: "",
});
const sendCvFile = ref<File | null>(null);
const isSubmittingCv = ref(false);

// Ensure flags are displayed on mount
onMounted(() => {
	applyForm.value.phone_code = "971"; // Trigger reactivity for applyForm
	sendCvForm.value.phone_code = "971"; // Trigger reactivity for sendCvForm
});

// Handle file input
const handleFileChange = (event: Event) => {
	const files = (event.target as HTMLInputElement).files;
	if (files?.length) {
		applyFile.value = files[0];
	}
};

const handleSendCvFileChange = (event: Event) => {
	const files = (event.target as HTMLInputElement).files;
	if (files?.length) {
		sendCvFile.value = files[0];
	}
};

// Handle country code changes
const onApplyCountryCodeChange = (value: string, phoneData: any) => {
	if (phoneData && phoneData.dialCode) {
		applyForm.value.phone_code = `+${phoneData.dialCode}`;
	}
};

const onSendCvCountryCodeChange = (value: string, phoneData: any) => {
	if (phoneData && phoneData.dialCode) {
		sendCvForm.value.phone_code = `+${phoneData.dialCode}`;
	}
};

// Submit handler
const submitApplication = async () => {
	if (!selectedVacancy.value) return;

	const formData = new FormData();
	formData.append("vacancy_id", selectedVacancy.value.id);
	formData.append("name", applyForm.value.name);
	formData.append("email", applyForm.value.email);
	formData.append(
		"contact_number",
		`${applyForm.value.phone_code}${applyForm.value.contact_number}`,
	);
	formData.append("message", applyForm.value.message);
	if (applyFile.value) formData.append("cv_file", applyFile.value);

	isSubmitting.value = true;

	try {
		const success = await applyVacancy(formData);
		if (success) {
			applyForm.value = {
				name: "",
				email: "",
				phone_code: "971",
				contact_number: "",
				message: "",
			};
			applyFile.value = null;
			closeVacancyModal();
		}
	} finally {
		isSubmitting.value = false;
	}
};

const submitCareerRequest = async () => {
	const formData = new FormData();
	formData.append("name", sendCvForm.value.name);
	formData.append("email", sendCvForm.value.email);
	formData.append(
		"contact_number",
		`${sendCvForm.value.phone_code}${sendCvForm.value.contact_number}`,
	);
	if (sendCvFile.value) formData.append("cv_file", sendCvFile.value);

	isSubmittingCv.value = true;

	try {
		const success = await applyCareerRequest(formData);
		if (success) {
			sendCvForm.value = {
				name: "",
				email: "",
				phone_code: "971",
				contact_number: "",
			};
			sendCvFile.value = null;
			if (fileInputRef.value) {
				fileInputRef.value.value = "";
			}
		}
	} finally {
		isSubmittingCv.value = false;
	}
};

useSeoMeta({
	title: "Join Our Team | Careers at Million Homes Real Estate Broker LLC",
	description:
		"Explore exciting career opportunities at Million Homes Real Estate Broker LLC. Join a team that values growth, collaboration, and excellence.",
	ogTitle: "Careers at Million Homes Real Estate Broker LLC",
	ogDescription:
		"Discover career opportunities with a company shaping the future of real estate in Dubai.",
	ogType: "website",
	ogUrl: typeof window !== "undefined" ? window.location.href : "",
	twitterCard: "summary_large_image",
	twitterTitle: "Careers at Million Homes Real Estate",
	twitterDescription:
		"We're hiring! Join a team that redefines excellence in real estate.",
});
</script>

<template>
	<div class="bg-neutral-50">
		<!-- HERO SECTION -->
		<section
			class="relative bg-cover bg-center text-white"
			style="
				background-image: url(&quot;https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80&quot;);
			"
		>
			<div
				class="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"
			></div>
			<div class="relative z-10 py-24 md:py-36 text-center px-4 sm:px-6">
				<h1
					class="text-3xl text-white sm:text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md"
				>
					Join Our Team
				</h1>
				<p
					class="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white/80 drop-shadow-sm"
				>
					Build your career with a company that values growth,
					collaboration, and excellence.
				</p>
				<div
					class="mt-8 flex flex-col sm:flex-row justify-center gap-4"
				>
					<a
						href="#vacancies"
						class="bg-black-100 text-white px-6 sm:px-7 py-3 rounded-xl shadow-md hover:scale-105 transition text-center"
					>
						View Vacancies
					</a>
					<a
						href="#send-us-your-cv"
						class="bg-white text-black-100 border border-black-100 px-6 sm:px-7 py-3 rounded-xl hover:bg-black-100 hover:text-white transition text-center"
					>
						Send us your CV
					</a>
				</div>
			</div>
		</section>

		<!-- WHY JOIN US -->
		<section class="py-20 sm:py-24 px-4 sm:px-6 text-center bg-white">
			<h2
				class="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-black-100"
			>
				Why Join Us?
			</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
				<div
					v-for="(item, index) in settingsStore.whyJoinUs"
					:key="index"
				>
					<p
						class="text-xl sm:text-2xl font-extrabold text-black-100"
					>
						{{ item.title || "N/A" }}
					</p>
					<p
						class="text-slate-600 text-sm uppercase tracking-wider mt-1"
					>
						{{ item.description }}
					</p>
				</div>
			</div>
		</section>

		<!-- OUR AWARDS -->
		<section class="py-20 sm:py-24 px-4 sm:px-6 bg-gray-50 text-center">
			<h2
				class="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-black-100"
			>
				Our Awards
			</h2>
			<div class="flex flex-wrap justify-center gap-8">
				<div
					v-for="award in aboutUs?.award_certifications"
					:key="award"
					class="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
				>
					<a :href="award?.link" target="_blank">
						<img
							:src="imagePath(award.image?.url)"
							:alt="award.title"
							class="h-36 sm:h-40 w-auto object-contain mx-auto mb-4"
							loading="lazy"
						/>
						<p class="text-lg font-semibold text-black-100">
							{{ award.title }}
						</p>
					</a>
				</div>
			</div>
		</section>

		<!-- CHAIRMAN MESSAGE
		<section class="py-20 sm:py-24 px-4 sm:px-6 bg-white">
			<div
				class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
			>
				<img
					:src="chairman"
					alt="Chairman"
					class="rounded-2xl shadow-lg w-full object-cover max-h-[400px]"
					loading="lazy"
				/>
				<div>
					<h2
						class="text-3xl sm:text-4xl font-bold mb-6 text-black-100 leading-snug"
					>
						CEO’s Message
					</h2>
					<p
						class="text-slate-600 leading-relaxed text-base sm:text-lg mb-4"
					>
						At Million Homes Real Estate Broker LLC, we believe that
						excellence is not just a standard—it’s a culture. Our
						journey has been shaped by bold vision, relentless
						dedication, and a team that thrives on ambition, trust,
						and innovation. As we continue to elevate the standards
						of real estate advisory in Dubai and beyond, we
						recognize that our people are our greatest asset.
						Whether you are an experienced professional or just
						starting your career, this is a place where your
						potential is not only seen—but nurtured. We offer more
						than just a job—we offer a platform to grow, lead, and
						make an impact in one of the world’s most dynamic
						property markets. Here, your ideas matter, your efforts
						are celebrated, and your career has no boundaries. Join
						us in redefining excellence. Let’s build a future
						together—one milestone, one home, one dream at a time.
					</p>
					<p
						class="text-[20px] text-black-100 font-medium font-semibold text-base"
					>
						— Takuhiko Ito
					</p>
				</div>
			</div>
		</section> -->

		<section
			ref="pageRef"
			id="vacancies"
			class="py-16 sm:py-20 md:py-24 bg-neutral-50 text-center"
		>
			<h2
				class="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 sm:mb-12 text-black-100"
			>
				Current Vacancies
			</h2>
			<div class="flex flex-wrap justify-center gap-8">
				<div
					v-for="vacancy in vacanciesData"
					:key="vacancy.id"
					class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-left cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
					@click="openVacancyModal(vacancy)"
				>
					<h3
						class="text-xl sm:text-2xl font-bold text-black-100 mb-3"
					>
						{{ vacancy.title }}
					</h3>
					<p class="text-slate-600 text-sm sm:text-base">
						{{ vacancy.department }} | {{ vacancy.location }}
					</p>
					<p class="text-slate-500 text-sm mt-1">
						Closes: {{ vacancy.closing_date }}
					</p>
					<div class="mt-4">
						<span
							class="inline-block text-xs bg-black-100 text-white px-2 py-1 rounded-full capitalize"
						>
							{{ deSlugify(vacancy.employment_type) }}
						</span>
					</div>
					<div class="mt-4 flex justify-end gap-4">
						<span
							v-if="vacancy.linkedin_url"
							class="text-black-100 text-sm font-medium hover:underline flex items-center gap-1 flex"
						>
							<a
								:href="vacancy.linkedin_url"
								target="_blank"
								class="flex items-center gap-1"
							>
								LinkedIn
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
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</a>
						</span>
						<span
							class="text-black-100 text-sm font-medium hover:underline flex items-center gap-1"
						>
							Apply
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
			<div
				v-if="vacanciesData?.length === 0"
				class="col-span-full text-center text-slate-500 text-lg py-16"
			>
				No vacancies are open right now.
			</div>
		</section>

		<!-- VACANCY MODAL -->
		<template v-if="selectedVacancy">
			<div
				v-if="showVacancyModal"
				class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
				@keydown.esc="closeVacancyModal"
				role="dialog"
				aria-labelledby="vacancy-modal-title"
				aria-modal="true"
			>
				<div
					class="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-4 p-8 relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 sm:scale-100"
				>
					<!-- Close Button -->
					<button
						@click="closeVacancyModal"
						class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
						aria-label="Close modal"
					>
						✕
					</button>

					<!-- Modal Header -->
					<h3
						id="vacancy-modal-title"
						class="text-3xl md:text-4xl font-bold mb-6 text-gray-900 bg-gradient-to-r from-primary to-gray-900 bg-clip-text text-transparent"
					>
						{{ selectedVacancy.title }}
					</h3>
					<div class="flex items-center gap-2 mb-8">
						<span class="text-sm text-gray-600"
							>{{ selectedVacancy.department }} |
							{{ selectedVacancy.location }}</span
						>
						<span class="text-sm text-gray-500"
							>Closes: {{ selectedVacancy.closing_date }}</span
						>
					</div>

					<div class="mb-6">
						<span
							v-if="selectedVacancy.linkedin_url"
							class="text-black-100 flex text-sm font-medium hover:underline flex items-center gap-1"
						>
							<a
								:href="selectedVacancy.linkedin_url"
								target="_blank"
								class="flex items-center gap-1"
							>
								LinkedIn
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
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</a>
						</span>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<!-- LEFT: Description & Requirements -->
						<div class="space-y-6">
							<div>
								<h4
									class="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"
								>
									<svg
										class="w-5 h-5 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									Job Description
								</h4>
								<div
									class="prose max-w-none text-gray-700 leading-relaxed"
									v-html="selectedVacancy.description"
								></div>
							</div>
							<div>
								<h4
									class="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"
								>
									<svg
										class="w-5 h-5 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Requirements
								</h4>
								<div
									class="prose max-w-none text-gray-700 leading-relaxed"
									v-html="selectedVacancy.requirements"
								></div>
							</div>
						</div>

						<!-- RIGHT: Application Form -->
						<div class="bg-gray-50 p-6 rounded-2xl shadow-inner">
							<h4
								class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
							>
								<svg
									class="w-5 h-5 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Apply Now
							</h4>
							<form
								class="space-y-4"
								@submit.prevent="submitApplication"
							>
								<div>
									<label
										for="name"
										class="block text-sm font-medium text-gray-700 mb-1 text-left"
										>Full Name</label
									>
									<input
										idposição
										id="name"
										v-model="applyForm.name"
										type="text"
										placeholder="Enter your name"
										required
										class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition"
									/>
								</div>
								<div>
									<label
										for="email"
										class="block text-sm font-medium text-gray-700 mb-1 text-left"
										>Email Address</label
									>
									<input
										id="email"
										v-model="applyForm.email"
										type="email"
										placeholder="Enter your email"
										required
										class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition"
									/>
								</div>
								<div>
									<label
										for="contact_number"
										class="block text-sm font-medium text-gray-700 mb-1 text-left"
										>Phone Number</label
									>
									<div class="flex space-x-2">
										<vue-tel-input
											v-model="applyForm.phone_code"
											defaultCountry="AE"
											:dropdownOptions="{
												showFlags: true,
												showDialCode: true,
											}"
											:inputOptions="{
												showDialCode: true,
												readonly: true,
											}"
											class="w-1/3 border rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20"
											:wrapperClasses="'focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'"
											@onInput="onApplyCountryCodeChange"
										/>
										<input
											v-model="applyForm.contact_number"
											type="tel"
											required
											placeholder="Enter phone number"
											class="w-2/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition"
										/>
									</div>
								</div>
								<div>
									<label
										for="message"
										class="block text-sm font-medium text-gray-700 mb-1 text-left"
										>Message (Optional)</label
									>
									<textarea
										id="message"
										v-model="applyForm.message"
										placeholder="Tell us about yourself"
										rows="4"
										class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition"
									></textarea>
								</div>
								<div
									class="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition"
									@dragover.prevent
									@drop.prevent="handleFileChange"
									@click="() => $refs.cvInput?.click()"
								>
									<input
										id="cv_file"
										type="file"
										@change="handleFileChange"
										class="hidden"
										ref="cvInput"
									/>
									<p class="text-sm text-gray-600">
										<span v-if="!applyFile"
											>Upload
											<span class="text-primary underline"
												>browse</span
											></span
										>
										<span v-else class="text-green-600"
											>Selected:
											{{ applyFile.name }}</span
										>
									</p>
								</div>
								<button
									type="submit"
									:disabled="isSubmitting"
									class="relative bg-primary text-white px-6 py-3 rounded-lg w-full font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2"
								>
									<span
										v-if="isSubmitting"
										class="flex items-center gap-2"
									>
										<svg
											class="w-5 h-5 animate-spin"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Submitting...
									</span>
									<span v-else>Submit Application</span>
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- RECRUITMENT PROCESS -->
		<section class="py-24 px-4 bg-white text-center">
			<h2 class="text-4xl md:text-5xl font-bold mb-12 text-black-100">
				Our Recruitment Process
			</h2>
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
			>
				<div
					v-for="(step, index) in [
						{
							title: 'Submit your CV',
							icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
						},
						{
							title: 'Telephone Interview',
							icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
						},
						{
							title: 'In-Person Interview',
							icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
						},
						{
							title: 'Offer Acceptance',
							icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
						},
					]"
					:key="step.title"
					class="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition"
				>
					<div class="flex items-center justify-center mb-4">
						<svg
							class="w-8 h-8 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								:d="step.icon"
							/>
						</svg>
					</div>
					<p class="text-3xl font-bold text-black-100 mb-2">
						{{ index + 1 }}
					</p>
					<p class="font-medium text-black-100">{{ step.title }}</p>
				</div>
			</div>
		</section>

		<!-- SEND US YOUR CV -->
		<section id="send-us-your-cv" class="py-24 bg-gray-50 text-center">
			<h2 class="text-4xl md:text-5xl font-bold mb-12 text-black-100">
				Send Us Your CV
			</h2>
			<div class="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8">
				<form class="space-y-4" @submit.prevent="submitCareerRequest">
					<div>
						<label
							for="cv_name"
							class="block text-sm font-medium text-gray-700 mb-1 text-left"
							>Name</label
						>
						<input
							id="cv_name"
							v-model="sendCvForm.name"
							type="text"
							placeholder="Name"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-black-100 focus:border-black-100"
						/>
					</div>
					<div>
						<label
							for="cv_email"
							class="block text-sm font-medium text-gray-700 mb-1 text-left"
							>Email</label
						>
						<input
							id="cv_email"
							v-model="sendCvForm.email"
							type="email"
							placeholder="Email"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-black-100 focus:border-black-100"
						/>
					</div>
					<div>
						<label
							for="cv_contact_number"
							class="block text-sm font-medium text-gray-700 mb-1 text-left"
							>Phone Number</label
						>
						<div class="flex space-x-2">
							<vue-tel-input
								v-model="sendCvForm.phone_code"
								defaultCountry="AE"
								:dropdownOptions="{
									showFlags: true,
									showDialCode: true,
								}"
								:inputOptions="{
									showDialCode: true,
									readonly: true,
								}"
								class="w-1/3 border rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20"
								:wrapperClasses="'focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'"
								@onInput="onSendCvCountryCodeChange"
							/>
							<input
								v-model="sendCvForm.contact_number"
								type="tel"
								required
								placeholder="Enter phone number"
								class="w-2/3 rounded-lg border border-gray-300 px-4 py-2 focus:ring-black-100 focus:border-black-100"
							/>
						</div>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-black-100 text-l text-left"
							>Upload CV</label
						>
						<input
							type="file"
							ref="fileInputRef"
							@change="handleSendCvFileChange"
							class="w-full rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center cursor-pointer text-slate-600 focus:ring-black-100 focus:border-black-100 hover:border-black-100 hover:bg-slate-50 transition"
						/>
						<p
							v-if="sendCvFile"
							class="text-sm text-green-600 mt-1"
						>
							Selected: {{ sendCvFile.name }}
						</p>
					</div>
					<button
						type="submit"
						:disabled="isSubmittingCv"
						class="bg-black-100 text-white px-6 py-3 rounded-lg w-full hover:shadow-lg transition"
					>
						<span v-if="isSubmittingCv">Submitting...</span>
						<span v-else>Submit CV</span>
					</button>
				</form>
			</div>
		</section>
	</div>
</template>

<style scoped>
::-webkit-file-upload-button {
	display: none;
}

::file-selector-button {
	display: none;
}

/* Custom colors */
.bg-primary {
	background-color: #1e293b;
}

.text-primary {
	color: #1e293b;
}

.bg-primary-dark {
	background-color: #1e293b;
}

.border-primary {
	border-color: #1e293b;
}

.focus\:ring-primary:focus {
	--tw-ring-color: #1e293b;
}

/* Modal animations */
.scale-95 {
	transform: scale(0.95);
}

.transition-opacity {
	transition: opacity 0.3s ease;
}

.transform {
	transition: transform 0.3s ease;
}

/* Form input styling */
input,
textarea {
	transition: all 0.2s ease;
}

input:focus,
textarea:focus {
	outline: none;
	border-color: #1e293b;
	box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

/* File upload area */
.border-dashed:hover {
	border-color: #1e293b;
	background-color: rgba(30, 58, 138, 0.05);
}

/* Button hover effect */
button:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Hide default file input button */
::-webkit-file-upload-button,
::file-selector-button {
	display: none;
}
</style>
