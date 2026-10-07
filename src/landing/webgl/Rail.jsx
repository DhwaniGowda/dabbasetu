import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { story } from '../story'
import { clamp01, lerp, smoothstep } from '../film'

const UPCOMING = new THREE.Color('#8f8578')
const ACTIVE = new THREE.Color('#f97316')
const DONE = new THREE.Color('#2f6b4f')
const CREAM = new THREE.Color('#faf7ef')

const ease = (v, target, delta, rate = 5) => v + (target - v) * Math.min(1, delta * rate)

/**
 * A dimensional railway line in WebGL.
 *
 * The camera does not travel — the *world* does. As the film advances the rail
 * slides past a fixed central tiffin, easing to a brief stop at every station,
 * which is what makes each stop feel locked rather than scrolled.
 *
 * Used twice: five stations for the Mumbai travel chapter, four QR checkpoints
 * for the tracking chapter.
 */
export default function RailRoad({
  phase,
  count,
  spread,
  railY = -0.9,
  dark = false,
  qr = false,
  className = '',
}) {
  const group = useRef()
  const rail = useRef()
  const nodes = useRef([])
  const halos = useRef([])
  const tiles = useRef([])

  // Always loaded (15 kB, cached): a conditional hook would be a bug waiting to happen.
  const qrTexture = useTexture('/assets/setu-qr.png')

  const positions = useMemo(() => {
    if (count < 2) return [0]
    return Array.from({ length: count }, (_, i) => -spread + (i / (count - 1)) * spread * 2)
  }, [count, spread])

  const materials = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        node: new THREE.MeshStandardMaterial({
          color: dark ? CREAM.clone() : UPCOMING.clone(),
          roughness: 0.5,
          metalness: dark ? 0.2 : 0.35,
          transparent: true,
        }),
        halo: new THREE.MeshBasicMaterial({
          color: ACTIVE.clone(),
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      })),
    [count, dark],
  )

  useFrame((_, delta) => {
    if (!story.awake) return
    const [start, end] = phase
    const raw = (story.film - start) / (end - start)
    const p = clamp01(raw)
    // Window: fully visible through the chapter, fading at the edges.
    const opacity = Math.max(0, Math.min(1, Math.min(p, 1 - p) / 0.06 + 0.02))
    const g = group.current
    if (!g) return

    g.visible = opacity > 0.015
    if (!g.visible) return

    // Stepped easing: a cinematic stop at every station.
    const u = p * (count - 1)
    const i = Math.floor(u)
    const t = u - i
    const eased = Math.min(count - 1, i + smoothstep(t))
    const offset = (eased / Math.max(1, count - 1)) * spread * 2

    g.position.x = ease(g.position.x, spread - offset, delta, 7)

    const railMat = rail.current?.material
    if (railMat) railMat.opacity = opacity * (dark ? 0.34 : 0.85)

    const activeIndex = Math.round(eased)

    nodes.current.forEach((node, index) => {
      if (!node) return
      const mat = materials[index].node
      const isActive = index === activeIndex
      const isDone = index < activeIndex - 0.35
      const target = isActive ? ACTIVE : isDone ? DONE : dark ? CREAM : UPCOMING
      mat.color.lerp(target, Math.min(1, delta * 6))
      mat.opacity = opacity * (dark && !isActive && !isDone ? 0.5 : 1)

      const dist = Math.abs(eased - index)
      const focus = Math.max(0, 1 - dist * 0.9)
      node.scale.setScalar(ease(node.scale.x, 0.9 + focus * 0.5, delta, 6))

      const halo = halos.current[index]
      if (halo) {
        const pulse = isActive ? 0.5 + 0.5 * Math.sin(performance.now() * 0.004) : 0
        halo.material.opacity = ease(halo.material.opacity, (focus * 0.18 + pulse * (isActive ? 0.3 : 0)) * opacity, delta, 6)
        halo.scale.setScalar(ease(halo.scale.x, 1 + pulse * 0.6, delta, 5))
      }

      const tile = tiles.current[index]
      if (tile) {
        // The QR only exists once its station has been reached.
        const reveal = isDone || isActive ? 1 : 0
        tile.material.opacity = ease(tile.material.opacity, reveal * opacity * 0.95, delta, 4)
        tile.visible = tile.material.opacity > 0.02
        tile.rotation.y = ease(tile.rotation.y, (1 - (isDone ? 1 : focus)) * -1.1, delta, 4)
        tile.position.y = ease(tile.position.y, (isDone ? 1.05 : 0.78) , delta, 4)
      }
    })
  })

  return (
    <group ref={group} visible={false}>
      {/* The rail itself, long enough to leave the frame at both ends. */}
      <mesh ref={rail} position={[0, railY, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, spread * 6, 6]} />
        <meshBasicMaterial color={dark ? '#faf7ef' : '#1a1a1a'} transparent opacity={0} />
      </mesh>

      {positions.map((x, index) => (
        <group key={index} position={[x, railY, 0]}>
          <mesh ref={(el) => (nodes.current[index] = el)}>
            <torusGeometry args={[0.115, 0.036, 10, 28]} />
            <primitive object={materials[index].node} attach="material" />
          </mesh>
          <mesh ref={(el) => (halos.current[index] = el)}>
            <circleGeometry args={[0.42, 28]} />
            <primitive object={materials[index].halo} attach="material" />
          </mesh>
          {qr && (
            <mesh
              ref={(el) => (tiles.current[index] = el)}
              position={[0, 0.78, 0]}
              rotation={[0, 0, 0]}
            >
              <planeGeometry args={[0.52, 0.52]} />
              <meshBasicMaterial
                map={qrTexture}
                transparent
                opacity={0}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}
