import { ref } from '#imports'
import { imagesRestore } from '~/api/account/imagesRestore'
import { mapGroupActionError } from '~/http/handle-group-action-error'
import type { User } from '~/types/user.model'

export type RestoreImagesResult = { restoredIds: number[] }

export function useImagesRestoreOperation() {
  const client = useSanctumClient()
  const toast = useToast()
  const { refreshIdentity } = useSanctumAuth<User>()

  const isRestoring = ref(false)

  async function restoreImagesRequest(imageIds: number[]): Promise<RestoreImagesResult | undefined> {
    isRestoring.value = true

    try {
      const { restoredIds } = await imagesRestore(client, imageIds)

      await refreshIdentity()

      toast.add({ title: `Restored ${restoredIds.length} images.`, color: 'success' })
      return { restoredIds }
    } catch (error: unknown) {
      console.error('[Images] Failed to restore selected images', error)

      const parsed = mapGroupActionError(error)
      const title = parsed.isGroupActionError && parsed.message
        ? parsed.message
        : 'Failed to restore images.'

      toast.add({ title, color: 'error' })
    } finally {
      isRestoring.value = false
    }
  }

  return {
    restoreImages: restoreImagesRequest,
    isRestoring,
  }
}