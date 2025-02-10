import { Controller, Get, Query } from '@nestjs/common'
import { S3Service } from './s3.service'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('S3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('presigned-url')
  @ApiOperation({ summary: 'Get a presigned URL for file upload' })
  @ApiResponse({
    status: 200,
    description: 'Returns a presigned URL and S3 key for file upload',
  })
  async getPresignedUrl(
    @Query('fileName') fileName: string,
    @Query('fileType') fileType: string
  ): Promise<{ url: string; key: string }> {
    const { url, key } = await this.s3Service.getSignedUploadUrl(fileName, fileType)
    return { url, key }
  }

  @Get('download-url')
  @ApiOperation({ summary: 'Get the download URL for a file' })
  @ApiResponse({
    status: 200,
    description: 'Download URL retrieved successfully',
  })
  async getDownloadUrl(@Query('key') key: string): Promise<{ url: string }> {
    const url = await this.s3Service.getDownloadUrl(key)
    return { url }
  }
}
