export default function useUpload() {
  const toast = useToast()

  const isUploading = ref(false)
  const uploadProgress = ref(0)

  async function uploadFile(file: File, path: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)

    const { url } = await $fetch('/api/user/upload', {
      method: 'POST',
      body: formData,
    })

    if (!url) {
      throw new Error('Upload fehlgeschlagen')
    }

    return url
  }

  async function uploadFiles(files: File[], path: string) {
    isUploading.value = true
    let uploadedFiles = 0

    const urls = []
  
    for (const file of Array.from(files)) {
      try {
        const url = await uploadFile(file, path)
        urls.push(url)

        toast.add({
          title: 'Datei erfolgreich hochgeladen',
          description: `${file.name} wurde erfolgreich hochgeladen.`,
          color: 'success',
          icon: 'i-heroicons-check-circle',
          progress: false,
        })

        uploadedFiles++
      } catch (error) {
        toast.add({
          title: 'Fehler beim Hochladen der Datei',
          description: `Beim Hochladen von ${file.name} ist ein Fehler aufgetreten.`,
          color: 'error',
          icon: 'i-heroicons-x-circle',
          progress: false,
        })
      }
      
      uploadProgress.value = Math.round((uploadedFiles / files.length) * 100)
    }
    
    isUploading.value = false
    uploadProgress.value = 0

    return { urls }
  }

  return {
    isUploading,
    uploadProgress,
    uploadFiles,
  }
}
