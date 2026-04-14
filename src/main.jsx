import { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell app-background flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="modal-surface w-full max-w-md rounded-[2rem] p-8 sm:p-10">
            <p className="text-label mb-3">Application Error</p>
            <p className="text-sm font-semibold text-gray-600">Something went wrong. Please reload the page.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3 text-xs uppercase tracking-widest"
            aria-label="Reload application"
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
)
