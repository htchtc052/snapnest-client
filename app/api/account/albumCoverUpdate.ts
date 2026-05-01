import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AccountAlbum } from '~/types/account-album.model'

export function albumCoverUpdate(
  client: SanctumClient,
  albumId: number,
  coverImageId: number,
): Promise<AccountAlbum> {
  return client<AccountAlbum>(`/api/account/albums/${albumId}/cover`, {
    method: 'PUT',
    body: {
      cover_image_id: coverImageId,
    },
  })
}
