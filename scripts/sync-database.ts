import dataSource from '../database/datasource'
import { execSync } from 'child_process'

async function syncDatabase(): Promise<void> {
  try {
    // Initialiser la connexion
    await dataSource.initialize()
    console.log('📊 Connexion à la base de données établie')

    // Synchroniser le schéma (comme synchronize: true)
    await dataSource.synchronize()
    console.log('🔄 Schéma de base de données synchronisé')

    // Demander le nom de la migration
    const timestamp = new Date().getTime()
    const migrationName = `Sync${timestamp}`

    // Générer une migration basée sur le nouvel état
    execSync(`npm run migration:generate --name=${migrationName}`, { stdio: 'inherit' })
    console.log(`✅ Migration "${migrationName}" générée`)

    await dataSource.destroy()
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error)
    process.exit(1)
  }
}

syncDatabase()
