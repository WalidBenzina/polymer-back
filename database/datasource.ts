import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'

config() // Charge les variables d'environnement depuis .env

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'polymer_africa_db',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: process.env.NODE_ENV === 'production',
  extra: {
    ...(process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
          sslmode: 'require',
        }
      : {}),
  },
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
