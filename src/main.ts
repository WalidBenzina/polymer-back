import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { DatabaseSeeder } from './seeders/database.seeder'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  // Enable CORS with environment variables
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Polymer Auth API')
    .setDescription('Authentication API for Polymer Africa App')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: `JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"`,
        in: 'header',
      },
      'JWT-auth'
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  // Run database seeder in production environment
  if (process.env.KOYEB === 'true' && process.env.AUTO_SEED === 'true') {
    try {
      const databaseSeeder = app.get(DatabaseSeeder)
      console.log('🌱 Starting automatic database seeding in production...')
      await databaseSeeder.seed()
      console.log('✅ Production database seeding completed successfully')
    } catch (error) {
      console.error('❌ Error during production database seeding:', error)
    }
  }

  await app.listen(process.env.APP_PORT || 3000)
  console.log(`Polymer Africa Backend Application is running on: ${await app.getUrl()}`)
}
bootstrap()
