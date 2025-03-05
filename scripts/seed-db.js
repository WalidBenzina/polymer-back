#!/usr/bin/env node

/**
 * Script to manually run the database seeder
 * Usage: node scripts/seed-db.js
 */

const { spawn } = require('child_process')
const path = require('path')

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

console.log(`🌱 Running database seeder in ${process.env.NODE_ENV} environment...`)

// Run the nest-commander seed command
const nestBin = path.resolve(__dirname, '../node_modules/.bin/nest')
const seedProcess = spawn(nestBin, ['start', '--', 'seed'], {
  stdio: 'inherit',
  shell: true,
})

seedProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Database seeding completed successfully')
  } else {
    console.error(`❌ Database seeding failed with code ${code}`)
    process.exit(code)
  }
})
