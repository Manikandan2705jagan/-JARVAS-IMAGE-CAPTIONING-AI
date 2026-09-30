/**
 * Curated responses used when the product runs in Demo Mode (no backend URL
 * configured, or the backend is unreachable).
 *
 * These are ILLUSTRATIVE SAMPLE OUTPUTS — not measured model results. Every
 * surface that renders them is required to show a "Demo Mode" label.
 */

export const DEMO_GALLERY = [
  {
    id: 'dog-park',
    title: 'Dog in a Park',
    caption: 'A dog is running through a grassy field.',
    confidence: 0.947,
    objects: ['Dog', 'Grass', 'Outdoor'],
    scene: 'Park / Open Field',
    image: 'dog-park',
    palette: ['#1e3a8a', '#0ea5e9'],
  },
  {
    id: 'cat-window',
    title: 'Cat by the Window',
    caption: 'A cat is sitting on a windowsill looking outside.',
    confidence: 0.932,
    objects: ['Cat', 'Window', 'Indoor'],
    scene: 'Living Room',
    image: 'cat-window',
    palette: ['#4c1d95', '#a78bfa'],
  },
  {
    id: 'beach-sunset',
    title: 'Beach at Sunset',
    caption: 'A group of people are walking along the beach at sunset.',
    confidence: 0.918,
    objects: ['Beach', 'Ocean', 'People'],
    scene: 'Coastline',
    image: 'beach-sunset',
    palette: ['#9a3412', '#fb923c'],
  },
  {
    id: 'city-traffic',
    title: 'City Traffic',
    caption: 'Cars are driving through a busy city street at night.',
    confidence: 0.905,
    objects: ['Car', 'Street', 'Night'],
    scene: 'Urban Downtown',
    image: 'city-traffic',
    palette: ['#0f172a', '#38bdf8'],
  },
  {
    id: 'coffee-shop',
    title: 'Coffee Shop',
    caption: 'A person is holding a cup of coffee at a cafe table.',
    confidence: 0.961,
    objects: ['Coffee', 'Cup', 'Person'],
    scene: 'Cafe Interior',
    image: 'coffee-shop',
    palette: ['#78350f', '#fcd34d'],
  },
  {
    id: 'mountain-trail',
    title: 'Mountain Trail',
    caption: 'A hiker is walking along a mountain trail surrounded by trees.',
    confidence: 0.889,
    objects: ['Hiker', 'Mountain', 'Forest'],
    scene: 'Nature Reserve',
    image: 'mountain-trail',
    palette: ['#14532d', '#4ade80'],
  },
]

/**
 * Alternative phrasings returned by the "Regenerate" action in demo mode.
 * The real backend would simply sample a new decoding pass.
 */
const REGENERATION_VARIANTS = [
  'The photo shows a dog running across a grassy park.',
  'A dog sprints through green grass in an open field.',
  'A canine is running fast across a wide grassy area outdoors.',
  'A brown dog runs happily through a large grass field.',
]

/** Deterministic pseudo-random generator so demo output is stable per file. */
function hashString(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

/**
 * Build a plausible demo caption result for the given file.
 * @param {File} file
 * @param {number} [variant] Increment to get a different regeneration.
 */
export function createDemoResult(file, variant = 0) {
  const seed = hashString(`${file?.name ?? 'image'}:${file?.size ?? 0}`)
  const base = DEMO_GALLERY[seed % DEMO_GALLERY.length]

  const useVariant = variant > 0 && variant % 2 === 1
  const caption = useVariant
    ? REGENERATION_VARIANTS[(seed + variant) % REGENERATION_VARIANTS.length]
    : base.caption

  const jitter = ((seed + variant * 977) % 71) / 1000
  const confidence = Math.min(0.989, Math.max(0.71, base.confidence - jitter + variant * 0.004))

  return {
    caption,
    confidence: Number(confidence.toFixed(3)),
    objects: base.objects,
    scene: base.scene,
    demo: true,
    source: 'demo',
  }
}
