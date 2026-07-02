<template>
	<div
		v-if="show"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
	>
		<div
			class="bg-white rounded-2xl shadow-xl w-full max-w-lg relative overflow-hidden"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="text-xl font-semibold text-gray-900">
					{{ enquiryTitle }}
				</h2>
				<button
					@click="cancel"
					class="text-gray-400 hover:text-primary transition-colors"
				>
					<lucideIcons.X class="w-5 h-5" />
				</button>
			</div>

			<!-- Form -->
			<form @submit.prevent="submit" class="px-6 py-5 space-y-5">
				<!-- Enquiry Type buttons if no fixed -->
				<div v-if="!props.enquiryType" class="flex space-x-2">
					<button
						v-for="type in ['buy', 'sell', 'rent']"
						:key="type"
						type="button"
						@click="form.enquiry_type = type"
						:class="[
							'px-4 py-2 rounded-full text-sm font-medium border transition-all',
							form.enquiry_type === type
								? 'bg-primary text-white border-primary'
								: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
						]"
					>
						{{ type.toUpperCase() }}
					</button>
				</div>

				<!-- Name -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>Name</label
					>
					<input
						v-model="form.name"
						type="text"
						required
						class="w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary px-3 py-2"
					/>
				</div>

				<!-- Email -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>Email</label
					>
					<input
						v-model="form.email"
						type="email"
						class="w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary px-3 py-2"
					/>
				</div>

				<!-- Contact Number -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>Contact Number</label
					>
					<div class="flex space-x-2">
						<!-- Country Code Dropdown -->
						<vue-tel-input
							:defaultCountry="`AE`"
							v-model="form.phone_code"
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
						<!-- Phone Number Input -->
						<input
							v-model="form.contact_number"
							type="tel"
							required
							placeholder="Enter phone number"
							class="w-2/3 rounded-lg border border-gray-300 focus:border-primary focus:ring-primary px-3 py-2"
						/>
					</div>
				</div>

				<!-- Property Location -->
				<div v-if="showLocation">
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>Property Location</label
					>
					<input
						v-model="form.property_location"
						type="text"
						required
						class="w-full border rounded-lg border-gray-300 focus:border-primary focus:ring-primary px-3 py-2"
					/>
				</div>

				<!-- Property Type (auto-filled or selectable) -->
				<div v-if="false">
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>Property Type</label
					>
					<div v-if="props.selectedPropertyTypeId">
						<input
							:value="
								getPropertyTypeName(
									props.selectedPropertyTypeId,
								)
							"
							disabled
							class="w-full border rounded-lg border-gray-300 bg-gray-50 text-gray-700 px-3 py-2"
						/>
					</div>
					<Select v-else v-model="form.property_type_id">
						<SelectTrigger
							class="w-full border border-gray-300 bg-gray-50 focus:ring-primary focus:border-primary"
						>
							<SelectValue placeholder="Select Property Type" />
						</SelectTrigger>
						<SelectContent
							class="bg-white max-h-60 shadow rounded-lg overflow-auto"
						>
							<SelectItem
								v-for="type in propertyTypes"
								:key="type.id"
								:value="type.id"
							>
								{{ type.name }}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<!-- Message -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>Message</label
					>
					<textarea
						v-model="form.message"
						rows="3"
						class="w-full border rounded-lg border-gray-300 focus:border-primary focus:ring-primary px-3 py-2"
					></textarea>
				</div>

				<!-- Actions -->
				<div class="flex justify-end space-x-2 pt-4 border-t">
					<button
						type="button"
						@click="cancel"
						class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						:disabled="isSubmitting"
						class="px-4 py-2 rounded-lg bg-black-100 text-white hover:bg-primary/90 hover:text-black-100 hover:border hover:border-black-100 flex items-center justify-center gap-2"
					>
						<lucideIcons.Loader2
							v-if="isSubmitting"
							class="w-4 h-4 animate-spin"
						/>
						<span>{{
							isSubmitting
								? "Sending..."
								: completionStatus === "off_plan"
									? "Express Interest"
									: "Schedule Viewing"
						}}</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, nextTick } from "vue";
import { usePropertyTypeQuery } from "../../composables/usePropertyTypeQuery.ts";
import * as lucideIcons from "lucide-vue-next";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "../ui/select";

const props = defineProps<{
	show: boolean;
	enquiryType?: "buy" | "sell" | "rent" | null;
	selectedPropertyTypeId?: string | null;
	selectedPropertyId?: number | null;
	propertyId?: number | null;
	showLocation?: boolean;
	completionStatus?: "ready" | "off_plan" | null;
}>();

const emit = defineEmits(["submit", "cancel"]);
const { data: propertyTypes } = usePropertyTypeQuery();

const form = reactive({
	name: "",
	email: "",
	phone_code: "971",
	contact_number: "",
	enquiry_type: props.enquiryType ?? "",
	property_location: "",
	property_type_id: props.selectedPropertyTypeId ?? "",
	property_id: props.propertyId ?? null,
	message: "",
});

const isSubmitting = ref(false);

// Ensure the flag is displayed on mount by setting the default country
onMounted(() => {
	if (form.phone_code === "971") {
		nextTick(() => {
			form.phone_code = "971";
		});
	}
});

const enquiryTitle = computed(() => {
	if (props.completionStatus) {
		return "Express Interest";
	}

	if (props.enquiryType) {
		return `Schedule Viewing: ${props.enquiryType.toUpperCase()}`;
	}
	return "Schedule Property Viewing";
});

const getPropertyTypeName = (id: string) => {
	const type = propertyTypes.value.find((t) => t.id === id);
	return type ? type.name : id;
};

const onCountryCodeChange = (value: string, phoneData: any) => {
	if (phoneData && phoneData.dialCode) {
		form.phone_code = `+${phoneData.dialCode}`;
	}
};

const submit = async () => {
	if (!form.enquiry_type && !props.enquiryType) {
		alert("Please select enquiry type");
		return;
	}

	isSubmitting.value = true;
	try {
		emit("submit", {
			...form,
			contact_number: `${form.phone_code}${form.contact_number}`,
			enquiry_type: props.enquiryType || form.enquiry_type,
			property_id: props.propertyId || props.selectedPropertyId,
		});
	} finally {
		isSubmitting.value = false;
	}
};

const cancel = () => emit("cancel");

watch(
	() => props.show,
	(show) => {
		if (show) {
			Object.assign(form, {
				name: "",
				email: "",
				phone_code: "971",
				contact_number: "",
				enquiry_type: props.enquiryType || "",
				property_location: "",
				property_type_id: props.selectedPropertyTypeId || "",
				property_id:
					props.propertyId || props.selectedPropertyId || null,
				message: "",
			});
		}
	},
);

watch(
	() => props.selectedPropertyTypeId,
	(newVal) => {
		if (newVal) form.property_type_id = newVal;
	},
);

watch(
	() => props.propertyId,
	(newVal) => {
		if (newVal) form.property_id = newVal;
	},
);
</script>
