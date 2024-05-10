'use server'

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { randomUUID } from "crypto"


const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_ACCESS_SECRET!
  }
})

export async function getUploadUrl(
  type: string, 
  size: number, 
  checkSum: string): Promise<string | {error: string}> {
  console.log('server action')
  if (size > 10 * 1024 * 1024) return {error: 'Size; File size exceeded 10MB.'}
  if (!type.startsWith('image')) return { error: 'File type; Only images are allowed.'}
  const command = new PutObjectCommand({
    Bucket: process.env.S3_NAME!,
    Key: randomUUID(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checkSum
  })
  return await getSignedUrl(s3, command, { expiresIn: 10 })
}
