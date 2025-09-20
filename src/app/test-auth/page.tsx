'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setMessage('Already signed in!')
      }
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session)
        if (session?.user) {
          setUser(session.user)
          setMessage('Signed in successfully!')
        } else {
          setUser(null)
          setMessage('Signed out')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      console.log('Attempting sign up with:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log('Sign up response:', { data, error })

      if (error) {
        setMessage(`Sign up error: ${error instanceof Error ? error.message : String(error)}`)
        console.error('Sign up error details:', error)
      } else {
        if (data.user && !data.user.email_confirmed_at) {
          setMessage('User created but email confirmation required. Check your email or disable email confirmations in Supabase settings.')
        } else {
          setMessage('User created successfully! You can now sign in.')
        }
        console.log('User data:', data.user)
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`)
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      console.log('Attempting sign in with:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Sign in response:', { data, error })

      if (error) {
        setMessage(`Sign in error: ${error instanceof Error ? error.message : String(error)}`)
        console.error('Sign in error details:', error)
      } else {
        setMessage('Signed in successfully!')
        setUser(data.user)
        console.log('User data:', data.user)
        
        // Check session after sign in
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session after sign in:', session)
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`)
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } else {
      setMessage('Signed out successfully!')
      setUser(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-center mb-6">Auth Test</h1>
          
          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {user ? (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold">Signed in as:</h3>
                <p>Email: {user.email}</p>
                <p>ID: {user.id}</p>
                <p>Created: {new Date(user.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <h3 className="text-lg font-semibold">Sign Up</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>

              <div className="border-t pt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <h3 className="text-lg font-semibold">Sign In</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <a href="/debug" className="text-indigo-600 hover:text-indigo-500">
              Go to Debug Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
