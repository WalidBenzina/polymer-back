import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  motDePasse: string
}
