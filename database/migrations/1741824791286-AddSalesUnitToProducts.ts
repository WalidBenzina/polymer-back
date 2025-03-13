import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSalesUnitToProducts1741824791286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before adding them
    const prixPaletteExists = await queryRunner.hasColumn('produits', 'prixPalette')
    const prixContainerExists = await queryRunner.hasColumn('produits', 'prixContainer')

    // Only add columns if they don't exist
    if (!prixPaletteExists || !prixContainerExists) {
      let query = 'ALTER TABLE produits '

      if (!prixPaletteExists) {
        query += 'ADD COLUMN "prixPalette" DECIMAL DEFAULT NULL'
      }

      if (!prixContainerExists) {
        if (!prixPaletteExists) query += ', '
        query += 'ADD COLUMN "prixContainer" DECIMAL DEFAULT NULL'
      }

      await queryRunner.query(query)
    }

    // Create enum type for sales unit if it doesn't exist
    await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sales_unit_enum') THEN
                    CREATE TYPE sales_unit_enum AS ENUM ('PALETTE', 'CONTAINER');
                END IF;
            END
            $$;
        `)

    // Check if uniteVente column exists before adding it
    const uniteVenteExists = await queryRunner.hasColumn('line_items', 'uniteVente')
    if (!uniteVenteExists) {
      // Add sales unit column to line_items table
      await queryRunner.query(`
              ALTER TABLE line_items
              ADD COLUMN "uniteVente" sales_unit_enum DEFAULT 'PALETTE'
          `)
    }

    // Update existing products to set default values for palette and container prices
    await queryRunner.query(`
            UPDATE produits
            SET "prixPalette" = prix * 10
            WHERE "prixPalette" IS NULL
        `)

    await queryRunner.query(`
            UPDATE produits
            SET "prixContainer" = prix * 100
            WHERE "prixContainer" IS NULL
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if uniteVente column exists before dropping it
    const uniteVenteExists = await queryRunner.hasColumn('line_items', 'uniteVente')
    if (uniteVenteExists) {
      // Remove sales unit column from line_items table
      await queryRunner.query(`
              ALTER TABLE line_items
              DROP COLUMN "uniteVente"
          `)
    }

    // We don't drop the price columns since they might be used elsewhere
    // We don't drop the enum type as it might be used elsewhere
  }
}
