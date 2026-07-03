<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useHead } from "@unhead/vue";

const GHL_WEBHOOK = "https://services.leadconnectorhq.com/hooks/hRYeaoSXr2HJVUM9mbzj/webhook-trigger/581684b7-84a6-4dbf-a1e5-c0f1a096324a";

const HERO_IMG   = "https://www.nakheel.com/images/nakheelcorporatelibraries/developments/projects/palm-central_image-03.jpg?sfvrsn=2eabbc59_1";
const AERIAL_IMG = "https://www.nakheel.com/images/nakheelcorporatelibraries/construction-updates/palm-jebel-ali_banner1_apr-26.jpg?sfvrsn=324b30ac_1";
const AM_IMG     = "https://www.cbnme.com/wp-content/uploads/2025/10/Palm-Central-Private-Residences-2.jpg";

const GALLERY_IMGS = [
    { src: "https://framerusercontent.com/images/qnAz5nphxSbU1y3L7HZ7HCGw.jpg?width=1920&height=1084",                                               label: "Infinity Pool"  },
    { src: "https://www.nakheel.com/images/nakheelcorporatelibraries/construction-updates/palm-jebel-ali_banner1_apr-26.jpg?sfvrsn=324b30ac_1",      label: "Aerial View"    },
    { src: "https://www.nakheel.com/images/nakheelcorporatelibraries/developments/projects/palm-central_image-03.jpg?sfvrsn=2eabbc59_1",             label: "The Residences" },
    { src: "https://www.cbnme.com/wp-content/uploads/2025/10/Palm-Central-Private-Residences-2.jpg",                                                 label: "Private Beach"  },
    { src: "https://www.nakheel.com/images/nakheelcorporatelibraries/developments/projects/palm-central_image-05.jpg?sfvrsn=704f0022_1",             label: "Master Plan"    },
    { src: "https://www.nakheel.com/images/nakheelcorporatelibraries/developments/projects/palm-central_image-03.jpg?sfvrsn=2eabbc59_1",             label: "Site Plan"      },
];

const amenities = [
    { name: "Infinity Edge Swimming Pools", icon: "M2 12c1.5-3 3.5-3 5 0s3.5 3 5 0 3.5-3 5 0M2 17c1.5-3 3.5-3 5 0s3.5 3 5 0 3.5-3 5 0M18 6V4M18 4a2 2 0 10-4 0" },
    { name: "Dedicated BBQ & Dining Areas", icon: "M5 8h14M7 8V5h10v3M9 12h6M8 16a4 4 0 008 0M12 16v4M9 20h6" },
    { name: "Signature Yacht Club Access",  icon: "M3 17l3.5-9L12 11l5.5-3L21 17H3zM12 11V3M2 17h20M8 17l1-3M16 17l-1-3" },
    { name: "Outdoor Beach Cinema",         icon: "M15 10l4.55-2.55A1 1 0 0121 8.4v7.2a1 1 0 01-1.45.95L15 14M3 8h12v9H3a1 1 0 01-1-1V9a1 1 0 011-1z" },
];

const units = [
    { type: "1 Bedroom",       price: "£580K"            },
    { type: "2 Bedroom",       price: "£925K – £1.05M"   },
    { type: "3 Bedroom",       price: "£1.6M"             },
    { type: "Townhouse 4 Bed", price: "£2.65M – £3.2M"   },
    { type: "Townhouse 5 Bed", price: "£4.05M"            },
];

const budgetOptions = ["£500K – £1M", "£1M – £2M", "£2M+"];

const formData     = ref({ name: "", email: "", phone: "", budget: "" });
const errors       = ref({ name: "", email: "", phone: "", budget: "" });
const isSubmitting = ref(false);
const submitted    = ref(false);
const pcContainer  = ref<HTMLElement | null>(null);

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
function isValidUkPhone(v: string) {
    return /^(07\d{9}|0[1-9]\d{8,9})$/.test(v.replace(/[\s\-().]/g, ""));
}
function validate(): boolean {
    errors.value.name   = formData.value.name.trim().length < 2 ? "Please enter your full name."                 : "";
    errors.value.email  = !isValidEmail(formData.value.email)   ? "Please enter a valid email address."         : "";
    errors.value.phone  = !isValidUkPhone(formData.value.phone) ? "Enter a valid UK number, e.g. 07700 900000." : "";
    errors.value.budget = !formData.value.budget                ? "Please select a budget range."               : "";
    return !errors.value.name && !errors.value.email && !errors.value.phone && !errors.value.budget;
}

async function submitForm() {
    if (!validate()) return;
    isSubmitting.value = true;
    const { name, email, phone, budget } = formData.value;
    const fullPhone = "+44" + phone.replace(/^0/, "").replace(/[\s\-().]/g, "");
    try {
        if (GHL_WEBHOOK !== "YOUR_GOHIGHLEVEL_WEBHOOK_URL_HERE") {
            await fetch(GHL_WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: name.trim().split(" ")[0],
                    lastName:  name.trim().split(" ").slice(1).join(" "),
                    email:     email.trim(),
                    phone:     fullPhone,
                    customField: { budget, project: "Palm Central – Nakheel", source: "Landing Page" },
                    tags: ["palm-central", "nakheel", "website-lead"],
                }),
            });
        }
    } catch (e) { console.error(e); }
    // Redirect to Thank You page — GTM tracks this as a Page View conversion
    window.location.href = "/palm-central/thank-you";
}

/* ── SEO ────────────────────────────────────────────────────────────────── */
useHead({
    title: "Palm Central by Nakheel | Luxury Beachfront Residences on Palm Jebel Ali",
    meta: [
        { name: "description",       content: "Exclusive beachfront apartments and townhouses on Palm Jebel Ali by Nakheel. 1–5 bedroom residences from £580,000. Register your interest — presented by Million Homes for UK investors." },
        { name: "keywords",          content: "Palm Central Nakheel, Palm Jebel Ali apartments, Dubai beachfront property, luxury Dubai real estate, off-plan Dubai investment, UK investors Dubai, Nakheel residences, Palm Jebel Ali townhouses" },
        { property: "og:type",        content: "website" },
        { property: "og:title",       content: "Palm Central by Nakheel | Luxury Beachfront Residences" },
        { property: "og:description", content: "Exclusive beachfront apartments & townhouses from £580,000 on Palm Jebel Ali. Presented by Million Homes." },
        { property: "og:image",       content: "https://www.nakheel.com/images/nakheelcorporatelibraries/developments/projects/palm-central_image-03.jpg?sfvrsn=2eabbc59_1" },
        { property: "og:url",         content: "https://millionhomes.ae/palm-central" },
        { property: "og:locale",      content: "en_GB" },
        { property: "og:site_name",   content: "Million Homes" },
        { name: "twitter:card",        content: "summary_large_image" },
        { name: "twitter:title",       content: "Palm Central by Nakheel | From £580,000 on Palm Jebel Ali" },
        { name: "twitter:description", content: "Beachfront apartments & townhouses on Palm Jebel Ali, Dubai. Tailored for UK investors." },
        { name: "twitter:image",       content: "https://www.nakheel.com/images/nakheelcorporatelibraries/developments/projects/palm-central_image-03.jpg?sfvrsn=2eabbc59_1" },
        { name: "robots",              content: "index, follow" },
        { name: "geo.region",          content: "AE-DU" },
        { name: "geo.placename",       content: "Palm Jebel Ali, Dubai, UAE" },
        { name: "geo.position",        content: "24.9938;55.0098" },
    ],
    link: [
        { rel: "canonical", href: "https://millionhomes.ae/palm-central" },
    ],
    script: [{
        type: "application/ld+json",
        innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Residence",
            name: "Palm Central Private Residences",
            description: "Exclusive beachfront apartments and townhouses on Palm Jebel Ali, Dubai, by Nakheel.",
            url: "https://millionhomes.ae/palm-central",
            image: HERO_IMG,
            address: { "@type": "PostalAddress", streetAddress: "Palm Jebel Ali", addressLocality: "Dubai", addressCountry: "AE" },
            geo: { "@type": "GeoCoordinates", latitude: 24.9938, longitude: 55.0098 },
            offers: {
                "@type": "AggregateOffer",
                priceCurrency: "GBP",
                lowPrice: "580000",
                highPrice: "4050000",
                offerCount: "5",
                availability: "https://schema.org/InStock",
            },
            amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Infinity Edge Pools",   value: true },
                { "@type": "LocationFeatureSpecification", name: "Yacht Club Access",      value: true },
                { "@type": "LocationFeatureSpecification", name: "Beach Cinema",           value: true },
                { "@type": "LocationFeatureSpecification", name: "BBQ & Dining Areas",    value: true },
            ],
        }),
    }],
});

/* ── SCROLL REVEAL ──────────────────────────────────────────────────────── */
onMounted(() => {
    if (!pcContainer.value) return;
    const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
            if (e.isIntersecting) {
                (e.target as HTMLElement).classList.add("pc-visible");
                io.unobserve(e.target);
            }
        }),
        { threshold: 0.12 }
    );
    pcContainer.value.querySelectorAll(".pc-animate").forEach((el) => io.observe(el));
});
</script>

<template>
    <div class="pc" ref="pcContainer">

        <!-- ══ HERO ═══════════════════════════════════════════════════════ -->
        <section class="pc-hero" id="pc-hero" aria-label="Palm Central hero">
            <img class="pc-hero__bg" :src="HERO_IMG" alt="Palm Central Private Residences – beachfront exterior" fetchpriority="high" decoding="async" width="1920" height="1080" />
            <div class="pc-hero__veil"></div>

            <div class="pc-hero__body">
                <div class="pc-hero__left">
                    <span class="pc-hero__eyebrow">Exclusively Presented by Million Homes</span>
                    <p class="pc-hero__brand-name">Palm Central by Nakheel</p>
                    <div class="pc-hero__gold-rule" aria-hidden="true"></div>
                    <h1 class="pc-hero__tagline">Beachfront apartment and townhouses on Palm Jebel Ali</h1>
                    <p class="pc-hero__sub">From <strong>£580,000</strong> &nbsp;·&nbsp; 1–5 Bedroom Residences</p>
                    <a href="#pc-form" class="pc-hero__outline-btn">Register Interest</a>
                </div>

                <div class="pc-hero__glass" id="pc-form" aria-label="Enquiry form">
                    <template v-if="!submitted">
                        <p class="pc-glass-title">Register Your Interest</p>
                        <form class="pc-glass-form" @submit.prevent="submitForm" novalidate>
                            <div class="pc-glass-field">
                                <label for="pc-name">Full Name <span class="req" aria-label="required">*</span></label>
                                <input id="pc-name" v-model="formData.name" type="text" autocomplete="name"
                                    placeholder="Enter Your Full Name"
                                    :class="{ 'pc-input-error': errors.name }"
                                    @input="errors.name = ''"
                                    :aria-invalid="!!errors.name" />
                                <span v-if="errors.name" class="pc-field-error" role="alert">{{ errors.name }}</span>
                            </div>
                            <div class="pc-glass-field">
                                <label for="pc-email">Email <span class="req" aria-label="required">*</span></label>
                                <input id="pc-email" v-model="formData.email" type="email" autocomplete="email"
                                    placeholder="Enter Your Email Address"
                                    :class="{ 'pc-input-error': errors.email }"
                                    @input="errors.email = ''"
                                    :aria-invalid="!!errors.email" />
                                <span v-if="errors.email" class="pc-field-error" role="alert">{{ errors.email }}</span>
                            </div>
                            <div class="pc-glass-field">
                                <label for="pc-phone">Phone Number <span class="req" aria-label="required">*</span></label>
                                <div class="pc-phone-row" :class="{ 'pc-input-error': errors.phone }">
                                    <span class="pc-phone-prefix">+44</span>
                                    <input id="pc-phone" v-model="formData.phone" type="tel" autocomplete="tel"
                                        placeholder="07700 900000"
                                        @input="errors.phone = ''"
                                        :aria-invalid="!!errors.phone" />
                                </div>
                                <span v-if="errors.phone" class="pc-field-error" role="alert">{{ errors.phone }}</span>
                            </div>
                            <div class="pc-glass-field">
                                <label for="pc-budget">Budget <span class="req" aria-label="required">*</span></label>
                                <select id="pc-budget" v-model="formData.budget"
                                    :class="{ 'pc-input-error': errors.budget }"
                                    @change="errors.budget = ''"
                                    :aria-invalid="!!errors.budget">
                                    <option value="" disabled>Select your budget</option>
                                    <option v-for="b in budgetOptions" :key="b" :value="b">{{ b }}</option>
                                </select>
                                <span v-if="errors.budget" class="pc-field-error" role="alert">{{ errors.budget }}</span>
                            </div>
                            <button type="submit" :disabled="isSubmitting">
                                <span v-if="!isSubmitting">Submit Enquiry &rarr;</span>
                                <span v-else class="pc-btn-loader" aria-label="Sending"></span>
                            </button>
                        </form>
                    </template>
                    <div v-else class="pc-glass-success" role="status" aria-live="polite">
                        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden="true">
                            <path d="M1 12l10 10L31 1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p>Thank You!</p>
                        <small>Our team will contact you within 24 hours.</small>
                    </div>
                </div>
            </div>

            <div class="pc-hero__scroll" aria-hidden="true">
                <div class="pc-hero__scroll-line"></div>
            </div>
        </section>

        <!-- ══ ABOUT ══════════════════════════════════════════════════════ -->
        <section class="pc-about" id="pc-about" aria-labelledby="pc-about-title">
            <div class="pc-about__left pc-animate">
                <span class="pc-eyebrow">About The Development</span>
                <h2 class="pc-about__title" id="pc-about-title">Palm Central Private Residences</h2>
                <div class="pc-gold-rule" aria-hidden="true"></div>
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
            <div class="pc-about__right pc-animate pc-animate--d2">
                <img :src="AERIAL_IMG" alt="Aerial masterplan view of Palm Jebel Ali" loading="lazy" decoding="async" width="1200" height="800" />
            </div>
        </section>

        <!-- ══ STATS ROW ══════════════════════════════════════════════════ -->
        <div class="pc-stats" role="list">
            <div class="pc-stat pc-animate" role="listitem">
                <svg class="pc-stat__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20M6 14h.01M10 14h4"/>
                </svg>
                <p class="pc-stat__value">£580,000</p>
                <p class="pc-stat__label">Starting From</p>
            </div>
            <div class="pc-stat-divider" aria-hidden="true"></div>
            <div class="pc-stat pc-animate pc-animate--d1" role="listitem">
                <svg class="pc-stat__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9M15 21V9"/>
                </svg>
                <p class="pc-stat__value">1–5 Bedroom</p>
                <p class="pc-stat__label">Available Unit Types</p>
            </div>
            <div class="pc-stat-divider" aria-hidden="true"></div>
            <div class="pc-stat pc-animate pc-animate--d2" role="listitem">
                <svg class="pc-stat__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <p class="pc-stat__value">20 / 50 / 30</p>
                <p class="pc-stat__label">Payment Plan</p>
            </div>
        </div>

        <!-- ══ PAYMENT PLAN ════════════════════════════════════════════════ -->
        <section class="pc-payment" id="pc-payment" aria-labelledby="pc-payment-title">
            <div class="pc-payment__inner">
                <span class="pc-eyebrow pc-animate">Flexible Finance</span>
                <h2 class="pc-payment__title pc-animate" id="pc-payment-title">Payment Plan</h2>
                <div class="pc-gold-rule pc-gold-rule--center pc-animate" aria-hidden="true"></div>
                <div class="pc-pay-cards">
                    <div class="pc-pay-card pc-animate">
                        <svg class="pc-pay-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <p class="pc-pay-card__pct">20%</p>
                        <p class="pc-pay-card__label">Down Payment</p>
                    </div>
                    <div class="pc-pay-card pc-animate pc-animate--d1">
                        <svg class="pc-pay-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M3 21h18M9 21V7l3-4 3 4v14M5 21V11l4-2M19 21V11l-4-2"/>
                        </svg>
                        <p class="pc-pay-card__pct">50%</p>
                        <p class="pc-pay-card__label">During Construction</p>
                    </div>
                    <div class="pc-pay-card pc-animate pc-animate--d2">
                        <svg class="pc-pay-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM12 12m-1 0a1 1 0 102 0 1 1 0 00-2 0"/>
                        </svg>
                        <p class="pc-pay-card__pct">30%</p>
                        <p class="pc-pay-card__label">On Handover</p>
                    </div>
                </div>
                <a href="#pc-form" class="pc-pay-cta pc-animate">Request Full Payment Plan</a>
            </div>
        </section>

        <!-- ══ AMENITIES ══════════════════════════════════════════════════ -->
        <section class="pc-amenities" id="pc-amenities" aria-labelledby="pc-amenities-title">
            <div class="pc-am-bg" :style="{ backgroundImage: `url('${AM_IMG}')` }" role="img" aria-label="Palm Central resort amenities"></div>
            <div class="pc-am-veil"></div>
            <div class="pc-amenities__inner">
                <span class="pc-eyebrow pc-eyebrow--light pc-animate">World-Class Living</span>
                <h2 class="pc-amenities__title pc-animate" id="pc-amenities-title">More Than a Destination,<br>It's a State of Mind</h2>
                <div class="pc-gold-rule pc-gold-rule--center pc-animate" aria-hidden="true"></div>
                <div class="pc-am-grid" role="list">
                    <div class="pc-am-item pc-animate" v-for="(am, i) in amenities" :key="am.name"
                         :class="`pc-animate--d${i}`" role="listitem">
                        <div class="pc-am-card" aria-hidden="true">
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
        <section class="pc-gallery" id="pc-gallery" aria-labelledby="pc-gallery-title">
            <span class="pc-eyebrow pc-animate">Visual Journey</span>
            <h2 class="pc-gallery__title pc-animate" id="pc-gallery-title">Photo Gallery</h2>
            <div class="pc-gold-rule pc-gold-rule--center pc-animate" aria-hidden="true"></div>
            <div class="pc-gallery__grid">
                <figure class="pc-gallery__item pc-animate" v-for="(g, i) in GALLERY_IMGS" :key="g.label"
                        :class="`pc-animate--d${Math.min(i, 3)}`">
                    <img :src="g.src" :alt="`Palm Central – ${g.label}`" loading="lazy" decoding="async" width="800" height="600" />
                    <figcaption class="pc-gallery__label">{{ g.label }}</figcaption>
                </figure>
            </div>
        </section>

        <!-- ══ PRICING ════════════════════════════════════════════════════ -->
        <section class="pc-pricing" aria-labelledby="pc-pricing-title">
            <div class="pc-pricing__inner">
                <span class="pc-eyebrow pc-animate">Transparent Pricing</span>
                <h2 class="pc-pricing__title pc-animate" id="pc-pricing-title">Unit Types &amp; Prices</h2>
                <div class="pc-gold-rule pc-gold-rule--center pc-animate" aria-hidden="true"></div>
                <div class="pc-pricing__table" role="table" aria-label="Unit types and prices">
                    <div class="pc-price-row pc-animate" v-for="(u, i) in units" :key="u.type"
                         :class="`pc-animate--d${Math.min(i, 4)}`" role="row">
                        <span role="cell">{{ u.type }}</span>
                        <span role="cell">{{ u.price }}</span>
                    </div>
                </div>
                <a href="#pc-form" class="pc-pricing__btn pc-animate">Request Full Pricing</a>
            </div>
        </section>

        <!-- ══ REGISTER CTA ════════════════════════════════════════════════ -->
        <section class="pc-cta" aria-label="Register interest call to action">
            <div class="pc-cta__bg" :style="{ backgroundImage: `url('${AERIAL_IMG}')` }" role="img" aria-label="Palm Jebel Ali aerial view"></div>
            <div class="pc-cta__veil"></div>
            <div class="pc-cta__inner pc-animate">
                <p class="pc-cta__sub">Secure your beachfront residence on Palm Jebel Ali today.</p>
                <a href="#pc-form" class="pc-cta__btn">Register Now &rarr;</a>
            </div>
        </section>

        <!-- ══ DEVELOPER ═══════════════════════════════════════════════════ -->
        <section class="pc-dev" aria-labelledby="pc-dev-name">
            <div class="pc-dev__inner pc-animate">
                <span class="pc-eyebrow">The Developer</span>
                <p class="pc-dev__name" id="pc-dev-name">NAKHEEL</p>
                <div class="pc-gold-rule pc-gold-rule--center" aria-hidden="true"></div>
                <p class="pc-dev__tagline">Global Lifestyle Developer</p>
                <p class="pc-dev__body">
                    Nakheel is one of the world's leading real estate developers, responsible for some of Dubai's
                    most iconic projects. From Palm Jumeirah to Palm Jebel Ali, Nakheel continues to shape the skyline
                    and shoreline of the UAE with visionary communities designed for exceptional living.
                </p>
            </div>
        </section>

        <!-- ══ FOOTER ══════════════════════════════════════════════════════ -->
        <footer class="pc-footer" role="contentinfo">
            <p>
                <strong>Palm Central Private Residences</strong> &nbsp;·&nbsp;
                Nakheel, Palm Jebel Ali &nbsp;·&nbsp; Presented by Million Homes
            </p>
            <p class="pc-footer__disc">
                This page is for informational purposes only. All prices, areas, payment schedules, and images
                are indicative and subject to change by the developer (Nakheel) without notice.
            </p>
        </footer>

        <!-- ══ MOBILE STICKY CTA ════════════════════════════════════════════ -->
        <div class="pc-sticky-cta" aria-label="Quick enquiry">
            <a href="#pc-form" class="pc-sticky-cta__btn">Register Your Interest</a>
        </div>

    </div>
</template>

<style>
/* ── RESET ───────────────────────────────────────────────────────────────── */
.pc *, .pc *::before, .pc *::after { box-sizing: border-box; margin: 0; padding: 0; }
.pc img { max-width: 100%; display: block; }

.pc h1, .pc h2, .pc h3, .pc h4, .pc h5, .pc h6 {
    background: none !important; -webkit-background-clip: unset !important;
    background-clip: unset !important; -webkit-text-fill-color: unset !important;
    font-size: unset !important; font-weight: unset !important;
    line-height: unset !important; letter-spacing: unset !important; font-family: unset !important;
}

/* ── TOKENS ──────────────────────────────────────────────────────────────── */
.pc {
    --white:  #FDFCFA;
    --off:    #F8F5EF;
    --line:   #E5DDD0;
    --ink:    #120F0A;
    --mid:    #2E2417;
    --stone:  #6B5E4D;
    --gold:   #9B7B38;
    --gold-l: #C4A35A;
    --gold-d: #7A6028;
    --teal:   #1A3D5C;
    --cream:  #F2EDE3;

    --serif: "Marcellus", "Playfair Display", Georgia, serif;
    --sans:  "Inter", "Helvetica Neue", sans-serif;

    font-family: var(--sans);
    font-weight: 300;
    color: var(--ink);
    background: var(--white);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}

/* ── SCROLL REVEAL ───────────────────────────────────────────────────────── */
.pc-animate {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
}
.pc-animate.pc-visible   { opacity: 1; transform: translateY(0); }
.pc-animate--d1 { transition-delay: 0.12s; }
.pc-animate--d2 { transition-delay: 0.22s; }
.pc-animate--d3 { transition-delay: 0.34s; }
.pc-animate--d4 { transition-delay: 0.46s; }

/* ── SHARED DECORATORS ───────────────────────────────────────────────────── */
.pc-eyebrow {
    display: block;
    font-family: var(--sans);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.75rem;
}
.pc-eyebrow--light { color: var(--gold-l); }

.pc-gold-rule {
    width: 44px;
    height: 1px;
    background: linear-gradient(90deg, var(--gold-d), var(--gold-l));
    margin-bottom: 1.8rem;
    position: relative;
    overflow: hidden;
}
.pc-gold-rule--center { margin-left: auto; margin-right: auto; }
.pc-gold-rule::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
    animation: goldShimmer 3s ease-in-out infinite;
}
@keyframes goldShimmer {
    0%   { transform: translateX(-150%); }
    100% { transform: translateX(250%); }
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
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center 45%;
    filter: brightness(0.62);
    transform: scale(1.04);
    animation: heroZoom 22s ease-out forwards;
    will-change: transform;
}
@keyframes heroZoom {
    from { transform: scale(1.04); }
    to   { transform: scale(1); }
}
.pc-hero__veil {
    position: absolute; inset: 0;
    background:
        linear-gradient(to bottom, rgba(10,8,5,0.22) 0%, rgba(10,8,5,0) 35%, rgba(10,8,5,0.45) 100%),
        linear-gradient(to right,  rgba(10,8,5,0.42) 0%, rgba(10,8,5,0) 55%);
}
.pc-hero__body {
    position: relative; z-index: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5rem 6vw;
    gap: 3rem;
}

/* Hero left ---------------------------------------------------------------- */
.pc-hero__left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.pc-hero__eyebrow {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold-l);
    margin-bottom: 1rem;
    opacity: 0;
    animation: fadeUpHero 1s 0.2s both cubic-bezier(0.16,1,0.3,1);
}
.pc-hero__brand-name {
    font-family: var(--serif);
    font-size: clamp(1.4rem, 2.4vw, 2.2rem);
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 0.06em;
    margin-bottom: 1rem;
    opacity: 0;
    animation: fadeUpHero 1s 0.38s both cubic-bezier(0.16,1,0.3,1);
}
.pc-hero__gold-rule {
    width: 52px;
    height: 1px;
    background: linear-gradient(90deg, var(--gold-l), transparent);
    margin-bottom: 1.4rem;
    transform-origin: left center;
    animation: expandGoldRule 1s 0.55s both cubic-bezier(0.16,1,0.3,1);
}
@keyframes expandGoldRule {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
}
.pc-hero__tagline {
    font-family: var(--serif);
    font-size: clamp(2rem, 4.5vw, 4.5rem);
    font-weight: 400;
    color: #ffffff;
    line-height: 1.12;
    letter-spacing: 0.01em;
    margin-bottom: 1.4rem;
    opacity: 0;
    animation: fadeUpHero 1s 0.6s both cubic-bezier(0.16,1,0.3,1);
}
.pc-hero__sub {
    font-size: 0.88rem;
    font-weight: 300;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.04em;
    margin-bottom: 2rem;
    opacity: 0;
    animation: fadeUpHero 1s 0.76s both cubic-bezier(0.16,1,0.3,1);
}
.pc-hero__sub strong { color: rgba(255,255,255,0.92); font-weight: 500; }
.pc-hero__outline-btn {
    display: inline-block;
    padding: 0.78rem 2rem;
    border: 1px solid rgba(255,255,255,0.42);
    color: #ffffff;
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-decoration: none;
    transition: background 0.3s, box-shadow 0.3s;
    opacity: 0;
    animation: fadeUpHero 1s 0.9s both cubic-bezier(0.16,1,0.3,1);
}
.pc-hero__outline-btn:hover {
    background: rgba(255,255,255,0.1);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.75);
}
@keyframes fadeUpHero {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* Glass form card ---------------------------------------------------------- */
.pc-hero__glass {
    width: 380px;
    flex-shrink: 0;
    background: rgba(10,8,5,0.58);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(196,163,90,0.28);
    border-radius: 2px;
    padding: 2.2rem 2rem;
    opacity: 0;
    animation: fadeUpHero 1s 1s both cubic-bezier(0.16,1,0.3,1);
}
.pc-glass-title {
    font-family: var(--serif);
    font-size: 1.1rem;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.04em;
    padding-bottom: 1.1rem;
    border-bottom: 1px solid rgba(196,163,90,0.2);
    margin-bottom: 1.2rem;
}
.pc-glass-form { display: flex; flex-direction: column; gap: 0.9rem; }
.pc-glass-field { display: flex; flex-direction: column; gap: 0.32rem; }
.pc-glass-field label {
    font-size: 0.68rem; font-weight: 500;
    color: rgba(255,255,255,0.72);
    letter-spacing: 0.08em; text-transform: uppercase;
}
.req { color: var(--gold-l); margin-left: 2px; }

.pc-glass-field input,
.pc-glass-field select {
    width: 100%;
    background: rgba(255,255,255,0.93);
    border: 1px solid transparent;
    border-radius: 2px;
    padding: 0.72rem 0.9rem;
    font-family: var(--sans);
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--ink);
    outline: none;
    transition: box-shadow 0.2s, background 0.2s;
    appearance: none; -webkit-appearance: none;
}
.pc-glass-field input:focus,
.pc-glass-field select:focus {
    box-shadow: inset 0 0 0 1px var(--gold-l), 0 0 0 3px rgba(196,163,90,0.2);
    background: #ffffff;
}
.pc-glass-field input::placeholder { color: rgba(22,19,14,0.36); }
.pc-glass-field select { cursor: pointer; color: rgba(22,19,14,0.42); }
.pc-glass-field select:valid { color: var(--ink); }

.pc-input-error,
.pc-phone-row.pc-input-error {
    box-shadow: inset 0 0 0 1px rgba(220,38,38,0.65), 0 0 0 2px rgba(220,38,38,0.14) !important;
    border-radius: 2px;
}
.pc-field-error { font-size: 0.63rem; color: #fca5a5; display: block; }

.pc-phone-row {
    display: flex; align-items: stretch;
    background: rgba(255,255,255,0.93);
    border-radius: 2px; overflow: hidden;
    min-height: 42px;
    border: 1px solid transparent;
    transition: box-shadow 0.2s;
}
.pc-phone-row:focus-within {
    box-shadow: inset 0 0 0 1px var(--gold-l), 0 0 0 3px rgba(196,163,90,0.2);
}
.pc-phone-prefix {
    display: flex; align-items: center;
    padding: 0 0.85rem;
    font-size: 0.8rem; font-weight: 500; color: #555;
    border-right: 1px solid #d4cfc8;
    background: #f0ece5; flex-shrink: 0;
}
.pc-phone-row input {
    flex: 1; min-width: 0;
    border: none !important; border-radius: 0 !important;
    background: transparent !important; box-shadow: none !important;
    padding-left: 0.85rem;
}
.pc-phone-row input:focus { box-shadow: none !important; }

.pc-glass-form button {
    width: 100%; padding: 0.92rem;
    background: var(--gold);
    color: #ffffff; border: none; border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s, transform 0.15s;
    margin-top: 0.2rem;
    display: flex; align-items: center; justify-content: center;
    min-height: 46px;
}
.pc-glass-form button:hover:not(:disabled) { background: var(--gold-l); transform: translateY(-1px); }
.pc-glass-form button:active:not(:disabled) { transform: translateY(0); }
.pc-glass-form button:disabled { opacity: 0.5; cursor: not-allowed; }

.pc-btn-loader {
    display: inline-block; width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.pc-glass-success {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; padding: 2.5rem 0; text-align: center; color: #ffffff;
}
.pc-glass-success p  { font-family: var(--serif); font-size: 1.5rem; }
.pc-glass-success small { font-size: 0.78rem; color: rgba(255,255,255,0.65); line-height: 1.8; }

/* Scroll indicator --------------------------------------------------------- */
.pc-hero__scroll {
    position: absolute;
    bottom: 2.5rem; left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    animation: fadeIn 1s 1.5s both;
}
.pc-hero__scroll-line {
    width: 1px; height: 52px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.65), transparent);
    margin: 0 auto;
    animation: scrollBounce 2.2s ease-in-out infinite;
}
@keyframes scrollBounce {
    0%, 100% { transform: scaleY(1); opacity: 0.7; }
    50%       { transform: scaleY(0.45); opacity: 0.25; }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ── ABOUT ───────────────────────────────────────────────────────────────── */
.pc-about {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    padding: 6rem 8vw;
    gap: 5rem;
    background: var(--white);
}
.pc-about__title {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 2.6vw, 2.5rem);
    font-weight: 400; color: var(--ink);
    margin-bottom: 1.2rem; line-height: 1.2;
}
.pc-about__body {
    font-size: 0.9rem; line-height: 1.92;
    color: var(--stone); margin-bottom: 0.9rem; max-width: 52ch;
}
.pc-about__brochure {
    display: inline-block;
    margin-top: 1.8rem; padding: 0.8rem 2rem;
    background: var(--ink); color: #ffffff;
    font-family: var(--sans); font-size: 0.7rem; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
    transition: background 0.25s, transform 0.2s;
}
.pc-about__brochure:hover { background: var(--mid); transform: translateX(3px); }
.pc-about__right img { width: 100%; object-fit: cover; }

/* ── STATS ───────────────────────────────────────────────────────────────── */
.pc-stats {
    display: flex; justify-content: center; align-items: center;
    padding: 3.5rem 8vw;
    background: var(--cream);
    border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
}
.pc-stat {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.45rem; padding: 0 4rem; text-align: center;
}
.pc-stat__icon { width: 22px; height: 22px; color: var(--gold); margin-bottom: 0.5rem; }
.pc-stat__value {
    font-family: var(--serif);
    font-size: clamp(1rem, 1.8vw, 1.4rem);
    font-weight: 400; color: var(--ink); letter-spacing: 0.04em;
}
.pc-stat__label {
    font-size: 0.65rem; font-weight: 400;
    color: var(--stone); letter-spacing: 0.1em; text-transform: uppercase;
}
.pc-stat-divider { width: 1px; height: 56px; background: var(--line); flex-shrink: 0; }

/* ── PAYMENT ─────────────────────────────────────────────────────────────── */
.pc-payment {
    background: var(--white);
    padding: 6rem 8vw;
    border-top: 1px solid var(--line);
}
.pc-payment__inner { max-width: 860px; margin: 0 auto; text-align: center; }
.pc-payment__title {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 3vw, 2.5rem);
    font-weight: 400; color: var(--ink); margin-bottom: 1rem;
}
.pc-pay-cards {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1.4rem; margin-bottom: 2.5rem;
}
.pc-pay-card {
    background: var(--off);
    border: 1px solid var(--line);
    border-radius: 2px;
    padding: 2.5rem 1.5rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.7rem;
    transition: transform 0.3s, box-shadow 0.3s;
}
.pc-pay-card:hover {
    transform: translateY(-5px);
    box-shadow: inset 0 3px 0 var(--gold), 0 14px 36px rgba(18,15,10,0.09);
}
.pc-pay-card__icon { width: 26px; height: 26px; color: var(--gold); margin-bottom: 0.4rem; }
.pc-pay-card__pct  { font-family: var(--serif); font-size: 2.2rem; font-weight: 400; color: var(--ink); line-height: 1; }
.pc-pay-card__label { font-size: 0.74rem; font-weight: 300; color: var(--stone); line-height: 1.5; text-align: center; }
.pc-pay-cta {
    display: inline-block; padding: 0.9rem 2.8rem;
    background: var(--ink); color: #ffffff;
    font-family: var(--sans); font-size: 0.7rem; font-weight: 400;
    letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none;
    transition: background 0.25s, transform 0.2s;
}
.pc-pay-cta:hover { background: var(--mid); transform: translateY(-1px); }

/* ── AMENITIES ───────────────────────────────────────────────────────────── */
.pc-amenities {
    position: relative; min-height: 65vh;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.pc-am-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center 55%;
    filter: brightness(0.5);
}
.pc-am-veil { position: absolute; inset: 0; background: rgba(10,8,5,0.3); }
.pc-amenities__inner {
    position: relative; z-index: 1;
    text-align: center; padding: 5.5rem 8vw;
    width: 100%; max-width: 1200px; margin: 0 auto;
}
.pc-amenities__title {
    font-family: var(--serif);
    font-size: clamp(1.5rem, 3vw, 2.6rem);
    font-weight: 400; color: #ffffff; line-height: 1.25; margin-bottom: 1.2rem;
}
.pc-am-grid {
    display: flex; justify-content: center;
    gap: 4rem; flex-wrap: wrap;
}
.pc-am-item {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; width: 138px;
    transition: transform 0.3s;
}
.pc-am-item:hover { transform: translateY(-4px); }
.pc-am-card {
    width: 72px; height: 72px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.07);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(196,163,90,0.32);
    border-radius: 2px;
    transition: background 0.3s, box-shadow 0.3s;
}
.pc-am-item:hover .pc-am-card {
    background: rgba(196,163,90,0.14);
    box-shadow: inset 0 0 0 1px rgba(196,163,90,0.65);
}
.pc-am-card svg { width: 26px; height: 26px; color: var(--gold-l); }
.pc-am-item span {
    font-size: 0.71rem; font-weight: 300;
    color: rgba(255,255,255,0.85);
    text-align: center; line-height: 1.55; letter-spacing: 0.04em;
}

/* ── GALLERY ─────────────────────────────────────────────────────────────── */
.pc-gallery {
    padding: 6rem 6vw;
    background: var(--white);
    border-top: 1px solid var(--line);
    text-align: center;
}
.pc-gallery__title {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 3vw, 2.5rem);
    font-weight: 400; color: var(--ink); margin-bottom: 1rem;
}
.pc-gallery__grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 4px; margin-top: 2.5rem;
}
.pc-gallery__item {
    position: relative; overflow: hidden;
    aspect-ratio: 4/3; cursor: pointer; margin: 0;
}
.pc-gallery__item img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
}
.pc-gallery__item:hover img { transform: scale(1.07); }
.pc-gallery__label {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(transparent, rgba(12,9,5,0.8));
    padding: 2rem 1rem 0.9rem;
    font-size: 0.57rem; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(255,255,255,0.8);
    transform: translateY(4px);
    transition: transform 0.3s;
}
.pc-gallery__item:hover .pc-gallery__label { transform: translateY(0); }

/* ── PRICING ─────────────────────────────────────────────────────────────── */
.pc-pricing {
    padding: 6rem 6vw;
    background: var(--off);
    border-top: 1px solid var(--line);
    text-align: center;
}
.pc-pricing__inner { max-width: 560px; margin: 0 auto; }
.pc-pricing__title {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 3vw, 2.5rem);
    font-weight: 400; color: var(--ink); margin-bottom: 1rem;
}
.pc-pricing__table {
    border: 1px solid var(--line);
    background: var(--white);
    margin-bottom: 2rem; margin-top: 2rem;
}
.pc-price-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid var(--line);
    font-size: 0.85rem;
    transition: background 0.2s;
}
.pc-price-row:hover { background: var(--cream); }
.pc-price-row:last-child { border-bottom: none; }
.pc-price-row span:first-child { color: var(--stone); font-weight: 300; }
.pc-price-row span:last-child  { color: var(--ink);   font-weight: 500; }
.pc-pricing__btn {
    display: inline-block; padding: 0.9rem 2.8rem;
    background: var(--ink); color: #ffffff;
    text-decoration: none; font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    transition: background 0.25s, transform 0.2s;
}
.pc-pricing__btn:hover { background: var(--mid); transform: translateY(-1px); }

/* ── CTA ─────────────────────────────────────────────────────────────────── */
.pc-cta {
    position: relative; height: 200px;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.pc-cta__bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center 60%;
    filter: brightness(0.28);
}
.pc-cta__veil { position: absolute; inset: 0; background: rgba(26,61,92,0.52); }
.pc-cta__inner {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 3.5rem;
}
.pc-cta__sub {
    font-family: var(--serif);
    font-size: clamp(1rem, 2vw, 1.4rem);
    font-weight: 400; color: rgba(255,255,255,0.88);
}
.pc-cta__btn {
    display: inline-block; padding: 0.8rem 2.2rem;
    background: var(--gold); color: #ffffff;
    text-decoration: none; font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase; white-space: nowrap; flex-shrink: 0;
    transition: background 0.25s, transform 0.2s;
}
.pc-cta__btn:hover { background: var(--gold-l); transform: translateY(-1px); }

/* ── DEVELOPER ───────────────────────────────────────────────────────────── */
.pc-dev {
    background: var(--cream);
    padding: 6rem 6vw;
    border-top: 1px solid var(--line);
    text-align: center;
}
.pc-dev__inner { max-width: 580px; margin: 0 auto; }
.pc-dev__name {
    font-family: var(--serif); font-size: 2.1rem;
    font-weight: 400; color: var(--ink);
    letter-spacing: 0.22em; margin-bottom: 0.5rem; margin-top: 0.5rem;
}
.pc-dev__tagline {
    font-size: 0.6rem; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--stone); margin-bottom: 2rem;
}
.pc-dev__body { font-size: 0.88rem; line-height: 2; color: var(--stone); }

/* ── FOOTER ──────────────────────────────────────────────────────────────── */
.pc-footer {
    background: var(--ink);
    padding: 2.5rem 6vw;
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: 2rem; flex-wrap: wrap;
    border-top: 1px solid rgba(255,255,255,0.04);
}
.pc-footer p:first-child {
    font-size: 0.6rem; font-weight: 300;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.26); line-height: 2;
}
.pc-footer p:first-child strong { color: rgba(255,255,255,0.52); font-weight: 400; }
.pc-footer__disc {
    font-size: 0.52rem; color: rgba(255,255,255,0.12);
    max-width: 55ch; line-height: 1.9;
}

/* ── MOBILE STICKY CTA ───────────────────────────────────────────────────── */
.pc-sticky-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 200; }
.pc-sticky-cta__btn {
    display: block; width: 100%; padding: 1.1rem;
    background: var(--gold); color: #ffffff;
    text-align: center; font-family: var(--sans);
    font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    text-decoration: none;
    transition: background 0.2s;
}
.pc-sticky-cta__btn:hover { background: var(--gold-l); }

/* ── RESPONSIVE ──────────────────────────────────────────────────────────── */
@media (max-width: 960px) {
    .pc-hero__body { flex-direction: column; padding: 3.5rem 6vw 5rem; align-items: flex-start; }
    .pc-hero__glass { width: 100%; max-width: 480px; }
    .pc-about { grid-template-columns: 1fr; gap: 3rem; padding: 4.5rem 6vw; }
    .pc-gallery__grid { grid-template-columns: repeat(2, 1fr); }
    .pc-cta__inner { flex-direction: column; gap: 1.5rem; text-align: center; padding: 0 2rem; }
    .pc-footer { flex-direction: column; }
    .pc-stat { padding: 0 2rem; }
}

@media (max-width: 640px) {
    .pc-hero__tagline { font-size: clamp(2rem, 10vw, 3.2rem); }
    .pc-gallery__grid { grid-template-columns: 1fr; }
    .pc-am-grid { gap: 2.5rem; }
    .pc-pay-cards { grid-template-columns: 1fr; gap: 1rem; }
    .pc-stats { flex-direction: column; gap: 2rem; padding: 2.5rem 6vw; }
    .pc-stat-divider { width: 60px; height: 1px; }
    .pc-sticky-cta { display: block; }
    .pc-footer { padding-bottom: 5rem; }
}

@media (prefers-reduced-motion: reduce) {
    .pc-hero__bg { animation: none; transform: scale(1); }
    .pc-hero__eyebrow, .pc-hero__brand-name, .pc-hero__gold-rule,
    .pc-hero__tagline, .pc-hero__sub, .pc-hero__outline-btn,
    .pc-hero__glass, .pc-hero__scroll { animation: none; opacity: 1; width: 52px; }
    .pc-animate { opacity: 1; transform: none; transition: none; }
    .pc-gold-rule::after { animation: none; }
}
</style>
