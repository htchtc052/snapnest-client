import { imagesUpload } from '~/api/account/imagesUpload'
import type { ImageUploadResponse } from '~/types/image-upload.contract'

export function useImagesUpload() {
  const client = useSanctumClient()
  const isUploading = ref(false)

  async function uploadImages(files: File[]): Promise<ImageUploadResponse | undefined> {
    isUploading.value = true
    try {
      const data = new FormData()
      files.forEach((file) => data.append('images[]', file))
      return await imagesUpload(client, data)
    } catch (error: unknown) {
      console.error('[Images] Failed to upload images', error)
    } finally {
      isUploading.value = false
    }
  }

  return {
    uploadImages,
    isUploading,
  }
}
