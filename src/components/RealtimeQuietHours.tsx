'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QuietHourBlock } from '@/types'

interface RealtimeQuietHoursProps {
  onUpdate: () => void
}

export default function RealtimeQuietHours({ onUpdate }: RealtimeQuietHoursProps) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Set up real-time subscription for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          onUpdate()
        }
      }
    )

    // Set up real-time subscription for any database changes
    // Note: This would require setting up a Supabase table for quiet hours
    // For now, we'll use polling or manual refresh
    const interval = setInterval(() => {
      onUpdate()
    }, 30000) // Refresh every 30 seconds

    setIsConnected(true)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [onUpdate])

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  )
}
