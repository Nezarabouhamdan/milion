<script setup lang="ts">
import { ref } from "vue";
import { useNewsletter } from "../api/newsLetter/api";
import * as lucideIcons from "lucide-vue-next";

const form = ref({
	email: "",
});

const isSubmitting = ref(false);
const status = ref<"idle" | "success" | "error">("idle");
const statusMessage = ref("");

const submitForm = async () => {
	if (!form.value.email) return;

	isSubmitting.value = true;
	status.value = "idle";
	statusMessage.value = "";

	try {
		await useNewsletter(form.value);
		form.value.email = "";
		status.value = "success";
		statusMessage.value = "Thank you for subscribing!";
		setTimeout(() => {
			status.value = "idle";
			statusMessage.value = "";
		}, 3000);
	} catch (error) {
		status.value = "error";
		statusMessage.value = "Failed to subscribe. Please try again.";
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<section
		class="relative bg-black-100 text-white py-16 px-6 overflow-hidden"
	>
		<!-- Soft overlay for depth -->
		<div class="absolute inset-0 bg-black/30"></div>

		<!-- Decorative background shapes -->
		<div
			class="absolute -bottom-24 -left-16 w-64 h-64 bg-black-100 opacity-15 rounded-full filter blur-3xl"
		></div>
		<div
			class="absolute -top-20 -right-12 w-80 h-80 bg-gray-700 opacity-15 rounded-full filter blur-3xl"
		></div>

		<div class="relative container mx-auto text-center space-y-6 z-10">
			<!-- Heading -->
			<h2
				class="text-4xl md:text-5xl font-heading font-bold tracking-tight text-white drop-shadow-lg animate-slide-up"
			>
				Stay in the Loop
			</h2>

			<!-- Subheading -->
			<p
				class="text-lg md:text-xl text-gray-50 leading-relaxed max-w-2xl mx-auto font-sans"
			>
				Subscribe for exclusive property listings, market insights, and
				real estate tips delivered to your inbox.
			</p>

			<!-- Form -->
			<form
				@submit.prevent="submitForm"
				class="flex flex-col sm:flex-row items-center gap-4 mt-6 max-w-lg mx-auto"
			>
				<label for="email" class="sr-only">Email address</label>
				<div class="relative w-full sm:flex-1">
					<input
						id="email"
						v-model="form.email"
						type="email"
						required
						placeholder="Enter your email"
						class="w-full py-3.5 pl-12 pr-5 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary transition duration-300 font-sans text-sm"
						:disabled="isSubmitting"
					/>
					<lucideIcons.Mail
						class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
					/>
				</div>
				<button
					type="submit"
					:disabled="isSubmitting"
					class="w-full sm:w-auto bg-black-100 text-primary font-semibold py-3.5 px-8 rounded-lg shadow-gold hover:bg-black-100/90 hover:shadow-card-hover transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-sans text-sm"
				>
					<span
						v-if="isSubmitting"
						class="flex items-center justify-center"
					>
						<lucideIcons.Loader2
							class="h-5 w-5 animate-spin mr-2"
						/>
						Submitting...
					</span>
					<span v-else>Subscribe</span>
				</button>
			</form>

			<!-- Status Message -->
			<transition
				enter-active-class="transition-opacity duration-300"
				leave-active-class="transition-opacity duration-300"
				enter-from-class="opacity-0"
				leave-to-class="opacity-0"
			>
				<p
					v-if="statusMessage"
					class="text-sm mt-4 font-sans"
					:class="{
						'text-green-200': status === 'success',
						'text-red-200': status === 'error',
					}"
				>
					{{ statusMessage }}
				</p>
			</transition>
		</div>
	</section>
</template>

<style scoped>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

/* Custom animations (override Tailwind's slide-up for consistency) */
@keyframes slide-up {
	0% {
		opacity: 0;
		transform: translateY(20px);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-slide-up {
	animation: slide-up 0.6s ease-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
	.text-4xl {
		font-size: 2rem;
	}

	.text-lg {
		font-size: 1rem;
	}
}
</style>
