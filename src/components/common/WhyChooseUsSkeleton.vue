<template>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-10 items-start">
		<div
			v-for="index in 4"
			:key="index"
			class="flex flex-col items-center space-y-3 animate-pulse"
		>
			<!-- Icon placeholder -->
			<div class="w-12 h-12 rounded-full bg-white/30"></div>

			<!-- Text placeholder -->
			<div class="w-24 h-4 rounded bg-white/30"></div>
		</div>
	</div>
</template>
