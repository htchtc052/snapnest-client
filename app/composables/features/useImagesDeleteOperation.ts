import { ref } from '#imports'
import { imagesDelete } from '~/api/account/imagesDelete'
import { mapGroupActionError } from '~/http/handle-group-action-error'
import type { DeleteImagesResult } from '~/types/image-delete.contract'
import type { User } from '~/types/user.model'

export function useImagesDeleteOperation() {
  const client = useSanctumClient()
  const toast = useToast()
  const { refreshIdentity } = useSanctumAuth<User>()

  const isDeleting = ref(false)

  async function deleteImagesRequest(imageIds: number[]): Promise<DeleteImagesResult | undefined> {
    isDeleting.value = true

    try {
      const { deletedIds } = await imagesDelete(client, imageIds)

      await refreshIdentity()

      toast.add({ title: `Permanently deleted ${deletedIds.length} images.`, color: 'success' })
      return { deletedIds }
    } catch (error: unknown) {
      console.error('[Images] Failed to permanently delete selected images', error)

      const parsed = mapGroupActionError(error)
      const title = parsed.isGroupActionError && parsed.message
        ? parsed.message
        : 'Failed to permanently delete images.'

      toast.add({ title, color: 'error' })
    } finally {
      isDeleting.value = false
    }
  }

  return {
    deleteImages: deleteImagesRequest,
    isDeleting,
  }
}