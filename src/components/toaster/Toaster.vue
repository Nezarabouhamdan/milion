<script setup lang="ts">
import { isVNode } from "vue";
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "../ui/toast";
import { useToast } from "../ui/toast/use-toast";
const { toasts } = useToast();
</script>

<template>
	<ToastProvider>
		<Toast
			v-for="toast in toasts"
			:key="toast.id"
			v-bind="toast"
			class="mb-2 last:mb-0 text-white"
			:class="{
				'bg-[#4BB543]': toast.variant === 'success',

				'bg-[#F87171]': toast.variant === 'error',

				'bg-[#3B82F6]': toast.variant === 'info',
			}"
		>
			<div class="grid gap-1">
				<div class="flex items-center gap-2">
					<iconify
						:icon="
							toast.variant === 'success'
								? 'lets-icons:check-fill'
								: toast.variant === 'error'
									? 'gridicons:cross-circle'
									: toast.variant === 'info'
										? 'mdi:information'
										: ''
						"
						:class="
							toast.variant === 'success'
								? 'h-5 w-5 text-white'
								: toast.variant === 'error'
									? 'h-5 w-5 text-white'
									: toast.variant === 'info'
										? 'h-5 w-5 text-white'
										: ''
						"
					/>
					<ToastTitle v-if="toast.title">
						{{ toast.title }}
					</ToastTitle>
				</div>
				<template v-if="toast.description">
					<ToastDescription v-if="isVNode(toast.description)">
						<component :is="toast.description" />
					</ToastDescription>
					<ToastDescription v-else>
						{{ toast.description }}
					</ToastDescription>
				</template>
				<ToastClose />
			</div>
			<component :is="toast.action" />
		</Toast>
		<ToastViewport
			class="fixed bottom-0 right-0 flex flex-col gap-2 p-4 w-full max-w-[400px] m-0 list-none z-[2147483647]"
		/>
	</ToastProvider>
</template>
