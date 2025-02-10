import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'

export class UpdateSeuilsDto {
  @ApiProperty({ description: 'Seuil minimal', example: 15 })
  @IsNumber()
  @IsPositive()
  seuilMinimal: number

  @ApiProperty({ description: 'Seuil de réapprovisionnement', example: 25 })
  @IsNumber()
  @IsPositive()
  seuilReapprovisionnement: number
}
