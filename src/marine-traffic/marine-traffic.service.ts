import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class MarineTrafficService {
  constructor(private readonly httpService: HttpService) {}

  async getAllShipLocations() {
    const apiKey = process.env.MARINE_TRAFFIC_API_KEY
    const baseUrl = process.env.MARINE_TRAFFIC_BASE_URL

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/api/v1/getpos/${apiKey}/timespan:10`)
      )
      return response.data
    } catch (error) {
      throw new Error('Erreur lors de la récupération des localisations des navires.')
    }
  }

  async getShipLocationByMMSI(mmsi: string) {
    const apiKey = process.env.MARINE_TRAFFIC_API_KEY
    const baseUrl = process.env.MARINE_TRAFFIC_BASE_URL

    try {
      const response = await this.httpService
        .get(`${baseUrl}/api/v1/getpos/${apiKey}/mmsi:${mmsi}`)
        .toPromise()

      if (!response.data || response.data.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `No location data found for ship with MMSI ${mmsi}.`,
          },
          HttpStatus.NOT_FOUND
        )
      }

      return response.data
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error retrieving ship data.',
          error: error.response?.data || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
