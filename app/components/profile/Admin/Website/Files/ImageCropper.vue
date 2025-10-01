<script setup lang="ts">
const props = defineProps<{ imageUrl?: string }>()
const emit = defineEmits<{ (e: 'confirm', crop: { x: number; y: number; w: number; h: number; url: string }): void }>()

const showImageCropper = useState('showImageCropper', () => false)

const imgRef = ref<HTMLImageElement | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null) // wrapper that defines the available area

const natural = reactive({ w: 0, h: 0 }) // intrinsic image size
const display = reactive({ w: 0, h: 0, scale: 1 }) // rendered size + scale factor
const offset = reactive({ x: 0, y: 0 }) // image top/left offset inside container (due to object-contain centering)
const crop = reactive<CropRect>({ x: 0, y: 0, w: 0, h: 0 })
const dragging = reactive<{ mode: null | 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e'; ox: number; oy: number; start: CropRect | null }>({ mode: null, ox: 0, oy: 0, start: null })
const aspect = ref<'frei' | '1:1' | '4:3' | '3:4' | '16:9' | '9:16'>('frei')

const aspectOptions: Array<typeof aspect.value> = ['frei', '1:1', '4:3', '3:4', '16:9', '9:16']

// Derived natural coordinates
const cropNatural = computed(() => {
  if (!natural.w || !display.scale || crop.w <= 0 || crop.h <= 0) return null
  return {
    x: Math.round(crop.x / display.scale),
    y: Math.round(crop.y / display.scale),
    w: Math.round(crop.w / display.scale),
    h: Math.round(crop.h / display.scale),
  }
})

function measure() {
  const img = imgRef.value
  if (!img) return
  display.w = img.clientWidth
  display.h = img.clientHeight
  display.scale = natural.w ? display.w / natural.w : 1
  // Determine actual offset of the rendered image inside the container (object-contain centering)
  const containerRect = containerRef.value?.getBoundingClientRect()
  const imgRect = img.getBoundingClientRect()
  if (containerRect) {
    offset.x = imgRect.left - containerRect.left
    offset.y = imgRect.top - containerRect.top
  }
  if (!crop.w || !crop.h) initDefaultCrop()
}

// Utilities extracted to app/utils/imageCropper.ts (auto-imported via Nuxt auto-import for utils)
// Functions: parseAspect, computeDefaultCrop, clampCrop, enforceAspect
function initDefaultCrop() {
  const next = computeDefaultCrop(display, aspect.value)
  Object.assign(crop, next)
}
function clamp() {
  Object.assign(crop, clampCrop(crop, display))
}

function startDrag(e: PointerEvent, mode: typeof dragging.mode) {
  if (!natural.w) return
  e.preventDefault()
  dragging.mode = mode
  dragging.ox = e.clientX
  dragging.oy = e.clientY
  dragging.start = { ...crop }
  
  window.addEventListener('pointermove', moveDrag, { passive: false })
  window.addEventListener('pointerup', endDrag, { once: true })
  window.addEventListener('pointercancel', endDrag, { once: true })
}

function moveDrag(e: PointerEvent) {
  if (!dragging.mode || !dragging.start) return
  e.preventDefault()
  const dx = e.clientX - dragging.ox
  const dy = e.clientY - dragging.oy
  let { x, y, w, h } = dragging.start
  if (dragging.mode === 'move') {
    crop.x = x + dx
    crop.y = y + dy
  } else {
    if (dragging.mode.includes('w')) { crop.x = x + dx; crop.w = w - dx }
    if (dragging.mode.includes('e')) { crop.w = w + dx }
    if (dragging.mode.includes('n')) { crop.y = y + dy; crop.h = h - dy }
    if (dragging.mode.includes('s')) { crop.h = h + dy }
    if (parseAspect(aspect.value)) {
      const priorityAxis = (['n','s'].some(d => dragging.mode?.includes(d)) && !['e','w'].some(d => dragging.mode?.includes(d))) ? 'h' : 'w'
      Object.assign(crop, enforceAspect(crop, aspect.value, priorityAxis))
    }
  }
  clamp()
}

function endDrag(e: PointerEvent) {
  dragging.mode = null
  dragging.start = null
  window.removeEventListener('pointermove', moveDrag)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
  clamp()
}

function onImgLoad() {
  const el = imgRef.value
  if (!el) return
  natural.w = el.naturalWidth
  natural.h = el.naturalHeight
  nextTick(() => measure())
}

watch(aspect, () => {
  // Re-initialize crop with new aspect
  initDefaultCrop()
})

watch(() => props.imageUrl, () => {
  // Reset state when a new external image is passed
  natural.w = 0; natural.h = 0
  crop.x = crop.y = crop.w = crop.h = 0
})

onMounted(() => {
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))

function confirm() {
  if (!cropNatural.value || !props.imageUrl) return
  emit('confirm', { ...cropNatural.value, url: props.imageUrl })
  showImageCropper.value = false
}
</script>

<template>
  <UModal
    v-model:open="showImageCropper"
    title="Bild zuschneiden"
    fullscreen
    :ui="{
      body: 'flex flex-col',
    }"
  >
    <template #body>
      <div class="flex flex-wrap gap-2 pb-4 items-center justify-center">
        <UButton
          v-for="opt in aspectOptions"
          :key="opt"
          :label="opt"
          :color="aspect===opt ? 'primary' : 'neutral'"
          :variant="aspect===opt ? 'solid' : 'soft'"
          @click="aspect = opt"
        />
      </div>
      <div ref="containerRef" class="relative w-full flex-1 grow">
        <div class="absolute inset-0 flex items-center justify-center">
          <img
            ref="imgRef"
            @load="onImgLoad"
            :src="props.imageUrl"
            class="object-contain max-w-full max-h-full select-none"
            draggable="false"
          />
        </div>
        
        <div
          v-if="crop.w && crop.h"
          ref="overlayRef"
          class="absolute z-10 border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] group"
          style="touch-action:none;"
          :style="{ left: offset.x + crop.x + 'px', top: offset.y + crop.y + 'px', width: crop.w + 'px', height: crop.h + 'px', cursor: dragging.mode ? 'grabbing' : 'move' }"
          @pointerdown="(e) => startDrag(e,'move')"
        >
          <template v-for="h in ['nw','n','ne','e','se','s','sw','w']" :key="h">
            <span
              :data-handle="h"
              @pointerdown.stop="(e) => startDrag(e, h as any)"
              class="absolute bg-white border border-neutral-400 size-4 -translate-x-1/2 -translate-y-1/2 rounded shadow-sm flex items-center justify-center after:content-[''] after:absolute after:-inset-1"
              :class="{
                'left-0 top-0 cursor-nwse-resize': h==='nw',
                'left-1/2 top-0 cursor-ns-resize': h==='n',
                'left-full top-0 cursor-nesw-resize': h==='ne',
                'left-full top-1/2 cursor-ew-resize': h==='e',
                'left-full top-full cursor-nwse-resize': h==='se',
                'left-1/2 top-full cursor-ns-resize': h==='s',
                'left-0 top-full cursor-nesw-resize': h==='sw',
                'left-0 top-1/2 cursor-ew-resize': h==='w',
              }"
            />
          </template>
        </div>
      </div>
    </template>
  </UModal>
</template>