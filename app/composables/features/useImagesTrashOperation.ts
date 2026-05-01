import { ref } from 'vue'
import { imagesTrash } from '~/api/account/imagesTrash'
import { mapGroupActionError } from '~/http/handle-group-action-error'

export type TrashImagesResult = { trashedIds: number[] }

export function useImagesTrashOperation() {
  const client = useSanctumClient()
  const toast = useToast()

  const isTrashing = ref(false)

  async function trashImagesRequest(imageIds: number[]): Promise<TrashImagesResult | undefined> {
    isTrashing.value = true
    try {
      const { trashedIds } = await imagesTrash(client, imageIds)
      toast.add({ title: `Moved ${trashedIds.length} images to trash.`, color: 'success' })
      return { trashedIds }
    } catch (error: unknown) {
      console.error('[Images] Failed to move selected images to trash', error)
      const parsed = mapGroupActionError(error)
      const title =
        parsed.isGroupActionError && parsed.message ? parsed.message : 'Failed to move images to trash.'
      toast.add({ title, color: 'error' })
      return
    } finally {
      isTrashing.value = false
    }
  }

  return {
    trashImages: trashImagesRequest,
    isTrashing,
  }
}
