<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
    <section class="min-h-screen flex items-center justify-center bg-neutral">
        <div class="text-center space-y-6 px-4">
            <h1 class="text-8xl font-bold text-secondary">404</h1>
            <h2 class="text-2xl font-semibold text-dark">Page Not Found</h2>
            <p class="text-gray-400">The page you're looking for doesn't exist.</p>
            <button
                class="btn-primary mt-4"
                @click="router.push('/')"
            >
                Back to Home
            </button>
        </div>
    </section>
</template>
