import { IsString, IsEmail, MinLength, IsOptional, IsEnum, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserStatus } from 'src/enums/user-status.enum'

export class RegisterDto {
  @ApiProperty({ example: 'elgamez' })
  @IsString()
  nomUtilisateur: string

  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  motDePasse: string

  @ApiProperty({
    example: 'Admin',
  })
  @IsString()
  nomRole: string

  @ApiProperty({
    example: '4b5dc93b-bc72-42a8-aa70-08b50757404c',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  idClient?: string

  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  statut: UserStatus
}
