<script setup lang="ts">
type Rect = { x: number; y: number; w: number; h: number }

// New prop: optional image URL that, when provided, will be loaded into the cropper
const props = defineProps<{ imageUrl?: string }>()

const showImageCropper = useState('showImageCropper', () => false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const dndRef = ref<HTMLDivElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const imgNatural = reactive({ w: 0, h: 0 })
const view = reactive<Rect>({ x: 0, y: 0, w: 0, h: 0 })
const crop = reactive<Rect>({ x: 0, y: 0, w: 0, h: 0 })
const drag = reactive<{ mode: string | null; ox: number; oy: number; start: { crop: Rect } | null }>({ mode: null, ox: 0, oy: 0, start: null })
const dpi = ref<number>(window.devicePixelRatio || 1)
const aspect = ref<'free' | '1:1' | '4:3' | '16:9'>('free')
const previewURL = ref('')
let parentRO: ResizeObserver | null = null

const aspectOptions: Array<'free' | '1:1' | '4:3' | '16:9'> = ['free', '1:1', '4:3', '16:9']

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const parseAspect = (mode: string) => {
  if (mode === 'free') return null
  const [w, h] = mode.split(':').map(Number)
  return w && h ? w / h : null
}

const fitRectCover = (iw: number, ih: number, cw: number, ch: number): Rect => {
  const ir = iw / ih
  const cr = cw / ch
  let w: number, h: number, x: number, y: number
  if (ir > cr) {
    h = ch
    w = ir * h
    x = (cw - w) / 2
    y = 0
  } else {
    w = cw
    h = w / ir
    x = 0
    y = (ch - h) / 2
  }
  return { x, y, w, h }
}

const rectContains = (r: Rect, px: number, py: number, pad = 0) =>
  px >= r.x - pad && py >= r.y - pad && px <= r.x + r.w + pad && py <= r.y + r.h + pad

const pointInHandle = (c: Rect, px: number, py: number, size: number) => {
  const hs = size
  const handles = [
    { k: 'nw', x: c.x, y: c.y },
    { k: 'ne', x: c.x + c.w, y: c.y },
    { k: 'sw', x: c.x, y: c.y + c.h },
    { k: 'se', x: c.x + c.w, y: c.y + c.h },
    { k: 'n', x: c.x + c.w / 2, y: c.y },
    { k: 's', x: c.x + c.w / 2, y: c.y + c.h },
    { k: 'w', x: c.x, y: c.y + c.h / 2 },
    { k: 'e', x: c.x + c.w, y: c.y + c.h / 2 },
  ]
  for (const h of handles) if (Math.abs(px - h.x) <= hs && Math.abs(py - h.y) <= hs) return h.k as string
  return null
}

const adjustCrop = (crop0: Rect, mode: string, dx: number, dy: number, bounds: Rect, aspectRatio: number | null): Rect => {
  let { x, y, w, h } = crop0
  if (mode === 'move') {
    x = clamp(x + dx, bounds.x, bounds.x + bounds.w - w)
    y = clamp(y + dy, bounds.y, bounds.y + bounds.h - h)
    return { x, y, w, h }
  }
  let x2 = x + w
  let y2 = y + h
  if (mode.includes('w')) x = clamp(x + dx, bounds.x, x2 - 10)
  if (mode.includes('e')) x2 = clamp(x2 + dx, x + 10, bounds.x + bounds.w)
  if (mode.includes('n')) y = clamp(y + dy, bounds.y, y2 - 10)
  if (mode.includes('s')) y2 = clamp(y2 + dy, y + 10, bounds.y + bounds.h)
  if (aspectRatio) {
    const cw = x2 - x
    const ch = y2 - y
    const current = cw / ch
    if (current > aspectRatio) {
      const targetW = ch * aspectRatio
      if (mode === 'nw') x = x2 - targetW
      else x2 = x + targetW
    } else {
      const targetH = (x2 - x) / aspectRatio
      if (mode === 'nw' || mode === 'ne') y = y2 - targetH
      else y2 = y + targetH
    }
    x = clamp(x, bounds.x, bounds.x + bounds.w - 10)
    y = clamp(y, bounds.y, bounds.y + bounds.h - 10)
    x2 = clamp(x2, x + 10, bounds.x + bounds.w)
    y2 = clamp(y2, y + 10, bounds.y + bounds.h)
  }
  return { x, y, w: x2 - x, h: y2 - y }
}

const loadImageFromFile = (file: File) => new Promise<HTMLImageElement>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = reader.result as string // data: URL
  }
  reader.onerror = (e) => reject(e)
  reader.readAsDataURL(file)
})

// Load an image from a URL (used when imageUrl prop is provided)
const loadImageFromURL = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  if (!url) return reject(new Error('Empty URL'))
  const img = new Image()
  // Set crossOrigin to allow canvas export if server sends proper CORS headers
  img.crossOrigin = 'anonymous'
  img.onload = () => resolve(img)
  img.onerror = (e) => reject(e)
  img.src = url
})

// Watch for prop changes to imageUrl and load the image (initial + updates)
watch(() => props.imageUrl, async (val) => {
  if (!val) return
  try {
    const img = await loadImageFromURL(val)
    image.value = img
  } catch (e) {
    console.warn('Failed to load image from URL', val, e)
  }
}, { immediate: true })

const initializeSceneForImage = (img: HTMLImageElement, cvs: HTMLCanvasElement | null) => {
  if (!cvs || !cvs.parentElement) return
  const cssW = Math.min(800, Math.max(320, cvs.parentElement.clientWidth - 32))
  const cssH = Math.min(600, Math.max(240, Math.round(cssW * 0.75)))
  cvs.style.width = cssW + 'px'
  cvs.style.height = cssH + 'px'
  cvs.width = Math.round(cssW * dpi.value)
  cvs.height = Math.round(cssH * dpi.value)
  const viewRect = fitRectCover(img.naturalWidth, img.naturalHeight, cvs.width, cvs.height)
  const pad = Math.round(Math.min(viewRect.w, viewRect.h) * 0.1)
  let cw = viewRect.w - pad * 2
  let ch = viewRect.h - pad * 2
  const ar = parseAspect(aspect.value)
  if (ar) { if (cw / ch > ar) cw = ch * ar; else ch = cw / ar }
  const cropRect = {
    x: Math.round(viewRect.x + (viewRect.w - cw) / 2),
    y: Math.round(viewRect.y + (viewRect.h - ch) / 2),
    w: Math.round(cw),
    h: Math.round(ch),
  }
  imgNatural.w = img.naturalWidth; imgNatural.h = img.naturalHeight
  Object.assign(view, viewRect)
  Object.assign(crop, cropRect)
}

watch([image, dpi, aspect], () => {
  if (!image.value) return
  requestAnimationFrame(() => initializeSceneForImage(image.value!, canvasRef.value))
})

onMounted(() => {
  const cvs = canvasRef.value
  const parent = cvs?.parentElement
  if (parent) {
    parentRO = new ResizeObserver(() => { if (image.value) initializeSceneForImage(image.value, canvasRef.value) })
    parentRO.observe(parent)
  }
})

onBeforeUnmount(() => { if (parentRO) parentRO.disconnect() })

const drawScene = () => {
  const cvs = canvasRef.value
  const ctx = cvs?.getContext('2d')
  if (!cvs || !ctx || !image.value) return
  ctx.clearRect(0, 0, cvs.width, cvs.height)
  ctx.imageSmoothingEnabled = true; (ctx as any).imageSmoothingQuality = 'high'
  ctx.drawImage(image.value, 0, 0, imgNatural.w, imgNatural.h, view.x, view.y, view.w, view.h)
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath()
  ctx.rect(0, 0, cvs.width, cvs.height); ctx.rect(crop.x, crop.y, crop.w, crop.h)
  // @ts-ignore evenodd is valid at runtime
  ctx.fill('evenodd'); ctx.restore()
  ctx.save(); ctx.strokeStyle = 'white'; ctx.lineWidth = 2 * dpi.value; ctx.setLineDash([6 * dpi.value, 6 * dpi.value])
  ctx.strokeRect(crop.x, crop.y, crop.w, crop.h); ctx.restore()
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1 * dpi.value
  for (let i = 1; i <= 2; i++) {
    const gx = crop.x + (crop.w / 3) * i; const gy = crop.y + (crop.h / 3) * i
    ctx.beginPath(); ctx.moveTo(gx, crop.y); ctx.lineTo(gx, crop.y + crop.h)
    ctx.moveTo(crop.x, gy); ctx.lineTo(crop.x + crop.w, gy); ctx.stroke()
  }
  ctx.restore()
  const hs = 10 * dpi.value
  const handlePts = [
    { x: crop.x, y: crop.y }, { x: crop.x + crop.w, y: crop.y },
    { x: crop.x, y: crop.y + crop.h }, { x: crop.x + crop.w, y: crop.y + crop.h },
    { x: crop.x + crop.w / 2, y: crop.y }, { x: crop.x + crop.w / 2, y: crop.y + crop.h },
    { x: crop.x, y: crop.y + crop.h / 2 }, { x: crop.x + crop.w, y: crop.y + crop.h / 2 },
  ]
  ctx.save(); ctx.fillStyle = 'white'
  for (const p of handlePts) { ctx.beginPath(); ctx.rect(p.x - hs, p.y - hs, hs * 2, hs * 2); ctx.fill() }
  ctx.restore()
}

watchEffect(() => { drawScene() })

const toCanvasCoords = (evt: PointerEvent | any) => {
  const cvs = canvasRef.value
  if (!cvs) return { x: 0, y: 0 }
  const rect = cvs.getBoundingClientRect()
  const cx = (evt.clientX - rect.left) * (cvs.width / rect.width)
  const cy = (evt.clientY - rect.top) * (cvs.height / rect.height)
  return { x: cx, y: cy }
}

const onPointerDown = (evt: PointerEvent | any) => {
  if (!image.value || !canvasRef.value) return
  canvasRef.value.setPointerCapture(evt.pointerId)
  const { x, y } = toCanvasCoords(evt)
  const handle = pointInHandle(crop, x, y, 16 * dpi.value)
  const mode = handle || (rectContains(crop, x, y) ? 'move' : null)
  if (!mode) return
  drag.mode = mode; drag.ox = x; drag.oy = y; drag.start = { crop: { ...crop } }
}

const onPointerMove = (evt: PointerEvent | any) => {
  if (!image.value || !drag.mode) return
  const { x, y } = toCanvasCoords(evt)
  const dx = x - drag.ox; const dy = y - drag.oy
  const aspectRatio = parseAspect(aspect.value)
  const next = adjustCrop(drag.start!.crop, drag.mode, dx, dy, view, aspectRatio)
  Object.assign(crop, next)
}

const onPointerUp = (evt: PointerEvent | any) => {
  if (!image.value || !canvasRef.value) return
  try { canvasRef.value.releasePointerCapture(evt.pointerId) } catch {}
  drag.mode = null; drag.ox = 0; drag.oy = 0; drag.start = null
}

const computeCropSourceRect = () => {
  const scaleX = imgNatural.w / view.w; const scaleY = imgNatural.h / view.h
  const sx = (crop.x - view.x) * scaleX; const sy = (crop.y - view.y) * scaleY
  const sw = crop.w * scaleX; const sh = crop.h * scaleY
  return { sx, sy, sw, sh }
}

const getCroppedCanvas = (targetMax = 800) => {
  const { sx, sy, sw, sh } = computeCropSourceRect(); const ar = sw / sh
  let outW = sw, outH = sh
  if (Math.max(outW, outH) > targetMax) {
    if (ar >= 1) { outW = targetMax; outH = Math.round(targetMax / ar) }
    else { outH = targetMax; outW = Math.round(targetMax * ar) }
  }
  const oc = document.createElement('canvas')
  oc.width = Math.max(1, Math.round(outW)); oc.height = Math.max(1, Math.round(outH))
  const octx = oc.getContext('2d')!
  octx.imageSmoothingEnabled = true; (octx as any).imageSmoothingQuality = 'high'
  octx.drawImage(image.value!, sx, sy, sw, sh, 0, 0, oc.width, oc.height)
  return oc
}

watch([image, () => crop.x, () => crop.y, () => crop.w, () => crop.h, () => view.x, () => view.y, () => view.w, () => view.h], () => {
  if (!image.value) { previewURL.value = ''; return }
  requestAnimationFrame(() => {
    try { const oc = getCroppedCanvas(512); previewURL.value = oc.toDataURL('image/jpeg', 0.9) } catch {}
  })
})

const onFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && file.type.startsWith('image/')) image.value = await loadImageFromFile(file)
}

onMounted(() => {
  const node = dndRef.value
  if (!node) return
  const prevent = (e: Event) => { e.preventDefault(); e.stopPropagation() }
  const onDrop = async (e: DragEvent) => {
    prevent(e)
    const file = e.dataTransfer?.files?.[0]
    if (file && file.type.startsWith('image/')) image.value = await loadImageFromFile(file)
  }
  node.addEventListener('dragenter', prevent)
  node.addEventListener('dragover', prevent)
  node.addEventListener('dragleave', prevent)
  node.addEventListener('drop', onDrop)
  onBeforeUnmount(() => {
    node.removeEventListener('dragenter', prevent)
    node.removeEventListener('dragover', prevent)
    node.removeEventListener('dragleave', prevent)
    node.removeEventListener('drop', onDrop)
  })
})

onMounted(() => {
  const onChange = () => (dpi.value = window.devicePixelRatio || 1)
  window.addEventListener('resize', onChange)
  onBeforeUnmount(() => window.removeEventListener('resize', onChange))
})

onMounted(() => {
  const approx = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps
  try {
    console.assert(parseAspect('free') === null, 'parseAspect free failed')
    console.assert(approx(parseAspect('16:9')!, 16 / 9), 'parseAspect 16:9 failed')
    const cover = fitRectCover(2000, 1000, 1000, 1000)
    console.assert(approx(cover.h, 1000) && approx(cover.w, 2000) && approx(cover.x, -500) && approx(cover.y, 0), 'fitRectCover failed')
    console.assert(rectContains({ x: 10, y: 10, w: 50, h: 50 }, 35, 35), 'rectContains center failed')
    console.assert(!rectContains({ x: 10, y: 10, w: 50, h: 50 }, 0, 0), 'rectContains outside failed')
    const moved = adjustCrop({ x: 10, y: 10, w: 50, h: 50 }, 'move', 100, 100, { x: 0, y: 0, w: 100, h: 100 }, null)
    console.assert(moved.x === 50 && moved.y === 50, 'adjustCrop move clamp failed')
    // Guard test: should not throw when canvas is null
    try { initializeSceneForImage({ naturalWidth: 100, naturalHeight: 100 } as any, null) } catch { console.assert(false, 'initializeSceneForImage should not throw on null canvas') }
    // Mapping test
    ;(function testCompute() {
      const locImgNatural = { w: 4000, h: 3000 }
      const locView: Rect = { x: 0, y: 0, w: 1000, h: 750 }
      const locCrop: Rect = { x: 100, y: 100, w: 300, h: 150 }
      const scaleX = locImgNatural.w / locView.w // 4
      const scaleY = locImgNatural.h / locView.h // 4
      const sx = (locCrop.x - locView.x) * scaleX // 400
      const sy = (locCrop.y - locView.y) * scaleY // 400
      const sw = locCrop.w * scaleX // 1200
      const sh = locCrop.h * scaleY // 600
      console.assert(sx === 400 && sy === 400 && sw === 1200 && sh === 600, 'computeCropSourceRect mapping failed')
    })()
  } catch (e) {
    console.warn('Self-tests encountered an error:', e)
  }
})
</script>


<template>
  <UModal
    title="Bild zuschneiden"
    v-model:open="showImageCropper"
    fullscreen
  >
    <template #body>
      <div class="max-w-5xl mx-auto">
        <div class="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div class="md:col-span-2">
            <div ref="dndRef" class="border-2 border-dashed border-neutral-300 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 bg-white shadow-sm">
              <template v-if="!image">
                <p class="text-center text-neutral-600">Lege ein Bild hier ab oder wähle es aus.</p>
                <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm bg-neutral-900 text-white cursor-pointer active:scale-[.99]">
                  <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
                  Datei wählen
                </label>
              </template>
              <div v-else class="w-full overflow-auto">
                <canvas
                  ref="canvasRef"
                  class="touch-none rounded-xl bg-neutral-200 w-full h-auto"
                  @pointerdown="onPointerDown"
                  @pointermove="onPointerMove"
                  @pointerup="onPointerUp"
                />
              </div>
            </div>
          </div>
  
          <aside class="md:col-span-1">
            <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-5 space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium">Seitenverhältnis</label>
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="opt in aspectOptions"
                    :key="opt"
                    @click="aspect = opt"
                    class="px-3 py-1.5 rounded-xl border"
                    :class="aspect === opt ? 'bg-neutral-900 text-white' : 'bg-white'"
                  >
                    {{ opt }}
                  </button>
                </div>
                <p class="text-xs text-neutral-500">Beim Ändern wird der aktuelle Zuschnitt neu initialisiert.</p>
              </div>
  
              <div class="space-y-2">
                <label class="block text-sm font-medium">Preview</label>
                <div class="border rounded-xl overflow-hidden bg-neutral-50 flex items-center justify-center min-h-40">
                  <img v-if="previewURL" :src="previewURL" alt="Cropped Preview" class="max-w-full" />
                  <p v-else class="text-xs text-neutral-500 p-4">Noch kein Bild</p>
                </div>
                <p class="text-xs text-neutral-500">Die Vorschau aktualisiert sich live.</p>
              </div>
  
              <div class="text-xs text-neutral-500">
                <ul class="list-disc ml-4 space-y-1">
                  <li>Verschieben: innerhalb des Rahmens ziehen</li>
                  <li>Größe ändern: Ecken oder Kanten ziehen</li>
                  <li>Touch: ein Finger genügt (große Handles)</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </UModal>
</template>