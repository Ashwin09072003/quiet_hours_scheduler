'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SimpleTestPage() {
  const [result, setResult] = useState('')

  useEffect(() => {
    const testAuth = async () => {
      try {
        // Test 1: Check Supabase connection
        setResult('Testing Supabase connection...\n')
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        setResult(prev => prev + `Session check: ${session ? 'Found' : 'None'}\n`)
        if (sessionError) {
          setResult(prev => prev + `Session error: ${sessionError.message}\n`)
        }

        // Test 2: Try to sign up
        setResult(prev => prev + '\nTesting signup...\n')
        const testEmail = `test${Date.now()}@example.com`
        const testPassword = 'testpassword123'
        
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
        })
        
        setResult(prev => prev + `Signup result: ${signupError ? 'Error' : 'Success'}\n`)
        if (signupError) {
          setResult(prev => prev + `Signup error: ${signupError.message}\n`)
        } else {
          setResult(prev => prev + `User created: ${signupData.user?.id}\n`)
          setResult(prev => prev + `Email confirmed: ${signupData.user?.email_confirmed_at ? 'Yes' : 'No'}\n`)
        }

        // Test 3: Try to sign in immediately
        if (!signupError) {
          setResult(prev => prev + '\nTesting signin...\n')
          const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          })
          
          setResult(prev => prev + `Signin result: ${signinError ? 'Error' : 'Success'}\n`)
          if (signinError) {
            setResult(prev => prev + `Signin error: ${signinError.message}\n`)
          } else {
            setResult(prev => prev + `Signed in user: ${signinData.user?.id}\n`)
          }
        }

        // Test 4: Check environment variables
        setResult(prev => prev + '\nEnvironment check:\n')
        setResult(prev => prev + `SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}\n`)
        setResult(prev => prev + `SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}\n`)

      } catch (error) {
        setResult(prev => prev + `\nUnexpected error: ${error}\n`)
      }
    }

    testAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-center mb-6">Simple Auth Test</h1>
          
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
            {result || 'Running tests...'}
          </pre>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Run Test Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
