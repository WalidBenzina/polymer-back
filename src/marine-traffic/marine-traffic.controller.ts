import { Controller, Get, HttpException, HttpStatus, Param, UseGuards } from '@nestjs/common'
import { MarineTrafficService } from './marine-traffic.service'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { PermissionType } from 'src/common/types/permissions.type'

@ApiTags('Marine Traffic')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('/marine-traffic')
export class MarineTrafficController {
  constructor(private readonly marineTrafficService: MarineTrafficService) {}

  @Get('ships/all')
  @ApiOperation({
    summary: 'Get all ship locations (BackOffice)',
    description: 'Fetch the real-time location of all ships for BackOffice purposes.',
  })
  @ApiResponse({ status: 200, description: 'List of all ship locations successfully retrieved.' })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch ship locations due to a server error.',
  })
  async getAllShips() {
    try {
      const locations = await this.marineTrafficService.getAllShipLocations()
      return {
        statusCode: HttpStatus.OK,
        message: 'All ship locations retrieved successfully.',
        data: locations,
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve ship locations.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('ships/:mmsi')
  @Permissions(PermissionType.READ_MARINE_TRAFFIC)
  @ApiOperation({
    summary: 'Get ship location by MMSI (Client)',
    description:
      'Fetch the real-time location of a specific ship transporting a client’s order using its MMSI.',
  })
  @ApiParam({ name: 'mmsi', type: String, description: 'The MMSI of the ship to fetch.' })
  @ApiResponse({ status: 200, description: 'Ship location successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Ship with the specified MMSI not found.' })
  @ApiResponse({ status: 500, description: 'Failed to fetch ship location due to a server error.' })
  async getShipByMMSI(@Param('mmsi') mmsi: string) {
    try {
      const location = await this.marineTrafficService.getShipLocationByMMSI(mmsi)

      if (!location) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Ship with MMSI ${mmsi} not found.`,
          },
          HttpStatus.NOT_FOUND
        )
      }

      return {
        statusCode: HttpStatus.OK,
        message: `Ship location retrieved successfully for MMSI ${mmsi}.`,
        data: location,
      }
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve ship location.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
