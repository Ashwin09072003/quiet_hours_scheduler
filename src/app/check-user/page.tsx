'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CheckUserPage() {
  const [email, setEmail] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const checkUser = async () => {
    if (!email) {
      setMessage('Please enter an email address')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // This requires the service role key to work
      const { data, error } = await supabase.auth.admin.listUsers()
      
      if (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        console.error('Admin error:', error)
      } else {
        const user = data.users.find(u => u.email === email)
        if (user) {
          setMessage(`User found: ${user.email} - Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
          setUsers([user])
        } else {
          setMessage('User not found')
          setUsers([])
        }
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-center mb-6">Check User Status</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email to check</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the email you signed up with"
              />
            </div>
            
            <button
              onClick={checkUser}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check User Status'}
            </button>

            {message && (
              <div className={`p-3 rounded ${
                message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}

            {users.length > 0 && (
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold">User Details:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(users[0], null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-6 text-center space-x-4">
            <a href="/test-auth" className="text-indigo-600 hover:text-indigo-500">
              Test Auth
            </a>
            <a href="/debug" className="text-indigo-600 hover:text-indigo-500">
              Debug
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
