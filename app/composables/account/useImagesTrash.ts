import { ref } from 'vue'
import { imagesTrash } from '~/api/account/imagesTrash'
import { mapGroupActionError } from '~/http/handle-group-action-error'

export type TrashImagesResult = { trashedIds: number[] }

export function useImagesTrash() {
  const client = useSanctumClient()
  const toast = useToast()

  const isTrashing = ref(false)

  async function trashImagesRequest(imageIds: number[]): Promise<TrashImagesResult | undefined> {
    isTrashing.value = true
    try {
      const result = await imagesTrash(client, imageIds)
      const { trashedIds, failedIds } = result

      if (trashedIds.length && !failedIds.length) {
        toast.add({ title: `Moved ${trashedIds.length} images to trash.`, color: 'success' })
        return { trashedIds }
      }

      if (trashedIds.length && failedIds.length) {
        toast.add({
          title: `Moved ${trashedIds.length} images to trash. Failed for ${failedIds.length}.`,
          color: 'warning',
        })
        return { trashedIds }
      }

      if (failedIds.length) {
        toast.add({ title: `Failed to move ${failedIds.length} images to trash.`, color: 'error' })
        return
      }

      toast.add({ title: 'Failed to move images to trash.', color: 'error' })
      return
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
