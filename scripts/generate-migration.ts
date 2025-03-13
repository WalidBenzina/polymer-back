import { execSync } from 'child_process'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Nom de la migration: ', (migrationName) => {
  try {
    if (!migrationName) {
      console.error('❌ Le nom de la migration est requis')
      process.exit(1)
    }

    // Formatter le nom (convertir les espaces en tirets, etc.)
    const formattedName = migrationName
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')

    // Générer la migration
    execSync(`npm run migration:generate --name=${formattedName}`, { stdio: 'inherit' })
    console.log(`✅ Migration "${formattedName}" générée avec succès`)

    rl.close()
  } catch (error) {
    console.error('❌ Erreur lors de la génération de la migration:', error)
    rl.close()
    process.exit(1)
  }
})
