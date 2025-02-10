import { Injectable } from '@nestjs/common'
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import * as path from 'path'

@Injectable()
export class S3Service {
  private s3: S3Client
  private bucketName: string

  constructor() {
    if (!process.env.AWS_S3_BUCKET_NAME)
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set')

    this.bucketName = process.env.AWS_S3_BUCKET_NAME
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })
    await this.s3.send(command)
  }

  async getSignedUploadUrl(
    fileName: string,
    fileType: string
  ): Promise<{ url: string; key: string }> {
    const key = `documents/${Date.now()}_${path.basename(fileName)}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    })

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 }) // URL valid for 1 hour

    return { url, key }
  }

  async getDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })
    return getSignedUrl(this.s3, command, { expiresIn: 3600 })
  }
}
