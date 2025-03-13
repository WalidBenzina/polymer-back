#!/usr/bin/env node

/**
 * Script to manually run the database seeder
 * Usage: node scripts/seed-db.js
 */

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

console.log(`🌱 Running database seeder in ${process.env.NODE_ENV} environment...`)

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
