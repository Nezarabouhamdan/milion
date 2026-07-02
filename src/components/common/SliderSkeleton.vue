<template>
	<div
		class="relative h-[30vh] md:h-[80vh] overflow-hidden bg-gray-200 animate-pulse"
	>
		<div
			class="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex justify-center items-center"
		>
			<div class="container">
				<div class="max-w-2xl space-y-4">
					<div class="h-6 w-40 bg-white/50 rounded"></div>
					<div class="h-12 w-3/4 bg-white/50 rounded"></div>
					<div class="h-4 w-2/3 bg-white/50 rounded"></div>
					<div class="flex gap-4">
						<div class="h-10 w-32 bg-white/50 rounded"></div>
						<div class="h-10 w-32 bg-white/50 rounded"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>
