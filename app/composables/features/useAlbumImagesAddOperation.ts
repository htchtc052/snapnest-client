import { ref } from 'vue'
import { albumImagesAdd } from '~/api/account/albumImagesAdd'
import type { AccountAlbum } from '~/types/account-album.model'

type AlbumToastTarget = Pick<AccountAlbum, 'id' | 'name'>

export function useAlbumImagesAddOperation() {
  const client = useSanctumClient()
  const toast = useToast()
  const isAdding = ref(false)

  async function addImagesToAlbum(album: AlbumToastTarget, imageIds: number[]): Promise<number[] | undefined> {
    isAdding.value = true

    try {
      const result = await albumImagesAdd(client, album.id, imageIds)
      const label = result.addedIds.length === 1 ? 'image' : 'images'

      toast.add({
        title: `Added ${result.addedIds.length} ${label} to album.`,
        color: 'success',
        actions: [
          {
            label: album.name ?? 'Open album',
            variant: 'link',
            color: 'neutral',
            to: `/account/albums/${album.id}`,
          },
        ],
      })

      return result.addedIds
    } catch (error: unknown) {
      console.error('[Albums] Failed to add images to album', error)
      toast.add({ title: 'Failed to add images to album.', color: 'error' })
    } finally {
      isAdding.value = false
    }
  }

  return {
    addImagesToAlbum,
    isAddingImages: isAdding,
  }
}
