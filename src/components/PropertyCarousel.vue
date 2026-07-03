<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  watchItems?: any[]
  autoPlay?: boolean
  interval?: number
}>()

const getDocDir = (): 'ltr' | 'rtl' =>
  typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'

const isRtl = ref(getDocDir() === 'rtl')

const [emblaRef, emblaApi] = emblaCarouselVue({
  loop: true,
  align: 'start',
  slidesToScroll: 1,
  dragFree: false,
  direction: getDocDir(),
})

const canPrev = ref(true)
const canNext = ref(true)
const isHovered = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
let dirObserver: MutationObserver | null = null

const syncState = () => {
  if (!emblaApi.value) return
  canPrev.value = emblaApi.value.canScrollPrev()
  canNext.value = emblaApi.value.canScrollNext()
}

const startAutoPlay = () => {
  if (!props.autoPlay) return
  timer = setInterval(() => {
    if (!isHovered.value && emblaApi.value) {
      emblaApi.value.scrollNext()
    }
  }, props.interval ?? 3500)
}

const stopAutoPlay = () => {
  if (timer) { clearInterval(timer); timer = null }
}

onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.on('select', syncState)
    emblaApi.value.on('reInit', syncState)
    syncState()
  }
  startAutoPlay()

  // Reinitialize Embla when the document direction changes (language switch)
  dirObserver = new MutationObserver(() => {
    const dir = getDocDir()
    isRtl.value = dir === 'rtl'
    emblaApi.value?.reInit({ direction: dir })
    syncState()
  })
  dirObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['dir'],
  })
})

onUnmounted(() => {
  stopAutoPlay()
  dirObserver?.disconnect()
})

watch(() => props.watchItems, () => {
  setTimeout(() => {
    emblaApi.value?.reInit({ direction: getDocDir() })
    syncState()
  }, 100)
}, { deep: true })

const prev = () => { emblaApi.value?.scrollPrev(); syncState() }
const next = () => { emblaApi.value?.scrollNext(); syncState() }
</script>

<template>
  <div
    class="relative"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <slot name="header" />

    <!-- Embla viewport -->
    <div ref="emblaRef" class="overflow-hidden -mx-3">
      <div class="flex touch-pan-y select-none">
        <slot />
      </div>
    </div>

    <!-- Navigation — icons flip in RTL so arrows always point toward their direction -->
    <div class="flex justify-end items-center gap-3 mt-5">
      <button
        @click="prev"
        class="w-11 h-11 rounded-full border-2 border-[#C9A028] text-[#C9A028] flex items-center justify-center transition-all duration-300 focus:outline-none hover:bg-[#C9A028] hover:text-black"
        aria-label="Previous"
      >
        <ChevronRight v-if="isRtl" class="w-5 h-5" />
        <ChevronLeft v-else class="w-5 h-5" />
      </button>
      <button
        @click="next"
        class="w-11 h-11 rounded-full border-2 border-[#C9A028] text-[#C9A028] flex items-center justify-center transition-all duration-300 focus:outline-none hover:bg-[#C9A028] hover:text-black"
        aria-label="Next"
      >
        <ChevronLeft v-if="isRtl" class="w-5 h-5" />
        <ChevronRight v-else class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
