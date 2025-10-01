<script setup lang="ts">
interface CropRect { x: number; y: number; w: number; h: number }

const props = defineProps<{ imageUrl?: string }>()
const emit = defineEmits<{ (e: 'confirm', crop: { x: number; y: number; w: number; h: number; url: string }): void }>()

const showImageCropper = useState('showImageCropper', () => false)

// Refs & reactive state
const imgRef = ref<HTMLImageElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
// The cropping overlay itself (frame) so we can always capture pointer events on a stable element
const overlayRef = ref<HTMLDivElement | null>(null)

const natural = reactive({ w: 0, h: 0 }) // intrinsic image size
const display = reactive({ w: 0, h: 0, scale: 1 }) // rendered size + scale factor
const crop = reactive<CropRect>({ x: 0, y: 0, w: 0, h: 0 })
const dragging = reactive<{ mode: null | 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e'; ox: number; oy: number; start: CropRect | null }>({ mode: null, ox: 0, oy: 0, start: null })
const aspect = ref<'free' | '1:1' | '4:3' | '16:9'>('free')
const previewScale = ref(0.5)
const loading = ref(true)

const aspectOptions: Array<typeof aspect.value> = ['free', '1:1', '4:3', '16:9']

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
  // Always capture on the overlay frame (larger target) to avoid losing events when pointer leaves a small handle.
  const captureEl = overlayRef.value || (e.currentTarget as HTMLElement)
  try { captureEl.setPointerCapture(e.pointerId) } catch {}
  // Fallback: add window listeners if pointer capture is not supported (older browsers / edge cases)
  window.addEventListener('pointermove', moveDrag)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
}

function moveDrag(e: PointerEvent) {
  if (!dragging.mode || !dragging.start) return
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
    // Aspect ratio enforcement delegated to utility
    if (parseAspect(aspect.value)) {
      const priorityAxis = (['n','s'].some(d => dragging.mode?.includes(d)) && !['e','w'].some(d => dragging.mode?.includes(d))) ? 'h' : 'w'
      Object.assign(crop, enforceAspect(crop, aspect.value, priorityAxis))
    }
  }
  clamp()
}

function endDrag(e: PointerEvent) {
  if (dragging.mode) {
    try { (overlayRef.value || (e.target as HTMLElement)).releasePointerCapture(e.pointerId) } catch {}
  }
  dragging.mode = null
  dragging.start = null
  // Cleanup global listeners (in case we added them as fallback)
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

const previewStyle = computed<import('vue').CSSProperties>(() => {
  if (!crop.w || !crop.h) return {}
  const scale = previewScale.value
  return {
    width: `${Math.round(crop.w * scale)}px`,
    height: `${Math.round(crop.h * scale)}px`,
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    background: '#f9fafb',
  }
})

const previewImgStyle = computed<import('vue').CSSProperties>(() => {
  if (!crop.w || !crop.h) return {}
  const scale = previewScale.value
  return {
    position: 'absolute',
    left: `${-crop.x * scale}px`,
    top: `${-crop.y * scale}px`,
    width: `${display.w * scale}px`,
    userSelect: 'none',
    pointerEvents: 'none',
  }
})

function confirm() {
  if (!cropNatural.value || !props.imageUrl) return
  emit('confirm', { ...cropNatural.value, url: props.imageUrl })
  showImageCropper.value = false
}
</script>

<template>
  <UModal v-model:open="showImageCropper" title="Bild zuschneiden" fullscreen>
    <template #body>
      <div class="max-w-5xl mx-auto py-4 space-y-6">
        <div class="grid gap-6 md:grid-cols-3">
          <!-- Image + Crop Overlay -->
          <div class="md:col-span-2">
            <div ref="containerRef" class="relative rounded-2xl bg-neutral-50 p-4 border shadow-sm select-none">
              <div class="relative w-full overflow-hidden">
                <img
                  ref="imgRef"
                  :src="props.imageUrl"
                  class="max-w-full block rounded-lg"
                  draggable="false"
                  @load="onImgLoad"
                  @error="loading=false"
                  @pointermove="moveDrag"
                  @pointerup="endDrag"
                  @pointercancel="endDrag"
                />
                <div
                  v-if="crop.w && crop.h"
                  ref="overlayRef"
                  class="absolute border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] group touch-none"
                  :style="{ left: crop.x + 'px', top: crop.y + 'px', width: crop.w + 'px', height: crop.h + 'px', cursor: dragging.mode ? 'grabbing' : 'move' }"
                  @pointerdown="(e) => startDrag(e,'move')"
                  @pointermove="moveDrag"
                  @pointerup="endDrag"
                  @pointercancel="endDrag"
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
              <div v-if="loading" class="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">Lädt...</div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="md:col-span-1 space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-medium">Seitenverhältnis</label>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="opt in aspectOptions"
                  :key="opt"
                  size="xs"
                  :label="opt"
                  :color="aspect===opt ? 'primary' : 'neutral'"
                  :variant="aspect===opt ? 'solid' : 'soft'"
                  @click="aspect = opt"
                />
              </div>
              <p class="text-xs text-neutral-500">Ändern setzt den Zuschnitt zurück.</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Vorschau</label>
              <div :style="previewStyle">
                <img v-if="crop.w" :src="props.imageUrl" :style="previewImgStyle" alt="Preview" />
                <p v-else class="text-xs p-4 text-neutral-500">Noch kein Zuschnitt</p>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <label class="text-xs text-neutral-500">Skalierung</label>
                <input type="range" min="0.25" max="1" step="0.05" v-model.number="previewScale" />
              </div>
            </div>

            <div class="text-xs text-neutral-600 space-y-1">
              <div v-if="natural.w">Bild: {{ natural.w }}×{{ natural.h }}px</div>
              <div v-if="cropNatural">Zuschnitt: {{ cropNatural.x }},{{ cropNatural.y }} – {{ cropNatural.w }}×{{ cropNatural.h }}</div>
            </div>

            <div class="space-y-2">
              <UButton
                label="Übernehmen"
                icon="i-heroicons-check"
                class="w-full"
                :disabled="!cropNatural"
                @click="confirm"
              />
              <UButton
                label="Abbrechen"
                color="neutral"
                variant="soft"
                class="w-full"
                @click="showImageCropper = false"
              />
            </div>

            <p class="text-xs text-neutral-500">Ziehe den Rahmen oder seine Ecken/Kanten zum Anpassen.</p>
          </aside>
        </div>
      </div>
    </template>
  </UModal>
</template>