import type { Album } from '~/models/Album'

export async function useAlbumAttachImages(albumId: Album['id'], imageIds: number[]): Promise<void> {
    const client = useSanctumClient()
    await client(`/api/account/albums/${albumId}/attach-images`, {
        method: 'POST',
        body: { image_ids: imageIds },
    })
}
