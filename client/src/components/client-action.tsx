
'use client'

import axios from "axios"
import { getUploadUrl, revalidatePath } from "./actions"
import { Sha256 } from "@aws-crypto/sha256-browser"
import { usePathname } from "next/navigation"

export const Renew = () => {
  fetch('/api/v1/users/renewtoken').then().catch(()=>{})
  return (<></>)
}

export const uploadToS3 = async (file: File) => {
  const hash = new Sha256();
  const { type, size } = file  
  hash.update(await file.arrayBuffer());
  const buf = await hash.digest()
  const checkSum = Array.from(new Uint8Array(buf)).
    map((b) => b.toString(16).padStart(2, '0')).join('')
  const uploadUrl = await getUploadUrl(type, size, checkSum)
  if (typeof uploadUrl !== 'string') throw Error(uploadUrl.error)
  await axios.put(uploadUrl, file, { headers: { "Content-Type": type } })
  return uploadUrl.split('?')[0]
}

export const revalidateCost = (path: string) => {
  const basePath = path.split('/').slice(0, -1).join('/') + '/';
  ['consumptions', 'expenses', 'balances'].forEach(
    route => revalidatePath(basePath + route))
}