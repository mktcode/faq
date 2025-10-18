import s3Driver from 'unstorage/drivers/s3'
import fsDriver from 'unstorage/drivers/fs'

export default defineNitroPlugin(() => {
  const storage = useStorage()

  const fs = fsDriver({
    base: './public/.userfiles',
  })

  const s3 = s3Driver({
    accessKeyId: useRuntimeConfig().s3AccessKey,
    secretAccessKey: useRuntimeConfig().s3SecretKey,
    endpoint: useRuntimeConfig().public.s3Endpoint,
    region: 'eu-central',
    bucket: useRuntimeConfig().s3Bucket,
  })

  storage.mount('userfiles', import.meta.dev ? fs : s3)
})
