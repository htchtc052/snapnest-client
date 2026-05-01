import type { FormError } from '#ui/types'
import { privateAlbumCreate } from '~/api/account/privateAlbumCreate'
import { mapFormError } from '~/http/handle-form-error'
import type { AlbumInfoDto } from '~/types/album-info.contract'
import type { AccountAlbum } from '~/types/account-album.model'

export function usePrivateAlbumCreateOperation() {
  const isCreating = ref(false)
  const client = useSanctumClient()

  async function createPrivateAlbum(data: AlbumInfoDto): Promise<FormError[] | AccountAlbum | undefined> {
    isCreating.value = true
    try {
      return await privateAlbumCreate(client, data)
    } catch (error: unknown) {
      const parsed = mapFormError(error)
      if (parsed.isValidationError) return parsed.bag
      console.error('[Albums] Failed to create private album', error)
    } finally {
      isCreating.value = false
    }
  }

  return {
    createPrivateAlbum,
    isCreating,
  }
}
