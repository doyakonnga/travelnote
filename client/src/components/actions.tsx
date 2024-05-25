'use server'

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { randomBytes, randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


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
  checkSum: string): Promise<string | { error: string }> {
  console.log('server action')
  if (!type.startsWith('image')) return { error: 'File type; Only images are allowed.' }
  if (size > 10 * 1024 * 1024) return { error: 'Size; File size exceeded 10MB.' }
  const command = new PutObjectCommand({
    Bucket: process.env.S3_NAME!,
    Key: randomBytes(10).toString('hex'),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checkSum
  })
  try {
    return await getSignedUrl(s3, command, { expiresIn: 10 })
  } catch (e) {
    console.error('s3 upload error', e)
    return { error: 'Upload; Server error' }
  }
}

export async function deleteFromS3(url: string) {
  if (!url) return
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_NAME!,
    Key: url.split('/').pop()
  })
  try { await s3.send(command) }
  catch (e) { console.error('s3 upload error', e) }
}

export async function refresh(path?: string) {
  const targetPath = path || '/'
  revalidatePath(targetPath)
  redirect(targetPath)
}

export { revalidatePath }