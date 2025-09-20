const crypto = require('crypto')

console.log('🔐 Generating secrets for Quiet Hours Scheduler...\n')

// Generate NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('base64')
console.log('NEXTAUTH_SECRET=' + nextAuthSecret)

// Generate CRON secret
const cronSecret = crypto.randomBytes(32).toString('base64')
console.log('CRON_SECRET=' + cronSecret)

console.log('\n✅ Copy these values to your .env.local file')
console.log('\n📝 Don\'t forget to also set up:')
console.log('   - Supabase credentials')
console.log('   - MongoDB URI')
console.log('   - Email configuration')
