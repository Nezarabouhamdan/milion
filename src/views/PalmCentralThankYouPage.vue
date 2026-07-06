<script setup lang="ts">
import { onMounted } from "vue";
import { useHead } from "@unhead/vue";

useHead({
    title: "Thank You | Palm Central by Nakheel",
    meta: [
        { name: "robots", content: "noindex, nofollow" },
    ],
});

onMounted(() => {
    const gtag = (window as any).gtag;
    if (typeof gtag === "function") {
        gtag("event", "conversion", {
            send_to: "AW-17153415021/AQHXCLOdkMocEO2usfM_",
            value: 1.0,
            currency: "AED",
        });
    }
});
</script>

<template>
    <div class="ty-wrap">
        <div class="ty-card">
            <div class="ty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>

            <div class="ty-rule"></div>

            <h1 class="ty-heading">Thank You</h1>
            <p class="ty-sub">Your enquiry has been received.<br>A member of our team will be in touch shortly.</p>

            <div class="ty-detail">
                <span>Palm Central Private Residences</span>
                <span class="ty-dot">·</span>
                <span>Palm Jebel Ali, Dubai</span>
            </div>

            <a href="/palm-central" class="ty-back">← Back to Palm Central</a>
        </div>

        <p class="ty-brand">
            <a href="/">Million Homes</a>
        </p>
    </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ty-wrap {
    min-height: 100dvh;
    background: #0d0b07;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
}

.ty-card {
    width: 100%;
    max-width: 440px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(196,163,90,0.28);
    border-radius: 3px;
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.4rem;
    text-align: center;
}

.ty-icon {
    width: 52px;
    height: 52px;
    color: #c4a35a;
}
.ty-icon svg { width: 100%; height: 100%; }

.ty-rule {
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c4a35a, transparent);
}

.ty-heading {
    font-family: "Playfair Display", "Marcellus", Georgia, serif;
    font-size: 2rem;
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 0.04em;
}

.ty-sub {
    font-size: 0.9rem;
    font-weight: 300;
    color: rgba(255,255,255,0.68);
    line-height: 1.7;
}

.ty-detail {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #c4a35a;
}
.ty-dot { color: rgba(196,163,90,0.5); }

.ty-back {
    margin-top: 0.4rem;
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.45);
    text-decoration: none;
    transition: color 0.2s;
}
.ty-back:hover { color: #c4a35a; }

.ty-brand {
    margin-top: 2rem;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.2);
}
.ty-brand a {
    color: inherit;
    text-decoration: none;
}
.ty-brand a:hover { color: rgba(255,255,255,0.45); }
</style>
