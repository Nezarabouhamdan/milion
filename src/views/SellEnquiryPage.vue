<template>
	<section
		class="min-h-screen bg-gradient-to-br from-primary/10 via-white to-white flex items-center justify-center py-16 px-4"
	>
		<div
			class="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 space-y-8"
		>
			<!-- HEADER -->
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h2 class="text-3xl font-bold text-gray-900">
						Sell Your Property
					</h2>
					<lucideIcons.Home class="w-8 h-8 text-primary" />
				</div>
				<p class="text-gray-600 text-sm">
					Fill out the form below to start selling your property
					quickly and easily.
				</p>
				<div class="border-t border-gray-200 mt-4"></div>
			</div>

			<!-- FORM -->
			<form
				@submit.prevent="submit"
				class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
			>
				<!-- LEFT: PERSONAL INFO -->
				<div class="space-y-5">
					<h3
						class="text-lg font-semibold text-gray-800 flex items-center gap-2"
					>
						<lucideIcons.User class="w-5 h-5 text-primary" />
						Personal Information
					</h3>

					<!-- NAME -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Name <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<lucideIcons.User
								class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								v-model="form.name"
								type="text"
								required
								placeholder="John Doe"
								class="w-full h-11 rounded-lg pl-10 pr-4 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
							/>
						</div>
					</div>

					<!-- EMAIL -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Email
						</label>
						<div class="relative">
							<lucideIcons.Mail
								class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								v-model="form.email"
								type="email"
								placeholder="you@example.com"
								class="w-full h-11 rounded-lg pl-10 pr-4 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
							/>
						</div>
					</div>

					<!-- CONTACT -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Contact Number <span class="text-red-500">*</span>
						</label>
						<div class="flex space-x-2">
							<vue-tel-input
								v-model="form.phone_code"
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
								v-model="form.contact_number"
								type="tel"
								required
								placeholder="    Enter phone number"
								class="w-2/3 h-11 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
							/>
						</div>
					</div>
				</div>

				<!-- RIGHT: PROPERTY INFO -->
				<div class="space-y-5">
					<h3
						class="text-lg font-semibold text-gray-800 flex items-center gap-2"
					>
						<lucideIcons.Home class="w-5 h-5 text-primary" />
						Property Details
					</h3>

					<!-- LOCATION -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Property Location
							<span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<lucideIcons.MapPin
								class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								v-model="form.property_location"
								type="text"
								required
								placeholder="Dubai Marina"
								class="w-full h-11 rounded-lg pl-10 pr-4 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
							/>
						</div>
					</div>

					<!-- PROPERTY TYPE -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Property Type
						</label>
						<Select v-model="form.property_type_id">
							<SelectTrigger
								class="w-full h-11 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary/20 focus:border-primary px-4 text-sm"
							>
								<SelectValue
									placeholder="Select Property Type"
								/>
							</SelectTrigger>
							<SelectContent
								class="bg-white max-h-60 shadow-lg rounded-lg overflow-auto border border-gray-200"
							>
								<SelectItem
									v-for="type in propertyTypes?.filter(
										(type) => type?.slug != 'holiday-homes',
									)"
									:key="type.id"
									:value="type.id"
									class="px-4 py-2 hover:bg-gray-50 text-sm"
								>
									{{ type.name }}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<!-- MESSAGE -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Message
						</label>
						<textarea
							v-model="form.message"
							rows="4"
							placeholder="Tell us about your property..."
							class="w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 px-4 py-2.5 text-sm resize-none"
						></textarea>
					</div>
				</div>

				<!-- SUBMIT (full width across grid) -->
				<div class="md:col-span-2 pt-2">
					<button
						type="submit"
						:disabled="isSubmitting"
						class="w-full h-12 rounded-lg bg-black-100 text-white text-base font-semibold hover:bg-black-100/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<lucideIcons.Loader2
							v-if="isSubmitting"
							class="w-5 h-5 animate-spin"
						/>
						<span>{{
							isSubmitting ? "Submitting..." : "Submit Enquiry"
						}}</span>
					</button>
				</div>
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import * as lucideIcons from "lucide-vue-next";
import { usePropertyTypeQuery } from "../composables/usePropertyTypeQuery";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "../components/ui/select";
import { enquireForSelling } from "../api/enquiry/api";
import { useToast } from "../composables/useToast";

const { data: propertyTypes } = usePropertyTypeQuery();
const toast = useToast();

const form = reactive({
	name: "",
	email: "",
	phone_code: "971",
	contact_number: "",
	enquiry_type: "sell",
	property_location: "",
	property_type_id: "",
	message: "",
});

const isSubmitting = ref(false);

// Ensure flag is displayed on mount
onMounted(() => {
	form.phone_code = "971"; // Trigger reactivity for form
});

// Handle country code change
const onCountryCodeChange = (value: string, phoneData: any) => {
	if (phoneData && phoneData.dialCode) {
		form.phone_code = `+${phoneData.dialCode}`;
	}
};

const submit = async () => {
	isSubmitting.value = true;
	try {
		const payload = {
			...form,
			contact_number: `${form.phone_code}${form.contact_number}`,
		};
		const success = await enquireForSelling(payload);
		if (success) {
			toast.showToast("Enquiry submitted successfully!", "success");
			Object.assign(form, {
				name: "",
				email: "",
				phone_code: "971",
				contact_number: "",
				property_location: "",
				property_type_id: "",
				message: "",
			});
		}
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<style scoped>
/* Ensure consistent focus ring styles */
input:focus,
textarea:focus,
select:focus {
	outline: none;
}

/* Improve vue-tel-input styling */
:deep(.vue-tel-input) {
	display: flex;
	align-items: center;
}

:deep(.vue-tel-input .vti__input) {
	border: none !important;
	background: transparent;
	width: 100%;
}

:deep(.vue-tel-input .vti__dropdown) {
	padding-left: 0.5rem;
}
</style>
