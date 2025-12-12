import type { Album } from '~/models/Album'

export async function useAlbumDetachImages(albumId: Album['id'], imageIds: number[]): Promise<void> {
    const client = useSanctumClient()
    await client(`/api/account/albums/${albumId}/detach-images`, {
        method: 'POST',
        body: { image_ids: imageIds },
    })
}
