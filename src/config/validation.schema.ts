import * as Joi from 'joi'

export const validationSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Application
  APP_PORT: Joi.number().default(3000),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRES_IN: Joi.string().default('24h'),

  // CORS
  ALLOWED_ORIGINS: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: Joi.number().default(12),

  // Rate limiting
  THROTTLE_LIMIT: Joi.number().default(10),

  // Test specific
  AUTO_SEED: Joi.boolean().default(false),
})
