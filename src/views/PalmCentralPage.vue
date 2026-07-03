<script setup lang="ts">
import { ref } from "vue";

const GHL_WEBHOOK = "https://services.leadconnectorhq.com/hooks/hRYeaoSXr2HJVUM9mbzj/webhook-trigger/581684b7-84a6-4dbf-a1e5-c0f1a096324a";

const HERO_IMG   = "https://i.ibb.co/hF5CQwz5/7951f0f5-a3d0-4012-ada1-cac164e1dbfe.jpg";
const AERIAL_IMG = "https://www.nakheel.com/images/nakheelcorporatelibraries/construction-updates/palm-jebel-ali_banner1_apr-26.jpg?sfvrsn=324b30ac_1";
const AM_IMG    = "https://www.cbnme.com/wp-content/uploads/2025/10/Palm-Central-Private-Residences-2.jpg";
const GALLERY_IMGS = [
    { src: "https://framerusercontent.com/images/qnAz5nphxSbU1y3L7HZ7HCGw.jpg?width=1920&height=1084",                                                                  label: "Infinity Pool" },
    { src: "https://www.nakheel.com/images/nakheelcorporatelibraries/construction-updates/palm-jebel-ali_banner1_apr-26.jpg?sfvrsn=324b30ac_1",                         label: "Aerial View" },
    { src: "https://www.nakheel.com/images/nakheelcorporatelibraries/developments/projects/palm-central_image-03.jpg?sfvrsn=2eabbc59_1",                                label: "The Residences" },
    { src: "https://www.cbnme.com/wp-content/uploads/2025/10/Palm-Central-Private-Residences-2.jpg",                                                                    label: "Private Beach" },
    { src: "https://thepalm-jebelali.com/wp-content/uploads/2025/10/Palm-central-master-plan.jpg",                                                                      label: "Master Plan" },
    { src: "https://cdn.geniemap.net/upload/b3/e9/6d/dc/eaac0015-1334-4aea-b023-e58b0849d5b1.webp",                                                                    label: "Site Plan" },
];

const amenities = [
    {
        name: "Infinity Edge Swimming Pools",
        icon: "M2 12c1.5-3 3.5-3 5 0s3.5 3 5 0 3.5-3 5 0M2 17c1.5-3 3.5-3 5 0s3.5 3 5 0 3.5-3 5 0M18 6V4M18 4a2 2 0 10-4 0"
    },
    {
        name: "Dedicated BBQ & Dining Areas",
        icon: "M5 8h14M7 8V5h10v3M9 12h6M8 16a4 4 0 008 0M12 16v4M9 20h6"
    },
    {
        name: "Signature Yacht Club Access",
        icon: "M3 17l3.5-9L12 11l5.5-3L21 17H3zM12 11V3M2 17h20M8 17l1-3M16 17l-1-3"
    },
    {
        name: "Outdoor Beach Cinema",
        icon: "M15 10l4.55-2.55A1 1 0 0121 8.4v7.2a1 1 0 01-1.45.95L15 14M3 8h12v9H3a1 1 0 01-1-1V9a1 1 0 011-1z"
    },
];

const units = [
    { type: "1 Bedroom",       price: "£580K" },
    { type: "2 Bedroom",       price: "£925K – £1.05M" },
    { type: "3 Bedroom",       price: "£1.6M" },
    { type: "Townhouse 4 Bed", price: "£2.65M – £3.2M" },
    { type: "Townhouse 5 Bed", price: "£4.05M" },
];


const budgetOptions = [
    "£500K – £1M",
    "£1M – £2M",
    "£2M+",
];

const formData = ref({ name: "", email: "", phone: "", budget: "" });
const errors   = ref({ name: "", email: "", phone: "", budget: "" });
const isSubmitting = ref(false);
const submitted    = ref(false);

function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isValidUkPhone(v: string) {
    const c = v.replace(/[\s\-().]/g, "");
    return /^(07\d{9}|0[1-9]\d{8,9})$/.test(c);
}
function validate(): boolean {
    errors.value.name   = formData.value.name.trim().length < 2 ? "Please enter your full name."                : "";
    errors.value.email  = !isValidEmail(formData.value.email)    ? "Please enter a valid email address."        : "";
    errors.value.phone  = !isValidUkPhone(formData.value.phone)  ? "Enter a valid UK number, e.g. 07700 900000." : "";
    errors.value.budget = !formData.value.budget                 ? "Please select a budget range."              : "";
    return !errors.value.name && !errors.value.email && !errors.value.phone && !errors.value.budget;
}

async function submitForm() {
    if (!validate()) return;
    isSubmitting.value = true;
    const { name, email, phone, budget } = formData.value;
    const fullPhone = "+44" + phone.replace(/^0/, "").replace(/[\s\-().]/g, "");
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "generate_lead", form_name: "palm_central_inquiry", project: "Palm Central", developer: "Nakheel", budget });
    try {
        if (GHL_WEBHOOK !== "YOUR_GOHIGHLEVEL_WEBHOOK_URL_HERE") {
            await fetch(GHL_WEBHOOK, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName: name.trim().split(" ")[0], lastName: name.trim().split(" ").slice(1).join(" "), email: email.trim(), phone: fullPhone, customField: { budget, project: "Palm Central – Nakheel", source: "Landing Page" }, tags: ["palm-central","nakheel","website-lead"] }),
            });
        }
    } catch (e) { console.error(e); }
    isSubmitting.value = false;
    submitted.value    = true;
}
</script>

<template>
    <div class="pc">

        <!-- ══ HERO ═══════════════════════════════════════════════════════ -->
        <section class="pc-hero" id="pc-hero">
            <div class="pc-hero__bg" :style="{ backgroundImage: `url('${HERO_IMG}')` }"></div>
            <div class="pc-hero__veil"></div>

            <div class="pc-hero__body">
                <!-- Left: brand + tagline -->
                <div class="pc-hero__left">
                    <div class="pc-hero__brand">
                        <p class="pc-hero__brand-name">Palm Central by Nakheel</p>
                    </div>
                    <h1 class="pc-hero__tagline">Beachfront apartment and townhouses on Palm Jebel Ali</h1>
                </div>

                <!-- Right: glassmorphism form -->
                <div class="pc-hero__glass" id="pc-form">
                    <template v-if="!submitted">
                        <form class="pc-glass-form" @submit.prevent="submitForm" novalidate>
                            <div class="pc-glass-field">
                                <label>Full Name <span class="req">*</span></label>
                                <input
                                    v-model="formData.name"
                                    type="text"
                                    placeholder="Enter Your Full Name"
                                    :class="{ 'pc-input-error': errors.name }"
                                    @input="errors.name = ''"
                                />
                                <span v-if="errors.name" class="pc-field-error">{{ errors.name }}</span>
                            </div>
                            <div class="pc-glass-field">
                                <label>Email <span class="req">*</span></label>
                                <input
                                    v-model="formData.email"
                                    type="email"
                                    placeholder="Enter Your Email Address"
                                    :class="{ 'pc-input-error': errors.email }"
                                    @input="errors.email = ''"
                                />
                                <span v-if="errors.email" class="pc-field-error">{{ errors.email }}</span>
                            </div>
                            <div class="pc-glass-field">
                                <label>Phone Number <span class="req">*</span></label>
                                <div class="pc-phone-row" :class="{ 'pc-input-error': errors.phone }">
                                    <span class="pc-phone-prefix">+44</span>
                                    <input
                                        v-model="formData.phone"
                                        type="tel"
                                        placeholder="07700 900000"
                                        @input="errors.phone = ''"
                                    />
                                </div>
                                <span v-if="errors.phone" class="pc-field-error">{{ errors.phone }}</span>
                            </div>
                            <div class="pc-glass-field">
                                <label>Budget <span class="req">*</span></label>
                                <select v-model="formData.budget" :class="{ 'pc-input-error': errors.budget }" @change="errors.budget = ''">
                                    <option value="" disabled>Select your budget</option>
                                    <option v-for="b in budgetOptions" :key="b" :value="b">{{ b }}</option>
                                </select>
                                <span v-if="errors.budget" class="pc-field-error">{{ errors.budget }}</span>
                            </div>
                            <button type="submit" :disabled="isSubmitting">
                                {{ isSubmitting ? "Sending…" : "Submit" }}
                            </button>
                        </form>
                    </template>
                    <div v-else class="pc-glass-success">
                        <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                            <path d="M1 12l10 10L31 1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p>Thank You!</p>
                        <small>Our team will contact you within 24 hours.</small>
                    </div>
                </div>
            </div>
        </section>

        <!-- ══ ABOUT ══════════════════════════════════════════════════════ -->
        <section class="pc-about" id="pc-about">
            <div class="pc-about__left">
                <h2 class="pc-about__title">Palm Central Private Residences</h2>
                <p class="pc-about__body">
                    Palm Central Private Residences is a collection of contemporary resort-style homes across three elegant
                    buildings at the very heart of Palm Jebel Ali. Situated between Fronds M and N, its stepped form opens
                    each home to uninterrupted views of the island, from sunrise to starlight.
                </p>
                <p class="pc-about__body">
                    Each residence is an expression of serenity and connection, defined by open layouts, natural textures,
                    and a quiet prestige that reflects the essence of island life.
                </p>
                <a href="#pc-form" class="pc-about__brochure">Download Brochure</a>
            </div>
            <div class="pc-about__right">
                <img :src="AERIAL_IMG" alt="Palm Jebel Ali masterplan" />
            </div>
        </section>

        <!-- ══ STATS ROW ══════════════════════════════════════════════════ -->
        <div class="pc-stats">
            <div class="pc-stat">
                <svg class="pc-stat__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20M6 14h.01M10 14h4"/>
                </svg>
                <p class="pc-stat__value">£580,000</p>
                <p class="pc-stat__label">Starting From</p>
            </div>
            <div class="pc-stat-divider"></div>
            <div class="pc-stat">
                <svg class="pc-stat__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9M15 21V9"/>
                </svg>
                <p class="pc-stat__value">1-5 BR Apartments</p>
                <p class="pc-stat__label">Available Units</p>
            </div>
        </div>

        <!-- ══ PAYMENT PLAN ════════════════════════════════════════════════ -->
        <section class="pc-payment" id="pc-payment">
            <div class="pc-payment__inner">
                <h2 class="pc-payment__title">Payment Plan</h2>
                <div class="pc-pay-cards">
                    <div class="pc-pay-card">
                        <svg class="pc-pay-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <p class="pc-pay-card__pct">20%</p>
                        <p class="pc-pay-card__label">Down Payment</p>
                    </div>
                    <div class="pc-pay-card">
                        <svg class="pc-pay-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 21h18M9 21V7l3-4 3 4v14M5 21V11l4-2M19 21V11l-4-2"/>
                        </svg>
                        <p class="pc-pay-card__pct">50%</p>
                        <p class="pc-pay-card__label">During Construction</p>
                    </div>
                    <div class="pc-pay-card">
                        <svg class="pc-pay-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM12 12m-1 0a1 1 0 102 0 1 1 0 00-2 0"/>
                        </svg>
                        <p class="pc-pay-card__pct">30%</p>
                        <p class="pc-pay-card__label">On Construction Completion</p>
                    </div>
                </div>
                <a href="#pc-form" class="pc-pay-cta">Request Full Payment Plan</a>
            </div>
        </section>

        <!-- ══ AMENITIES ══════════════════════════════════════════════════ -->
        <section class="pc-amenities" id="pc-amenities">
            <div class="pc-am-bg" :style="{ backgroundImage: `url('${AM_IMG}')` }"></div>
            <div class="pc-am-veil"></div>
            <div class="pc-amenities__inner">
                <h2 class="pc-amenities__title">MORE THAN A DESTINATION, IT'S A STATE OF MIND</h2>
                <div class="pc-am-grid">
                    <div class="pc-am-item" v-for="am in amenities" :key="am.name">
                        <div class="pc-am-card">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                                <path :d="am.icon" />
                            </svg>
                        </div>
                        <span>{{ am.name }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ══ GALLERY ════════════════════════════════════════════════════ -->
        <section class="pc-gallery" id="pc-gallery">
            <h2 class="pc-gallery__title">Photo Gallery</h2>
            <div class="pc-gallery__grid">
                <div class="pc-gallery__item" v-for="g in GALLERY_IMGS" :key="g.label">
                    <img :src="g.src" :alt="g.label" />
                    <span class="pc-gallery__label">{{ g.label }}</span>
                </div>
            </div>
        </section>

        <!-- ══ PRICING ════════════════════════════════════════════════════ -->
        <section class="pc-pricing">
            <div class="pc-pricing__inner">
                <h2 class="pc-pricing__title">Unit Types &amp; Prices</h2>
                <div class="pc-pricing__table">
                    <div class="pc-price-row" v-for="u in units" :key="u.type">
                        <span>{{ u.type }}</span>
                        <span>{{ u.price }}</span>
                    </div>
                </div>
                <a href="#pc-form" class="pc-pricing__btn">Request Full Pricing</a>
            </div>
        </section>

        <!-- ══ REGISTER CTA ════════════════════════════════════════════════ -->
        <section class="pc-cta">
            <div class="pc-cta__bg" :style="{ backgroundImage: `url('${AERIAL_IMG}')` }"></div>
            <div class="pc-cta__veil"></div>
            <div class="pc-cta__inner">
                <p class="pc-cta__sub">Are you interested in staying informed about this property?</p>
                <a href="#pc-form" class="pc-cta__btn">Register Now</a>
            </div>
        </section>

        <!-- ══ DEVELOPER ═══════════════════════════════════════════════════ -->
        <section class="pc-dev">
            <div class="pc-dev__inner">
                <p class="pc-dev__name">NAKHEEL</p>
                <p class="pc-dev__tagline">Global Lifestyle Developer</p>
                <p class="pc-dev__body">
                    Nakheel is one of the world's leading real estate developers, responsible for some of Dubai's
                    most iconic projects. From Palm Jumeirah to Palm Jebel Ali, Nakheel continues to shape the skyline
                    and shoreline of the UAE with visionary communities designed for exceptional living.
                </p>
            </div>
        </section>

        <!-- ══ FOOTER ══════════════════════════════════════════════════════ -->
        <footer class="pc-footer">
            <p>
                <strong>Palm Central Private Residences</strong> &nbsp;·&nbsp;
                Nakheel, Palm Jebel Ali &nbsp;·&nbsp; Presented by Million Homes
            </p>
            <p class="pc-footer__disc">
                This page is for informational purposes only. All prices, areas, payment schedules, and images
                are indicative and subject to change by the developer (Nakheel) without notice.
            </p>
        </footer>

    </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Marcellus&family=Inter:wght@300;400;500;600&display=swap");

/* ── RESET & TOKENS ──────────────────────────────────────────────────────── */
.pc *, .pc *::before, .pc *::after { box-sizing: border-box; margin: 0; padding: 0; }
.pc img { max-width: 100%; display: block; }

/* kill the global gold-gradient that style.css applies to all headings */
.pc h1, .pc h2, .pc h3, .pc h4, .pc h5, .pc h6 {
    background: none !important;
    -webkit-background-clip: unset !important;
    background-clip: unset !important;
    -webkit-text-fill-color: unset !important;
    font-size: unset !important;
    font-weight: unset !important;
    line-height: unset !important;
    letter-spacing: unset !important;
    font-family: unset !important;
}

.pc {
    --white:  #FFFFFF;
    --off:    #F5F2ED;
    --line:   #E0D9CF;
    --ink:    #16130E;
    --mid:    #3A3025;
    --stone:  #7A7060;
    --gold:   #9B7B38;
    --gold-l: #B8955A;
    --teal:   #1A3D5C;

    --serif: "Marcellus", Georgia, serif;
    --sans:  "Inter", "Helvetica Neue", sans-serif;

    font-family: var(--sans);
    font-weight: 300;
    color: var(--ink);
    background: var(--white);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}

/* ── HERO ────────────────────────────────────────────────────────────────── */
.pc-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: stretch;
    overflow: hidden;
}
.pc-hero__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 45%;
    filter: brightness(0.68);
    transform: scale(1.03);
    animation: heroZoom 22s ease-out forwards;
}
@keyframes heroZoom {
    from { transform: scale(1.03); }
    to   { transform: scale(1); }
}
.pc-hero__veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to right,
        rgba(10, 8, 5, 0.30) 0%,
        rgba(10, 8, 5, 0.0)  40%,
        rgba(10, 8, 5, 0.18) 100%
    );
}
.pc-hero__body {
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4rem 6vw;
    gap: 3rem;
}

/* Hero left */
.pc-hero__left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
}
.pc-hero__brand {
    margin-bottom: 1.6rem;
}
.pc-hero__brand-name {
    font-family: var(--serif);
    font-size: clamp(1.4rem, 2.4vw, 2.2rem);
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 0.12em;
    margin-bottom: 0.4rem;
}
.pc-hero__brand-dev {
    font-size: 0.85em;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.55);
}
.pc-hero__brand-sub {
    font-size: 0.6rem;
    font-weight: 300;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
}
.pc-hero__tagline {
    font-family: var(--serif);
    font-size: clamp(2.5rem, 5.5vw, 5.5rem);
    font-weight: 400;
    color: #ffffff;
    line-height: 1.1;
    letter-spacing: 0.01em;
}
/* Right column: intro + form */
.pc-hero__right {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-shrink: 0;
}
.pc-hero__form-intro {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}
.pc-form-intro__label {
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold-l);
}
.pc-form-intro__sub {
    font-family: var(--serif);
    font-size: clamp(1rem, 1.6vw, 1.25rem);
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 0.03em;
}
.pc-form-intro__desc {
    font-size: 0.78rem;
    font-weight: 300;
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
    max-width: 34ch;
}

/* Glass form card */
.pc-hero__glass {
    width: 370px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.13);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 4px;
    padding: 2rem 1.8rem;
}

.pc-glass-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.pc-glass-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.pc-glass-field label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 0.02em;
}
.req { color: #e53e3e; margin-left: 2px; }

.pc-glass-field input,
.pc-glass-field select {
    width: 100%;
    background: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 0.78rem 1rem;
    font-family: var(--sans);
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--ink);
    outline: none;
    transition: box-shadow 0.2s;
    appearance: none;
    -webkit-appearance: none;
}
.pc-phone-row .pc-glass-field input,
.pc-phone-row input {
    padding: 0.78rem 0.85rem;
    width: auto;
}
.pc-glass-field input:focus,
.pc-glass-field select:focus {
    box-shadow: 0 0 0 2px rgba(37,99,235,0.45);
}
.pc-glass-field input::placeholder { color: rgba(22,19,14,0.35); }
.pc-glass-field select { cursor: pointer; color: rgba(22,19,14,0.45); }
.pc-glass-field select:valid { color: var(--ink); }

.pc-input-error,
.pc-phone-row.pc-input-error {
    box-shadow: 0 0 0 2px rgba(220,38,38,0.55) !important;
    border-radius: 4px;
}
.pc-field-error {
    font-size: 0.66rem;
    color: #fca5a5;
    margin-top: 3px;
    display: block;
}

.pc-phone-row {
    display: flex;
    align-items: stretch;
    background: #ffffff;
    border-radius: 4px;
    overflow: hidden;
    min-height: 44px;
}
.pc-optional {
    font-size: 0.64rem;
    font-weight: 300;
    color: rgba(255,255,255,0.42);
    margin-left: 3px;
}
.pc-phone-prefix {
    display: flex;
    align-items: center;
    padding: 0 0.9rem;
    font-size: 0.83rem;
    font-weight: 500;
    color: #444;
    border-right: 1px solid #d4d4d4;
    white-space: nowrap;
    flex-shrink: 0;
    background: #f0f0f0;
    line-height: 1;
    align-self: stretch;
}
.pc-phone-row input {
    flex: 1;
    min-width: 0;
    border-radius: 0;
    background: #ffffff;
    padding-left: 0.85rem;
    padding-top: 0;
    padding-bottom: 0;
    height: auto;
    align-self: stretch;
}
.pc-phone-row input:focus { box-shadow: none; }

.pc-glass-form button {
    width: 100%;
    padding: 0.9rem;
    background: #2563EB;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-family: var(--sans);
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 0.2rem;
}
.pc-glass-form button:hover:not(:disabled) { background: #1d4ed8; }
.pc-glass-form button:disabled { opacity: 0.55; cursor: not-allowed; }

.pc-glass-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem 0;
    text-align: center;
    color: #ffffff;
}
.pc-glass-success p {
    font-family: var(--serif);
    font-size: 1.5rem;
    color: #ffffff;
}
.pc-glass-success small {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.8;
}

/* ── ABOUT ───────────────────────────────────────────────────────────────── */
.pc-about {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    padding: 5rem 8vw;
    gap: 4rem;
    background: var(--white);
}
.pc-about__title {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 2.8vw, 2.6rem);
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 1.4rem;
    line-height: 1.2;
}
.pc-about__body {
    font-size: 0.88rem;
    line-height: 1.85;
    color: var(--stone);
    margin-bottom: 0.9rem;
    max-width: 52ch;
}
.pc-about__brochure {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.75rem 1.8rem;
    background: var(--ink);
    color: #ffffff;
    font-family: var(--sans);
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: background 0.2s;
}
.pc-about__brochure:hover { background: var(--mid); }
.pc-about__right img {
    width: 100%;
    object-fit: contain;
}

/* ── STATS ROW ───────────────────────────────────────────────────────────── */
.pc-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 8vw;
    background: var(--white);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
}
.pc-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 0 4rem;
}
.pc-stat__icon {
    width: 26px; height: 26px;
    color: var(--ink);
    margin-bottom: 0.4rem;
}
.pc-stat__value {
    font-family: var(--serif);
    font-size: clamp(1rem, 1.8vw, 1.35rem);
    font-weight: 400;
    color: var(--ink);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.pc-stat__label {
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--stone);
    letter-spacing: 0.04em;
}
.pc-stat-divider {
    width: 1px;
    height: 60px;
    background: var(--line);
    flex-shrink: 0;
}

/* ── PAYMENT ─────────────────────────────────────────────────────────────── */
.pc-payment {
    background: var(--white);
    padding: 5rem 8vw;
    border-top: 1px solid var(--line);
}
.pc-payment__inner { max-width: 860px; margin: 0 auto; text-align: center; }
.pc-payment__title {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 2.5rem;
}
.pc-pay-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    margin-bottom: 2.5rem;
}
.pc-pay-card {
    background: #f3f3f3;
    border-radius: 8px;
    padding: 2.2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
}
.pc-pay-card__icon {
    width: 28px; height: 28px;
    color: var(--ink);
    opacity: 0.6;
    margin-bottom: 0.4rem;
}
.pc-pay-card__pct {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 600;
    color: var(--ink);
    line-height: 1;
}
.pc-pay-card__label {
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--stone);
    line-height: 1.5;
    text-align: center;
}
.pc-pay-cta {
    display: inline-block;
    padding: 0.9rem 2.5rem;
    background: var(--ink);
    color: #ffffff;
    font-family: var(--sans);
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    text-decoration: none;
    border-radius: 2px;
    transition: background 0.2s;
}
.pc-pay-cta:hover { background: var(--mid); }

/* ── AMENITIES ───────────────────────────────────────────────────────────── */
.pc-amenities {
    position: relative;
    min-height: 62vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.pc-am-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 55%;
    filter: brightness(0.58);
}
.pc-am-veil {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.28);
}
.pc-amenities__inner {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 5rem 8vw;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}
.pc-amenities__title {
    font-family: var(--sans);
    font-size: clamp(0.75rem, 1.5vw, 1rem);
    font-weight: 300;
    letter-spacing: 0.22em;
    color: #ffffff;
    text-transform: uppercase;
    margin-bottom: 4rem;
}
.pc-am-grid {
    display: flex;
    justify-content: center;
    gap: 3.5rem;
    flex-wrap: wrap;
}
.pc-am-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 150px;
}
.pc-am-card {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 10px;
}
.pc-am-card svg {
    width: 28px;
    height: 28px;
    color: #ffffff;
}
.pc-am-item span {
    font-size: 0.78rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    line-height: 1.55;
    letter-spacing: 0.02em;
}

/* ── GALLERY ─────────────────────────────────────────────────────────────── */
.pc-gallery {
    padding: 5rem 6vw;
    background: var(--white);
    border-top: 1px solid var(--line);
}
.pc-gallery__title {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 2.5rem;
    text-align: center;
}
.pc-gallery__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
}
.pc-gallery__item {
    position: relative;
    overflow: hidden;
    aspect-ratio: 4/3;
}
.pc-gallery__item img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}
.pc-gallery__item:hover img { transform: scale(1.05); }
.pc-gallery__label {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(transparent, rgba(14,10,6,0.7));
    padding: 1.5rem 1rem 0.8rem;
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.85);
}

/* ── PRICING ─────────────────────────────────────────────────────────────── */
.pc-pricing {
    padding: 5rem 6vw;
    background: var(--off);
    border-top: 1px solid var(--line);
    text-align: center;
}
.pc-pricing__inner { max-width: 600px; margin: 0 auto; }
.pc-pricing__title {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 2.5rem;
}
.pc-pricing__table {
    border: 1px solid var(--line);
    background: var(--white);
    margin-bottom: 2rem;
}
.pc-price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid var(--line);
    font-size: 0.85rem;
}
.pc-price-row:last-child { border-bottom: none; }
.pc-price-row span:first-child { color: var(--stone); font-weight: 300; }
.pc-price-row span:last-child  { color: var(--teal); font-weight: 500; font-variant-numeric: tabular-nums; }
.pc-pricing__btn {
    display: inline-block;
    padding: 0.9rem 2.5rem;
    background: var(--teal);
    color: #ffffff;
    text-decoration: none;
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    transition: background 0.2s;
}
.pc-pricing__btn:hover { background: #244d72; }

/* ── REGISTER CTA ────────────────────────────────────────────────────────── */
.pc-cta {
    position: relative;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.pc-cta__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 60%;
    filter: brightness(0.35);
}
.pc-cta__veil {
    position: absolute;
    inset: 0;
    background: rgba(26, 61, 92, 0.55);
}
.pc-cta__inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 3rem;
}
.pc-cta__sub {
    font-size: 0.88rem;
    font-weight: 300;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.04em;
}
.pc-cta__btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: var(--teal);
    color: #ffffff;
    text-decoration: none;
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    white-space: nowrap;
    transition: background 0.2s;
    flex-shrink: 0;
}
.pc-cta__btn:hover { background: #244d72; }

/* ── DEVELOPER ───────────────────────────────────────────────────────────── */
.pc-dev {
    background: var(--white);
    padding: 5rem 6vw;
    border-top: 1px solid var(--line);
    text-align: center;
}
.pc-dev__inner { max-width: 600px; margin: 0 auto; }
.pc-dev__name {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 400;
    color: var(--ink);
    letter-spacing: 0.18em;
    margin-bottom: 0.4rem;
}
.pc-dev__tagline {
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--stone);
    margin-bottom: 1.8rem;
}
.pc-dev__body {
    font-size: 0.88rem;
    line-height: 1.9;
    color: var(--stone);
}

/* ── FOOTER ──────────────────────────────────────────────────────────────── */
.pc-footer {
    background: var(--ink);
    padding: 2.5rem 6vw;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    flex-wrap: wrap;
    border-top: 1px solid rgba(255,255,255,0.06);
}
.pc-footer p:first-child {
    font-size: 0.6rem;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    line-height: 2;
}
.pc-footer p:first-child strong { color: rgba(255,255,255,0.6); font-weight: 400; }
.pc-footer__disc {
    font-size: 0.52rem;
    color: rgba(255,255,255,0.14);
    max-width: 55ch;
    line-height: 1.85;
}

/* ── RESPONSIVE ──────────────────────────────────────────────────────────── */
@media (max-width: 960px) {
    .pc-hero__body { flex-direction: column; padding: 3rem 6vw 4rem; align-items: flex-start; }
    .pc-hero__form-wrap { width: 100%; box-shadow: none; }
    .pc-about { grid-template-columns: 1fr; gap: 3rem; padding: 4rem 6vw; }
    .pc-about__img img { height: 260px; }
    .pc-about__stats { flex-wrap: wrap; gap: 1.5rem; }
    .pc-am-grid { grid-template-columns: repeat(3, 1fr); }
    .pc-am-item:nth-child(6n) { border-right: 1px solid rgba(255,255,255,0.1); }
    .pc-am-item:nth-child(3n) { border-right: none; }
    .pc-am-item:nth-last-child(-n+6) { border-bottom: 1px solid rgba(255,255,255,0.1); }
    .pc-am-item:nth-last-child(-n+3) { border-bottom: none; }
    .pc-gallery__grid { grid-template-columns: repeat(2, 1fr); }
    .pc-cta__inner { flex-direction: column; gap: 1.5rem; text-align: center; padding: 0 2rem; }
    .pc-footer { flex-direction: column; }
}

@media (max-width: 540px) {
    .pc-hero__tagline { font-size: clamp(2.8rem, 16vw, 4.5rem); }
    .pc-gallery__grid { grid-template-columns: 1fr; }
    .pc-am-grid { grid-template-columns: repeat(2, 1fr); }
    .pc-am-item:nth-child(3n) { border-right: 1px solid rgba(255,255,255,0.1); }
    .pc-am-item:nth-child(2n) { border-right: none; }
}

@media (prefers-reduced-motion: reduce) {
    .pc-hero__bg { animation: none; }
}
</style>
