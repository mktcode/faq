import sharp from 'sharp'

function getFilename(filename: string) {
  const fileName = filename || Math.random().toString(36).substring(7)
  const sanitizedFilename = fileName.replace(/[^a-z0-9.]/gi, '_')

  return sanitizedFilename
}

function getFileUrl(filePath: string, fileName: string) {
  const { s3BucketName, public: { appHost, s3Endpoint } } = useRuntimeConfig()

  return import.meta.dev
    ? `https://${appHost}/.userfiles/${filePath}/${fileName}`
    : `${s3Endpoint}/${s3BucketName}/${filePath}/${fileName}`
}

async function handleImageUpload(file: any, userId: number) {
  const fileName = getFilename(file.filename)
  const filePath = `${userId}`

  const image = sharp(file.data)
  const metadata = await image.metadata()

  const maxSize = 2000
  if (metadata.width && metadata.height && (metadata.width > maxSize || metadata.height > maxSize)) {
    image.resize(maxSize, maxSize, { fit: 'inside' })
  }

  const webpFilename = fileName.replace(/\.[^/.]+$/, '.webp')
  const url = getFileUrl(filePath, fileName)
  const key = `${filePath}/${webpFilename}`
  const buffer = Buffer.from(await image.toFormat('webp').toBuffer())

  await useStorage('userfiles').setItemRaw(key, buffer)
  await useStorage('userfiles').setMeta(key, {
    key,
    filename: webpFilename,
    type: 'image',
    size: metadata.size,
    lastModified: new Date().toISOString(),
    url,
  })

  return url
}

async function handleDocumentUpload(file: any, userId: number) {
  const fileName = getFilename(file.filename)
  const filePath = `${userId}`
  const url = getFileUrl(filePath, fileName)
  const key = `${filePath}/${fileName}`

  const maxSize = 20 * 1024 * 1024 // 20MB
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'text/csv', 'application/rtf', 'application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.presentation', 'application/zip', 'application/x-7z-compressed', 'application/x-rar-compressed']

  console.log('Uploading document:', fileName, file.type, file.size)

  if (file.size > maxSize) {
    throw new Error('Datei ist zu groß. Maximalgröße ist 20MB.')
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Dateityp wird nicht unterstützt.')
  }

  await useStorage('userfiles').setItemRaw(key, file.data)
  await useStorage('userfiles').setMeta(key, {
    key,
    filename: fileName,
    type: 'document',
    size: file.size,
    lastModified: new Date().toISOString(),
    url,
  })
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const form = await readMultipartFormData(event)

  if (!form) {
    return { success: false, message: 'Keine Formulardaten gefunden' }
  }

  const file = form.find(f => f.name === 'file')
  
  if (!file || !file.data) {
    return { success: false, message: 'Keine Datei gefunden' }
  }

  const isImage = file.type?.startsWith('image')

  if (isImage) {
    const url = await handleImageUpload(file, user.id)
    return { success: true, url }
  } else {
    const url = await handleDocumentUpload(file, user.id)
    return { success: true, url }
  }
})
