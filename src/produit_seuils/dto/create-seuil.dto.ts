import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'

export class CreateSeuilDto {
  @ApiProperty({ description: 'Seuil minimal', example: 10 })
  @IsNumber()
  @IsPositive()
  seuilMinimal: number

  @ApiProperty({ description: 'Seuil de réapprovisionnement', example: 20 })
  @IsNumber()
  @IsPositive()
  seuilReapprovisionnement: number
}
