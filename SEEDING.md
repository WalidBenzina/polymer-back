# Database Seeding Guide

This document explains how to use the database seeding functionality in the Polymer Africa backend application.

## Automatic Seeding in Production

The application can automatically seed the database when running in production mode. This is useful for initializing a new production environment with necessary data.

### Configuration

To enable automatic seeding in production, set the following environment variables:

```
NODE_ENV=production
AUTO_SEED=true
```

When the application starts with these environment variables set, it will automatically run the database seeder.

### Docker Example

If you're using Docker, you can set these environment variables in your docker-compose.yml file:

```yaml
services:
  api:
    image: polymer-africa-backend
    environment:
      - NODE_ENV=production
      - AUTO_SEED=true
      # Other environment variables...
```

Or when running a Docker container directly:

```bash
docker run -e NODE_ENV=production -e AUTO_SEED=true polymer-africa-backend
```

## Manual Seeding

You can also run the database seeder manually using one of the following methods:

### Using npm script

```bash
# Run the seeder in the current environment
npm run seed

# Run the seeder using the convenience script
npm run seed:manual
```

### Using nest-commander directly

```bash
# Using the NestJS CLI
npx nest start -- seed
```

## Seeding in Development

During development, you can run the seeder manually as needed:

```bash
# Run in development mode
NODE_ENV=development npm run seed
```

## Caution

⚠️ **Warning**: The seeder will clear all existing data in the database before seeding new data. Make sure you have backups of any important data before running the seeder in production.

## Customizing Seed Data

To modify the seed data, edit the relevant methods in the `src/seeders/database.seeder.ts` file:

- `seedRoles()`: Modify role data
- `seedProducts()`: Modify product data
- `seedClients()`: Modify client data
- `seedUsers()`: Modify user data
- `seedOrders()`: Modify order data
- `seedProductThresholds()`: Modify product threshold data
