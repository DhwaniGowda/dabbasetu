import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Preload } from '@react-three/drei'
import { story } from '../story'
import { CAMERA_TRACK, emptyState, track } from '../film'
import Tiffin from './Tiffin'
import RailRoad from './Rail'

const camState = emptyState()

/**
 * The camera is directed, never free. Every position is keyed to the film
 * clock, with a very small pointer parallax on top so the scene still feels
 * alive when the viewer is not scrolling.
 */
function CameraRig() {
  useFrame(({ camera }, delta) => {
    if (!story.awake) return
    const damp = Math.min(1, delta * 3.4)
    track(CAMERA_TRACK, story.film, camState)

    const px = story.static ? 0 : story.pointer.x
    const py = story.static ? 0 : story.pointer.y
    camera.position.x += (camState.pos[0] + px * 0.18 - camera.position.x) * damp
    camera.position.y += (camState.pos[1] + py * 0.11 - camera.position.y) * damp
    camera.position.z += (camState.pos[2] - camera.position.z) * damp
    camera.rotation.x += (camState.rot[0] - camera.rotation.x) * damp
    camera.rotation.y += (camState.rot[1] + px * 0.02 - camera.rotation.y) * damp
  })
  return null
}

/**
 * Product-CGI lighting for the tiffin: a soft warm key, an orange reflected
 * accent from the side, and a cream rim from behind. The environment is built
 * from Lightformers rather than an HDR file, so nothing is fetched.
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.34} />
      <directionalLight position={[3.4, 5.6, 3.8]} intensity={2.05} color="#fff6e8" />
      <directionalLight position={[-4.2, 1.4, -3.2]} intensity={0.75} color="#f97316" />
      <spotLight position={[0, 4.6, -5.2]} angle={0.8} penumbra={1} intensity={1.5} color="#faf7ef" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.7} position={[0, 3.4, 3.8]} scale={[9, 4, 1]} color="#fffaf0" />
        <Lightformer intensity={1.15} rotation-y={-Math.PI / 2} position={[-5.2, 1.4, 0]} scale={[7, 7, 1]} color="#f5f2ea" />
        <Lightformer intensity={1.6} rotation-y={Math.PI / 2} position={[5.2, 1.1, 0]} scale={[7, 7, 1]} color="#f97316" />
        <Lightformer intensity={0.7} rotation-x={Math.PI / 2} position={[0, 5.4, 0]} scale={[9, 9, 1]} color="#ffffff" />
      </Environment>
    </>
  )
}

/**
 * One canvas for the whole film.
 *
 * It is fixed behind the DOM and never unmounts between chapters, which is what
 * lets the tiffin read as a single object travelling through one continuous
 * world rather than eight separate sections.
 */
export default function Scene({ compact = false, onReady }) {
  const dpr = useRef(compact ? [1, 1.3] : [1, 1.75]).current

  return (
    <Canvas
      className="pointer-events-none"
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 30, near: 0.1, far: 60, position: [0, 0, 6.4] }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0)
        onReady?.()
      }}
    >
      <CameraRig />
      <Lighting />

      <Suspense fallback={null}>
        <Tiffin />
        {/* The world moves sideways: five Mumbai stations, then four checkpoints. */}
        <RailRoad phase={[2.02, 3.12]} count={5} spread={6} />
        <RailRoad phase={[6.03, 7.32]} count={4} spread={4.5} dark qr />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
