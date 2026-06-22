import { Component } from 'react'
import Icon from './Icon'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-sm mx-auto px-6 py-20 flex flex-col items-center text-center gap-4">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-accent-soft text-accent">
            <Icon name="droplet" size={28} stroke={2.2} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-ink">Something went wrong</h1>
            <p className="text-sm text-muted mt-1">The app hit an unexpected error. Reloading usually fixes it.</p>
          </div>
          <button
            onClick={() => window.location.assign('/')}
            className="bg-accent text-white py-2.5 px-5 rounded-xl text-sm font-semibold hover:bg-accent-dark cursor-pointer active:scale-[0.99]"
          >
            Reload app
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
