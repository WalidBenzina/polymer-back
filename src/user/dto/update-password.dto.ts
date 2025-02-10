import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'new password', required: false })
  @IsString()
  password: string

  @IsNotEmpty()
  @ApiProperty({ example: 'new password', required: false })
  @IsString()
  confirmPassword: string
}
