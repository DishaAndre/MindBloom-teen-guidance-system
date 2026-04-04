import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'

export default function ConfirmEmail() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    const token = params.get('token')

    if (!token) {
      setStatus('error')
      setErrMsg('Invalid confirmation link. The token is missing.')
      return
    }

    axios.post('/api/verify-email', { token })
      .then(() => setStatus('success'))
      .catch(err => {
        console.error('Email confirmation error:', err)
        setStatus('error')
        const errorMessage = err.response?.data?.error || err.message;
        
        if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('expired')) {
          setErrMsg('This confirmation link is invalid or has expired.')
        } else {
          setErrMsg(errorMessage || 'Something went wrong. Please try again or request a new confirmation email.')
        }
      })
  }, [params])

  return (
    <div className="min-h-screen bg-[#f7f8f6] flex items-center justify-center p-6">
      <div className="w-full max-w-[460px] fade">
        {/* Logo */}
        <Link to="/login" className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 3C8.5 3 5.5 6.5 5.5 10.5c0 2.5 1.2 4.7 3.1 6.1L12 19l3.4-2.4c1.9-1.4 3.1-3.6 3.1-6.1C18.5 6.5 15.5 3 12 3z" fill="white" opacity=".9"/>
              <circle cx="12" cy="10.5" r="2.5" fill="white" opacity=".5"/>
            </svg>
          </div>
          <span className="font-display text-stone-800 text-xl font-medium">MindBloom</span>
        </Link>

        {/* ── Verifying ── */}
        {status === 'verifying' && (
          <div className="card shadow-lift text-center py-12">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-teal-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
            <h2 className="font-display text-2xl text-stone-800 mb-2">Verifying your email…</h2>
            <p className="text-stone-500 text-sm">Please wait while we confirm your account.</p>
          </div>
        )}

        {/* ── Success ── */}
        {status === 'success' && (
          <div className="card shadow-lift text-center py-12">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="font-display text-2xl text-stone-800 mb-2">Email confirmed!</h2>
            <p className="text-stone-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
              Your MindBloom account has been verified successfully. You can now sign in and start using the platform.
            </p>
            <Link to="/login" className="btn-main inline-flex items-center gap-2 px-6 py-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Go to Login
            </Link>
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="card shadow-lift text-center py-12">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h2 className="font-display text-2xl text-stone-800 mb-2">Verification failed</h2>
            <p className="text-stone-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">{errMsg}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="btn-soft inline-flex items-center gap-2 px-5 py-2.5 text-sm">
                Try registering again
              </Link>
              <Link to="/login" className="text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                Go to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
