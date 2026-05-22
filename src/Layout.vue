<script setup lang="ts">
	import Header from './components/layout/Header.vue';
	import Footer from './components/layout/Footer.vue';
</script>

<template>
    <div class="">
        <Header></Header>
        <div class="">
          <slot></slot>
        </div>
        <Footer></Footer>
    </div>
</template>
