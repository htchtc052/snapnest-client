import { ref } from 'vue'
import { imagesDelete } from '~/api/account/imagesDelete'
import { mapGroupActionError } from '~/http/handle-group-action-error'
import type { DeleteImagesResult } from '~/types/image-delete.contract'

export function useImagesDelete() {
  const client = useSanctumClient()
  const toast = useToast()

  const isDeleting = ref(false)

  async function deleteImagesRequest(imageIds: number[]): Promise<DeleteImagesResult | undefined> {
    isDeleting.value = true
    try {
      const result = await imagesDelete(client, imageIds)
      const { deletedIds, failedIds } = result

      if (deletedIds.length && !failedIds.length) {
        toast.add({ title: `Deleted ${deletedIds.length} images.`, color: 'success' })
        return { deletedIds }
      }

      if (deletedIds.length && failedIds.length) {
        toast.add({
          title: `Deleted ${deletedIds.length} images. Failed to delete ${failedIds.length}.`,
          color: 'warning',
        })
        return { deletedIds }
      }

      if (failedIds.length) {
        toast.add({ title: `Failed to delete ${failedIds.length} images.`, color: 'error' })
        return
      }

      toast.add({ title: 'Failed to delete images.', color: 'error' })
      return
    } catch (error: unknown) {
      console.error('[Images] Failed to delete selected images', error)
      const parsed = mapGroupActionError(error)
      const title =
        parsed.isGroupActionError && parsed.message ? parsed.message : 'Failed to delete images.'
      toast.add({ title, color: 'error' })
      return
    } finally {
      isDeleting.value = false
    }
  }

  return {
    deleteImages: deleteImagesRequest,
    isDeleting,
  }
}
