import { albumCreate } from "~/api/account/albumCreate"
import type { AlbumCreateDto, AlbumCreateResult } from "~/types/album-create.contracts"

export function useAlbumCreate() {
    const isCreating = ref(false)
    const client = useSanctumClient()
    const toast = useToast()

    async function createAlbum(data: AlbumCreateDto): Promise<AlbumCreateResult> {
        isCreating.value = true
        try {
            const album = await albumCreate(client, data)
            toast.add({
                title: `Album ${album.name} created.`,
                color: 'success',
                actions: [
                    { label: 'Open album', to: `/account/albums/${album.id}`, variant: 'link', size: 'xs' },
                ],
            })
            return album
        } catch (error: unknown) {
            console.error('[AlbumCreate] Failed to create album', error)
            toast.add({ title: 'Failed to create album.', color: 'error' })
        } finally {
            isCreating.value = false
        }
    }

    return {
        createAlbum,
        isCreating,
    }
}
