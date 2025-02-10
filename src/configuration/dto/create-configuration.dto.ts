import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsEmail, IsObject } from 'class-validator'

export class CreateConfigurationDto {
  @ApiProperty({
    description: "Nom de l'entreprise",
    example: 'TechCorp',
  })
  @IsString()
  nomEntreprise: string

  @ApiProperty({
    description: "Adresse de l'entreprise",
    example: '1234 Business St, Cityville, Country',
  })
  @IsString()
  adresseEntreprise: string

  @ApiProperty({
    description: 'Numéro de téléphone principal',
    example: '+1234567890',
  })
  @IsString()
  telephoneEntreprise1: string

  @ApiProperty({
    description: 'Numéro de téléphone secondaire',
    example: '+0987654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  telephoneEntreprise2: string

  @ApiProperty({
    description: "Email de l'entreprise",
    example: 'contact@techcorp.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  emailEntreprise: string

  @ApiProperty({
    description: "Site web de l'entreprise",
    example: 'https://www.techcorp.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  siteWebEntreprise: string

  @ApiProperty({
    description: "URL du logo de l'entreprise",
    example: 'https://www.techcorp.com/logo.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  logoEntrepriseUrl: string

  @ApiProperty({
    description: "Identifiants de l'entreprise sous forme de dictionnaire",
    example: { company_id: '12345', company_code: 'ABC' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  identifiantsEntreprise: Record<string, string>

  @ApiProperty({
    description: "Comptes bancaires associés à l'entreprise",
    example: 'IBAN1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  comptesBancairesEntreprise: string

  @ApiProperty({
    description: "Variables d'environnement sous forme de dictionnaire",
    example: { env_name: 'production', api_key: 'abcdef123456' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  variablesEnvironnementales: Record<string, string>
}
