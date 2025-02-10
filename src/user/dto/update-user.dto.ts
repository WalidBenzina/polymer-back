import { IsString, IsEmail, MinLength, IsOptional, IsEnum, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserStatus } from 'src/enums/user-status.enum'

export class UpdateUserDto {
  @ApiProperty({ example: 'elgamez', required: false })
  @IsString()
  @IsOptional()
  nomUtilisateur?: string

  @ApiProperty({ example: 'jane@gmail.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ example: 'newpassword123', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  motDePasse?: string

  @ApiProperty({
    example: 'Admin',
    required: false,
  })
  @IsString()
  @IsOptional()
  nomRole?: string

  @ApiProperty({
    example: 'd2e8b93e-f508-4ca6-b03c-34e927150d8b',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  idClient?: string | null

  @ApiProperty({ enum: UserStatus, required: false })
  @IsEnum(UserStatus)
  @IsOptional()
  statut?: UserStatus
}
