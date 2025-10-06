export default function useUpload() {
  const toast = useToast()

  const isUploading = ref(false)
  const uploadProgress = ref(0)

  async function uploadFile(file: File, path: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)

    await $fetch('/api/user/upload', {
      method: 'POST',
      body: formData,
    })
  }

  async function uploadFiles(files: File[], path: string) {
    if (files.length === 0) return

    isUploading.value = true
    let uploadedFiles = 0
  
    for (const file of Array.from(files)) {
      try {
        await uploadFile(file, path)

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
  }

  return {
    isUploading,
    uploadProgress,
    uploadFiles,
  }
}
