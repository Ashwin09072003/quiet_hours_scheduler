'use client'

import { useEffect, useState } from 'react'
import { QuietHourBlock } from '@/types'
import { format } from 'date-fns'
import { getCurrentUser } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function QuietHoursList() {
  const [blocks, setBlocks] = useState<QuietHourBlock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBlocks()
  }, [])

  const loadBlocks = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      const response = await fetch('/api/quiet-hours')
      if (response.ok) {
        const data = await response.json()
        setBlocks(data)
      } else {
        toast.error('Failed to load quiet hours')
      }
    } catch (error) {
      console.error('Error loading blocks:', error)
      toast.error('Error loading quiet hours')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiet hours block?')) {
      return
    }

    try {
      const response = await fetch(`/api/quiet-hours/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Quiet hours deleted successfully')
        loadBlocks()
      } else {
        toast.error('Failed to delete quiet hours')
      }
    } catch (error) {
      console.error('Error deleting block:', error)
      toast.error('Error deleting quiet hours')
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/quiet-hours/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        toast.success(`Quiet hours ${!isActive ? 'activated' : 'deactivated'}`)
        loadBlocks()
      } else {
        toast.error('Failed to update quiet hours')
      }
    } catch (error) {
      console.error('Error updating block:', error)
      toast.error('Error updating quiet hours')
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (blocks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No quiet hours scheduled yet.</p>
        <p className="text-sm text-gray-400 mt-1">Create your first quiet hours block using the form on the left.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Scheduled Quiet Hours</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {blocks.map((block) => (
          <div key={block._id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900">{block.title}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    block.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {block.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {block.isRecurring && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {block.recurringPattern}
                    </span>
                  )}
                </div>
                
                {block.description && (
                  <p className="mt-1 text-sm text-gray-600">{block.description}</p>
                )}
                
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    <span className="font-medium">Start:</span> {format(new Date(block.startTime), 'MMM d, yyyy h:mm a')}
                  </p>
                  <p>
                    <span className="font-medium">End:</span> {format(new Date(block.endTime), 'MMM d, yyyy h:mm a')}
                  </p>
                  {block.emailSent && (
                    <p className="text-green-600">
                      <span className="font-medium">Email sent:</span> {format(new Date(block.emailSentAt!), 'MMM d, yyyy h:mm a')}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleActive(block._id!, block.isActive)}
                  className={`text-sm px-3 py-1 rounded ${
                    block.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {block.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(block._id!)}
                  className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
