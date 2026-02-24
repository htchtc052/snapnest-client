import { ref } from 'vue'
import { imagesRestore } from '~/api/account/imagesRestore'
import { mapGroupActionError } from '~/http/handle-group-action-error'

export type RestoreImagesResult = { restoredIds: number[] }

export function useImagesRestore() {
  const client = useSanctumClient()
  const toast = useToast()

  const isRestoring = ref(false)

  async function restoreImagesRequest(imageIds: number[]): Promise<RestoreImagesResult | undefined> {
    isRestoring.value = true
    try {
      const result = await imagesRestore(client, imageIds)
      const { restoredIds, failedIds } = result

      if (restoredIds.length && !failedIds.length) {
        toast.add({ title: `Restored ${restoredIds.length} images.`, color: 'success' })
        return { restoredIds }
      }

      if (restoredIds.length && failedIds.length) {
        toast.add({
          title: `Restored ${restoredIds.length} images. Failed for ${failedIds.length}.`,
          color: 'warning',
        })
        return { restoredIds }
      }

      if (failedIds.length) {
        toast.add({ title: `Failed to restore ${failedIds.length} images.`, color: 'error' })
        return
      }

      toast.add({ title: 'Failed to restore images.', color: 'error' })
      return
    } catch (error: unknown) {
      console.error('[Images] Failed to restore selected images', error)
      const parsed = mapGroupActionError(error)
      const title =
        parsed.isGroupActionError && parsed.message ? parsed.message : 'Failed to restore images.'
      toast.add({ title, color: 'error' })
      return
    } finally {
      isRestoring.value = false
    }
  }

  return {
    restoreImages: restoreImagesRequest,
    isRestoring,
  }
}
