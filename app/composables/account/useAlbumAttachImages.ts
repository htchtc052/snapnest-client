import { albumAttachImages } from "~/api/account/albumAttachImages"
import { mapGroupActionError } from '~/http/handle-group-action-error'
import type { Album } from '~/types/album.model'

export function useAlbumAttachImages() {
    const isAttaching = ref(false)
    const client = useSanctumClient()
    const toast = useToast()


    async function albumAttachImagesRequest(
        album: Album,
        imageIds: number[],
    ): Promise<void> {
        isAttaching.value = true
        try {
            await albumAttachImages(client, { albumId: album.id, imageIds })
            const title = `Images added to ${album.name}`
            toast.add({
                title,
                color: 'success',
                actions: [
                    { label: 'Open album', to: `/account/albums/${album.id}`, variant: 'link', size: 'xs' },
                ],
            })
        } catch (error: unknown) {
            console.error('[Albums] Failed to attach images to album', error)
            const parsed = mapGroupActionError(error)
            const title =
                parsed.isGroupActionError && parsed.message
                    ? parsed.message
                    : 'Failed to attach images to album.'
            toast.add({ title, color: 'error' })
        } finally {
            isAttaching.value = false
        }
    }

    return {
        albumAttachImages: albumAttachImagesRequest,
        isAttaching,
    }
}
