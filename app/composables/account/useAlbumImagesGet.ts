import { ref } from '#imports'
import { albumImagesGet } from '~/api/account/albumImagesGet'
import type { Image } from '~/types/image.model'

export function useAlbumImagesGet(albumId: { value: number }) {
    const client = useSanctumClient()

    const images = ref<Image[]>([])
    const isLoading = ref(true)

    async function loadAlbumImages(id = albumId.value) {
        isLoading.value = true
        try {
            const res = await albumImagesGet(client, id)
            images.value = res.entries ?? []
        } catch (error: unknown) {
            if (import.meta.dev) {
                console.error('[Album] Images load error', error)
            }
        } finally {
            isLoading.value = false
        }
    }

    function removeImages(ids: number[]) {
        if (!ids.length) return
        const idsSet = new Set(ids)
        images.value = images.value.filter(image => !idsSet.has(image.id))
    }



    return {
        images,
        isLoading,
        loadAlbumImages,
        removeImages,
    }
}
