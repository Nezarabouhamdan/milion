<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';

const route = useRoute();
const showLayout = computed(() => !route.meta?.noLayout);
</script>

<template>
    <div class="">
        <Header v-if="showLayout"></Header>
        <div class="">
          <slot></slot>
        </div>
        <Footer v-if="showLayout"></Footer>
    </div>
</template>
