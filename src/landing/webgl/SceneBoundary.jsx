import { Component } from 'react'

/**
 * If the WebGL module or the GPU cannot come up, the film must still play.
 *
 * Every chapter is DOM; the tiffin is the only thing that needs a GPU. So a
 * failure here is reported upward (which releases the loader) and the canvas is
 * simply not rendered, rather than taking the whole landing down with it.
 */
export default class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (typeof console !== 'undefined') {
      console.warn('[SETU] WebGL scene unavailable, continuing without it.', error)
    }
    this.props.onFail?.()
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
