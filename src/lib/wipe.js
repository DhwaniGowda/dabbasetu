import { useEffect, useRef } from 'react'

/**
 * A single, app-wide transition channel. The overlay itself lives in App so it
 * survives the route change it is covering — otherwise the wipe would unmount
 * halfway through and the next screen would appear hard.
 */
export const wipe = { play: null }
