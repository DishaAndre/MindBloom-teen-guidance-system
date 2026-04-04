import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', age: '' })
  const [err,  setErr]  = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const submit = async e => {
    e.preventDefault(); setErr(''); 

    if (form.password !== form.confirmPassword) {
      return setErr('Passwords do not match.')
    }

    setBusy(true)
    try {
      // Create user profile in our backend MongoDB (triggers nodemailer confirmation email)
      await axios.post('/api/register', {
        username: form.username,
        password: form.password,
        name: form.name,
        age: form.age,
        email: form.email,
      })

      // Show "check your email" success state
      setDone(true)
    } catch (e) {
      const msg = e.response?.data?.error || e?.error || e?.message || 'Something went wrong.'
      setErr(msg)
    }
    finally { setBusy(false) }
  }
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}))

  // ── Success state — check your email ──
  if (done) return (
    <div className="min-h-screen bg-[#f7f8f6] flex items-center justify-center p-6">
      <div className="w-full max-w-[460px] fade">
        <Link to="/login" className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 3C8.5 3 5.5 6.5 5.5 10.5c0 2.5 1.2 4.7 3.1 6.1L12 19l3.4-2.4c1.9-1.4 3.1-3.6 3.1-6.1C18.5 6.5 15.5 3 12 3z" fill="white" opacity=".9"/>
              <circle cx="12" cy="10.5" r="2.5" fill="white" opacity=".5"/>
            </svg>
          </div>
          <span className="font-display text-stone-800 text-xl font-medium">MindBloom</span>
        </Link>

        <div className="card shadow-lift text-center py-10">
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2 className="font-display text-2xl text-stone-800 mb-2">Check your email</h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto mb-2">
            We've sent a confirmation link to:
          </p>
          <p className="text-teal-700 font-semibold text-sm mb-6">{form.email}</p>
          <p className="text-stone-400 text-xs leading-relaxed max-w-xs mx-auto">
            Click the link in the email to verify your account, then come back and sign in. It may take a minute to arrive — also check your spam folder.
          </p>
        </div>

        <p className="text-center text-sm text-stone-500 mt-5">
          Already verified?{' '}
          <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )

  // ── Registration form ──
  return (
    <div className="min-h-screen bg-[#f7f8f6] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] fade">
        <Link to="/login" className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 3C8.5 3 5.5 6.5 5.5 10.5c0 2.5 1.2 4.7 3.1 6.1L12 19l3.4-2.4c1.9-1.4 3.1-3.6 3.1-6.1C18.5 6.5 15.5 3 12 3z" fill="white" opacity=".9"/>
              <circle cx="12" cy="10.5" r="2.5" fill="white" opacity=".5"/>
            </svg>
          </div>
          <span className="font-display text-stone-800 text-xl font-medium">MindBloom</span>
        </Link>

        <h2 className="font-display text-3xl text-stone-800 mb-1">Create account</h2>
        <p className="text-stone-500 text-sm mb-8">Free for children aged 10 to 13.</p>

        <div className="card shadow-lift">
          {err && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {err}
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First name</label>
                <input className="input" placeholder="e.g. Alex" value={form.name} onChange={f('name')} required />
              </div>
              <div>
                <label className="label">Age</label>
                <input type="number" className="input" placeholder="10–13" min="10" max="13" value={form.age} onChange={f('age')} required />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="your.email@example.com" value={form.email} onChange={f('email')} required />
              <p className="text-xs text-stone-400 mt-1.5">We'll send a verification link to this email.</p>
            </div>
            <div>
              <label className="label">Username</label>
              <input className="input" placeholder="Choose a nickname (not your real name)" value={form.username} onChange={f('username')} required />
              <p className="text-xs text-stone-400 mt-1.5">Use a nickname to protect your privacy.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} className="input pr-10" placeholder="At least 6 characters" minLength="6" value={form.password} onChange={f('password')} required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-teal-600 transition-colors">
                    {showPwd ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} className="input pr-10" placeholder="Repeat your password" minLength="6" value={form.confirmPassword} onChange={f('confirmPassword')} required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-teal-600 transition-colors">
                    {showPwd ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="btn-main w-full py-3 text-sm mt-1" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
