<script setup lang="ts">
const props = defineProps<{ imageUrl?: string }>()
const emit = defineEmits<{ (e: 'confirm', crop: { x: number; y: number; w: number; h: number; url: string; xPct: number; yPct: number; wPct: number; hPct: number }): void }>()

const showImageCropper = useState('showImageCropper', () => false)

const imgRef = ref<HTMLImageElement | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null) // wrapper that defines the available area

const natural = reactive({ w: 0, h: 0 }) // intrinsic image size
const display = reactive({ w: 0, h: 0, scale: 1 }) // rendered size + scale factor
const offset = reactive({ x: 0, y: 0 }) // image top/left offset inside container (due to object-contain centering)
const crop = reactive<CropRect>({ x: 0, y: 0, w: 0, h: 0 })
const dragging = reactive<{ mode: null | 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e'; ox: number; oy: number; start: CropRect | null }>({ mode: null, ox: 0, oy: 0, start: null })
type AspectValue = 'free' | '1:1' | '4:3' | '3:4' | '16:9' | '9:16'
const aspect = ref<AspectValue>('free')

// Provide German labels while keeping internal value english ('free').
const aspectOptions: Array<{ label: string; value: AspectValue }> = [
  { label: 'Frei', value: 'free' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' },
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
]

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

// Percent values (relative to full image dimensions in natural resolution).
// Using natural ensures backend cropping independent of rendered size.
const cropPercent = computed(() => {
  if (!cropNatural.value || !natural.w || !natural.h) return null
  const { x, y, w, h } = cropNatural.value
  return {
    xPct: +(x / natural.w * 100),
    yPct: +(y / natural.h * 100),
    wPct: +(w / natural.w * 100),
    hPct: +(h / natural.h * 100),
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
  nextTick(() => {
    measure()
    ensureMeasured()
  })
}

// Sometimes the image layout is not final on the first onload/nextTick (fonts, modal transition, etc.).
// Re-measure for a few frames until width/height stabilize.
function ensureMeasured(maxFrames = 10) {
  let lastW = display.w, lastH = display.h, frames = 0
  const step = () => {
    measure()
    frames++
    const stable = display.w === lastW && display.h === lastH && display.w > 0 && display.h > 0
    if (stable || frames >= maxFrames) return
    lastW = display.w; lastH = display.h
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
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
  // When modal is opened later, re-measure (in case image already cached and load fired earlier)
  watch(showImageCropper, (open) => { if (open) nextTick(() => ensureMeasured()) })

  // Observe size changes more granularly than window resize
  const ro = new ResizeObserver(() => measure())
  if (containerRef.value) ro.observe(containerRef.value)
  if (imgRef.value) ro.observe(imgRef.value)
  onBeforeUnmount(() => ro.disconnect())
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))

const isUploading = ref(false)
const asCopy = ref(false)
async function confirm() {
  if (!cropPercent.value) return
  if (isUploading.value) return

  isUploading.value = true

  try {
    const { imageUrl } = await $fetch<{ imageUrl: string }>('/api/user/upload/crop', {
      method: 'POST',
      body: {
        asCopy: asCopy.value,
        imageUrl: props.imageUrl,
        coordinates: {
          x: cropPercent.value.xPct,
          y: cropPercent.value.yPct,
          w: cropPercent.value.wPct,
          h: cropPercent.value.hPct,
        }
      },
    })
    console.log('Uploaded cropped image:', imageUrl)
  } catch (error) {
    console.error('Error uploading cropped image:', error)
  } finally {
    isUploading.value = false
  }
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
    @after:enter="ensureMeasured()"
  >
    <template #body>
      <div class="flex flex-wrap gap-2 pb-4 items-center justify-center">
        <UButton
          v-for="opt in aspectOptions"
          :key="opt.value"
          :label="opt.label"
          :color="aspect===opt.value ? 'primary' : 'neutral'"
          :variant="aspect===opt.value ? 'solid' : 'soft'"
          @click="aspect = opt.value"
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
        <!-- Clipping wrapper sized to actual rendered image area -->
        <div
          v-if="natural.w"
          class="absolute pointer-events-none overflow-hidden"
          :style="{ left: offset.x + 'px', top: offset.y + 'px', width: display.w + 'px', height: display.h + 'px' }"
        >
          <div
            v-if="crop.w && crop.h"
            ref="overlayRef"
            class="absolute z-10 border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] group pointer-events-auto"
            style="touch-action:none;"
            :style="{ left: crop.x + 'px', top: crop.y + 'px', width: crop.w + 'px', height: crop.h + 'px', cursor: dragging.mode ? 'grabbing' : 'move' }"
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
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Abbrechen" color="neutral" @click="showImageCropper = false" />
        <UButton label="Zuschneiden" color="primary" :disabled="isUploading" :loading="isUploading" @click="confirm" />
        <USwitch
          v-model="asCopy"
          label="Original behalten"
          :disabled="isUploading"
          :loading="isUploading"
          class="self-center"
        />
      </div>
    </template>
  </UModal>
</template>