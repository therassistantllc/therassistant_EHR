import { useState, type FormEvent } from 'react'
import { authService } from '../services/supabase'

interface AuthScreenProps {
  onAuthenticated: () => void
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'sign-up') {
        const result = await authService.signUp(email.trim(), password, displayName.trim() || undefined)
        if (result.requiresEmailConfirmation) {
          setMessage('Account created. Confirm your email, then return here to sign in.')
          setMode('sign-in')
          setPassword('')
        } else {
          onAuthenticated()
        }
      } else {
        await authService.signInWithPassword(email.trim(), password)
        onAuthenticated()
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-card__brand">
          <p className="eyebrow">THERASSISTANT</p>
          <h1>{mode === 'sign-in' ? 'Sign in' : 'Create your account'}</h1>
          <p>
            Secure access to the revenue cycle and clinical-readiness workspace is controlled by Supabase Auth and tenant-level permissions.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'sign-up' ? (
            <label>
              <span>Name</span>
              <input
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your name"
              />
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
          </label>

          {error ? <p className="form-message form-message--error">{error}</p> : null}
          {message ? <p className="form-message form-message--success">{message}</p> : null}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Working…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>

          <button
            className="text-button"
            type="button"
            onClick={() => {
              setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'))
              setError('')
              setMessage('')
            }}
          >
            {mode === 'sign-in' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
