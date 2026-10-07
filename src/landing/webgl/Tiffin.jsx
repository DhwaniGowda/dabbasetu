import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { story } from '../story'
import { TIFFIN_TRACK, emptyState, track } from '../film'
import {
  lidProfile,
  makeBrushedSteelTexture,
  makeRouteCodeTexture,
  makeTagTexture,
  tiffinProfile,
} from './steel'

const LAYERS = 3
const CONTAINER_H = 0.46
const CONTAINER_R = 0.66
const GAP = 0.032
const JOINT = CONTAINER_H + GAP
const STACK_H = (LAYERS - 1) * JOINT + CONTAINER_H
const CLAMP_H = 0.12

const state = emptyState()

const STEEL = {
  color: '#c6c9cd',
  metalness: 0.94,
  roughness: 0.5,
  envMapIntensity: 1.15,
}

/**
 * The Mumbai steel tiffin — the main 3D object and the one thing that appears in
 * every chapter.
 *
 * Built from lathe profiles and primitives rather than a loaded GLTF, so there
 * is no mesh decode on the critical path. Every movement is a function of the
 * single film clock: the slow push-in, the travel along the rail, the layers
 * opening to reveal the painted code, and the settle at the end.
 */
export default function Tiffin() {
  const root = useRef()
  const spinner = useRef()
  const rig = useRef()
  const layers = useRef([])
  const lid = useRef()
  const rods = useRef([])
  const yoke = useRef()
  const decal = useRef()
  const tag = useRef()
  const qr = useRef()

  const brushed = useMemo(() => makeBrushedSteelTexture(), [])
  const code = useMemo(() => makeRouteCodeTexture(), [])
  const tagTex = useMemo(() => makeTagTexture(), [])
  const body = useMemo(() => tiffinProfile(CONTAINER_H, CONTAINER_R), [])
  const lidShape = useMemo(() => lidProfile(CONTAINER_R, 0.11), [])

  useFrame((_, delta) => {
    if (!story.awake) return
    const g = root.current
    if (!g) return

    track(TIFFIN_TRACK, story.film, state)

    const damp = Math.min(1, delta * 6)
    g.position.x += (state.pos[0] - g.position.x) * damp
    g.position.y += (state.pos[1] - g.position.y) * damp
    g.position.z += (state.pos[2] - g.position.z) * damp
    g.scale.setScalar(g.scale.x + (state.scale - g.scale.x) * damp)

    // Barely-there response to the pointer; the viewer is still being directed.
    const px = story.static ? 0 : story.pointer.x
    const py = story.static ? 0 : story.pointer.y
    spinner.current.rotation.y += (state.rot[1] + px * 0.16 - spinner.current.rotation.y) * damp * 0.7
    spinner.current.rotation.x += (state.rot[0] + py * -0.09 - spinner.current.rotation.x) * damp * 0.7
    spinner.current.rotation.z += (state.rot[2] - spinner.current.rotation.z) * damp * 0.6

    const visible = state.opacity > 0.02
    g.visible = visible
    if (!visible) return

    const lift = state.spread
    // Keep the whole carrier centred as the top container opens.
    rig.current.position.y = -(STACK_H + CLAMP_H) / 2 - lift * 0.5

    layers.current.forEach((layer, i) => {
      if (!layer) return
      layer.position.y = i * JOINT + (i === LAYERS - 1 ? lift : 0)
    })

    const top = (LAYERS - 1) * JOINT
    if (lid.current) lid.current.position.y = top + CONTAINER_H + lift - 0.055

    const rodTop = STACK_H + CLAMP_H + lift
    rods.current.forEach((rod) => {
      if (!rod) return
      rod.position.y = rodTop / 2
      rod.scale.y = rodTop / (STACK_H + CLAMP_H)
    })
    if (yoke.current) yoke.current.position.y = rodTop

    const fade = Math.min(1, state.opacity * 1.6)
    if (decal.current) decal.current.material.opacity = fade
    if (tag.current) tag.current.material.opacity = fade

    if (qr.current) {
      // The painted crate code becomes a digital QR as the layers open.
      const o = Math.max(0, Math.min(0.94, (lift - 0.02) * 6)) * fade
      qr.current.material.opacity = o
      qr.current.visible = o > 0.01
    }
  })

  return (
    <group ref={root} visible={false}>
      <group ref={spinner}>
        <group ref={rig}>
          {Array.from({ length: LAYERS }, (_, i) => (
            <group key={i} ref={(el) => (layers.current[i] = el)} position={[0, i * JOINT, 0]}>
              <mesh>
                <latheGeometry args={[body, 40]} />
                <meshStandardMaterial
                  color={STEEL.color}
                  metalness={STEEL.metalness}
                  roughness={STEEL.roughness}
                  roughnessMap={brushed}
                  envMapIntensity={STEEL.envMapIntensity}
                />
              </mesh>
              {/* Interchangeable seam ring at the joint. */}
              <mesh position={[0, CONTAINER_H * 0.94, 0]}>
                <torusGeometry args={[CONTAINER_R * 1.042, 0.014, 6, 28]} />
                <meshStandardMaterial color="#b6b9be" metalness={0.9} roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Lid */}
          <group ref={lid} position={[0, (LAYERS - 1) * JOINT + CONTAINER_H - 0.055, 0]}>
            <mesh>
              <latheGeometry args={[lidShape, 32]} />
              <meshStandardMaterial
                color="#cbced2"
                metalness={0.94}
                roughness={0.44}
                roughnessMap={brushed}
                envMapIntensity={1.2}
              />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.05, 16, 12]} />
              <meshStandardMaterial color="#f97316" metalness={0.3} roughness={0.42} />
            </mesh>
          </group>

          {/* The SETU orange band, painted rather than chromed. */}
          <mesh position={[0, CONTAINER_H * 0.78, 0]}>
            <cylinderGeometry args={[CONTAINER_R * 1.014, CONTAINER_R * 1.014, 0.055, 40, 1, true]} />
            <meshStandardMaterial
              color="#f97316"
              metalness={0.14}
              roughness={0.56}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Painted code on the middle container, as a curved decal. */}
          <mesh ref={decal} position={[0, JOINT + CONTAINER_H * 0.5, 0]}>
            <cylinderGeometry
              args={[CONTAINER_R * 1.03, CONTAINER_R * 1.03, CONTAINER_H * 0.86, 40, 1, true, -1.05, 2.1]}
            />
            <meshStandardMaterial
              map={code}
              transparent
              depthWrite={false}
              roughness={0.62}
              metalness={0.06}
              polygonOffset
              polygonOffsetFactor={-4}
            />
          </mesh>

          {/* The digital QR, hidden between the layers until they open. */}
          <mesh ref={qr} position={[0, (LAYERS - 1) * JOINT - 0.03, 0.44]} visible={false}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial
              color="#fffdf8"
              transparent
              opacity={0}
              roughness={0.7}
              metalness={0.05}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Clamp frame */}
          {[-1, 1].map((side, i) => (
            <mesh
              key={side}
              ref={(el) => (rods.current[i] = el)}
              position={[side * (CONTAINER_R + 0.05), (STACK_H + CLAMP_H) / 2, 0]}
            >
              <cylinderGeometry args={[0.024, 0.024, STACK_H + CLAMP_H, 10]} />
              <meshStandardMaterial color="#a9adb2" metalness={0.9} roughness={0.38} />
            </mesh>
          ))}

          <group ref={yoke} position={[0, STACK_H + CLAMP_H, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.022, 0.022, (CONTAINER_R + 0.05) * 2, 10]} />
              <meshStandardMaterial color="#a9adb2" metalness={0.9} roughness={0.38} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0.24, 0]}>
              <torusGeometry args={[0.22, 0.024, 8, 20, Math.PI]} />
              <meshStandardMaterial color="#a9adb2" metalness={0.9} roughness={0.36} />
            </mesh>
          </group>

          <mesh ref={tag} position={[CONTAINER_R + 0.14, STACK_H * 0.5, 0.14]} rotation={[0, -0.44, 0.05]}>
            <planeGeometry args={[0.44, 0.22]} />
            <meshStandardMaterial
              map={tagTex}
              transparent
              side={THREE.DoubleSide}
              roughness={0.72}
              metalness={0.04}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}
