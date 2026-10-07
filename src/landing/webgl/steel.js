import * as THREE from 'three'

/**
 * All textures are drawn procedurally on a canvas. Nothing is fetched, so the
 * film works offline and there is no HDR/GLTF decode on the critical path.
 */

const MONO = '"JetBrains Mono", ui-monospace, monospace'

/** Faint spun-metal brushing. Used as a roughness map, so it reads as wear. */
export function makeBrushedSteelTexture(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#9a9a9a'
  ctx.fillRect(0, 0, size, size)
  ctx.globalCompositeOperation = 'source-over'

  for (let i = 0; i < 700; i++) {
    const y = Math.random() * size
    const x = Math.random() * size
    const len = 24 + Math.random() * size * 0.9
    const light = Math.random() > 0.5
    ctx.strokeStyle = light
      ? `rgba(255,255,255,${0.02 + Math.random() * 0.05})`
      : `rgba(0,0,0,${0.02 + Math.random() * 0.05})`
    ctx.lineWidth = 0.4 + Math.random() * 1.3
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + len, y + (Math.random() - 0.5) * 2.5)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 1)
  texture.anisotropy = 4
  return texture
}

/**
 * The dabbawala's painted code, as a curved decal. Drawn twice: once with a
 * monospace fallback so it is never blank, then again once the real mono face
 * has loaded.
 */
export function makeRouteCodeTexture() {
  const W = 1024
  const H = 512
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4

  const draw = () => {
    ctx.clearRect(0, 0, W, H)

    // Chalky paint, slightly uneven like a stencilled crate marking.
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(26,26,26,0.92)'

    ctx.font = `700 150px ${MONO}`
    ctx.fillText('3-BO', W / 2, H * 0.31)

    ctx.font = `700 108px ${MONO}`
    ctx.fillStyle = 'rgba(194,65,12,0.95)'
    ctx.fillText('12 · LP', W / 2, H * 0.68)

    ctx.font = `700 30px ${MONO}`
    ctx.fillStyle = 'rgba(107,98,89,0.75)'
    ctx.fillText('KANDIVALI GROUP', W / 2, H * 0.9)

    texture.needsUpdate = true
  }

  draw()
  document.fonts?.ready.then(draw).catch(() => {})

  return texture
}

/** The little orange SETU tag that hangs from the carrier's clamp. */
export function makeTagTexture() {
  const W = 512
  const H = 256
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)

  const draw = () => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#f97316'
    const r = 46
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.arcTo(W, 0, W, H, r)
    ctx.arcTo(W, H, 0, H, r)
    ctx.arcTo(0, H, 0, 0, r)
    ctx.arcTo(0, 0, W, 0, r)
    ctx.closePath()
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#1a1a1a'
    ctx.font = `700 96px ${MONO}`
    ctx.fillText('SETU', W / 2, H * 0.4)
    ctx.font = `700 34px ${MONO}`
    ctx.fillText('DABBA CONNECTION', W / 2, H * 0.73)

    texture.needsUpdate = true
  }

  draw()
  document.fonts?.ready.then(draw).catch(() => {})

  return texture
}

/**
 * A lathe profile for one tiffin container: flat base, near-vertical wall and a
 * flared rim, so a stack of them reads as the real thing rather than as bowls.
 */
export function tiffinProfile(height = 0.46, radius = 0.66) {
  const h = height
  const r = radius
  return [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(r * 0.6, 0),
    new THREE.Vector2(r * 0.88, h * 0.042),
    new THREE.Vector2(r * 0.985, h * 0.11),
    new THREE.Vector2(r, h * 0.24),
    new THREE.Vector2(r, h * 0.79),
    new THREE.Vector2(r * 1.016, h * 0.88),
    new THREE.Vector2(r * 1.058, h * 0.95),
    new THREE.Vector2(r * 1.028, h),
  ]
}

/** The shallow lid that caps the stack. */
export function lidProfile(radius = 0.66, height = 0.11) {
  const r = radius
  const h = height
  return [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(r * 0.66, 0),
    new THREE.Vector2(r * 0.94, h * 0.3),
    new THREE.Vector2(r * 1.0, h * 0.68),
    new THREE.Vector2(r * 1.012, h),
  ]
}
