<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSettingsStore } from "../stores/settingsStore";
import { useResponse } from "../composables/useResponse";
import { contactUs } from "../api/contactUs/api";

const settings = useSettingsStore();

// Form state
const contactForm = ref({
	name: "",
	email: "",
	phone_code: "971",
	contact_number: "",
	message: "",
});

const isSubmitting = ref(false);

// Ensure flag is displayed on mount
onMounted(() => {
	contactForm.value.phone_code = "971"; // Trigger reactivity for contactForm
});

// Handle country code change
const onCountryCodeChange = (value: string, phoneData: any) => {
	if (phoneData && phoneData.dialCode) {
		contactForm.value.phone_code = `+${phoneData.dialCode}`;
	}
};

// Submit handler
const submitContactRequest = async () => {
	isSubmitting.value = true;
	try {
		const response = await contactUs({
			...contactForm.value,
			contact_number: `${contactForm.value.phone_code}${contactForm.value.contact_number}`,
		});
		// Reset form
		contactForm.value = {
			name: "",
			email: "",
			phone_code: "971",
			contact_number: "",
			message: "",
		};
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<div class="py-20 bg-gradient-to-br from-gray-50 to-white">
		<div class="container grid grid-cols-1 lg:grid-cols-2 gap-16">
			<!-- Contact Info -->
			<section class="bg-white rounded-2xl shadow-lg p-8 space-y-6">
				<h2 class="text-4xl font-bold mb-4 text-gray-800">
					Get in Touch
				</h2>
				<p class="text-gray-600">
					If you have questions regarding your personal data or our
					privacy practices, please contact
				</p>
				<div class="space-y-6">
					<!-- Phone -->
					<div
						class="flex items-start gap-4 hover:bg-gray-50 p-2 rounded-lg transition"
					>
						<div class="bg-primary/10 p-4 rounded-full shadow">
							<svg
								class="w-7 h-7 text-primary"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 5a2 2 0 012-2h3.28l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
						<div>
							<p class="text-lg font-semibold text-gray-800">
								Phone
							</p>
							<p class="text-gray-500">
								{{ settings.getSetting("contact_number") }}
							</p>
						</div>
					</div>

					<!-- Email -->
					<div
						class="flex items-start gap-4 hover:bg-gray-50 p-2 rounded-lg transition"
					>
						<div class="bg-primary/10 p-4 rounded-full shadow">
							<svg
								class="w-7 h-7 text-primary"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16 12a4 4 0 01-8 0 4 4 0 018 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 14l-8 6h16l-8-6z"
								/>
							</svg>
						</div>
						<div>
							<p class="text-lg font-semibold text-gray-800">
								Email
							</p>
							<p class="text-gray-500">
								{{ settings.getSetting("email") }}
							</p>
						</div>
					</div>

					<!-- Address -->
					<div
						class="flex items-start gap-4 hover:bg-gray-50 p-2 rounded-lg transition"
					>
						<div class="bg-primary/10 p-4 rounded-full shadow">
							<svg
								class="w-7 h-7 text-primary"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0L6.343 16.657A8 8 0 1117.657 16.657z"
								/>
							</svg>
						</div>
						<div>
							<p class="text-lg font-semibold text-gray-800">
								Office
							</p>
							<p class="text-gray-500">
								{{ settings.getSetting("address") }}
							</p>
						</div>
					</div>
				</div>

				<!-- Map -->
				<div class="w-full h-64 rounded-lg overflow-hidden shadow mt-6">
					<p
						class="w-full h-full"
						v-html="settings.getSetting('map_link')"
						loading="lazy"
						title="Office Location Map"
					></p>
				</div>
			</section>

			<!-- Contact Form -->
			<section class="bg-white rounded-2xl shadow-lg p-8">
				<h2 class="text-3xl font-bold mb-6 text-gray-800">
					Send Us a Message
				</h2>
				<form class="space-y-5" @submit.prevent="submitContactRequest">
					<div>
						<label class="text-sm text-gray-600 mb-1 block"
							>Your Name</label
						>
						<input
							v-model="contactForm.name"
							type="text"
							placeholder="John Doe"
							class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
						/>
					</div>
					<div>
						<label class="text-sm text-gray-600 mb-1 block"
							>Email Address</label
						>
						<input
							v-model="contactForm.email"
							type="email"
							placeholder="you@example.com"
							class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
						/>
					</div>
					<div>
						<label class="text-sm text-gray-600 mb-1 block"
							>Phone</label
						>
						<div class="flex space-x-2">
							<vue-tel-input
								v-model="contactForm.phone_code"
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
								@onInput="onCountryCodeChange"
							/>
							<input
								v-model="contactForm.contact_number"
								type="tel"
								required
								placeholder="Enter phone number"
								class="w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
							/>
						</div>
					</div>
					<div>
						<label class="text-sm text-gray-600 mb-1 block"
							>Message</label
						>
						<textarea
							v-model="contactForm.message"
							rows="4"
							placeholder="Write your message..."
							class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
						></textarea>
					</div>
					<button
						type="submit"
						:disabled="isSubmitting"
						class="w-full py-3 rounded-lg bg-black-100 text-white font-semibold hover:bg-black-100-dark transition"
					>
						<span v-if="isSubmitting">Sending...</span>
						<span v-else>Send Message</span>
					</button>
				</form>
			</section>
		</div>
	</div>
</template>

<style scoped>
::v-deep .w-full iframe {
	width: 100% !important;
	height: 100% !important;
	display: block;
}
</style>
