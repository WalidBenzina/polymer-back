import { Command, CommandRunner } from 'nest-commander'
import { DatabaseSeeder } from './database.seeder'
import { Injectable } from '@nestjs/common'

@Injectable()
@Command({ name: 'seed', description: 'Seed the database with initial data' })
export class SeedCommand extends CommandRunner {
  constructor(private readonly databaseSeeder: DatabaseSeeder) {
    super()
  }

  async run(): Promise<void> {
    try {
      await this.databaseSeeder.seed()
      process.exit(0)
    } catch (error) {
      console.error('Failed to seed database:', error)
      process.exit(1)
    }
  }
}
