const cron = require('node-cron')
const fetch = require('node-fetch')

// Run every minute
cron.schedule('* * * * *', async () => {
  console.log('Running cron job at:', new Date().toISOString())
  
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/cron/process-notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Cron job result:', result)
    } else {
      console.error('Cron job failed:', response.status, await response.text())
    }
  } catch (error) {
    console.error('Error running cron job:', error)
  }
})

console.log('Cron processor started. Running every minute...')
