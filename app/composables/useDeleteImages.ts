import { ref } from 'vue'
import { deleteImages, type DeleteImagesResponse } from '~/api/images/deleteImages'

export function useDeleteImages() {
  const client = useSanctumClient()

  const isLoading = ref(false)
  const success = ref(false)

  async function deleteImagesRequest(imageIds: number[]): Promise<DeleteImagesResponse> {
    if (!imageIds.length) {
      return { deletedIds: [], failedIds: [] }
    }
    isLoading.value = true
    success.value = false
    try {
      const result = await deleteImages(client, imageIds)
      success.value = result.failedIds.length === 0 && result.deletedIds.length > 0
      return result
    } catch (error: unknown) {
      console.error('[Images] Failed to delete selected images', error)
      return { deletedIds: [], failedIds: imageIds }
    } finally {
      isLoading.value = false
    }
  }

  return {
    deleteImages: deleteImagesRequest,
    isLoading,
    success,
  }
}
