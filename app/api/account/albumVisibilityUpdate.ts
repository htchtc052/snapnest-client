import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AccountAlbum } from '~/types/account-album.model'

export function albumVisibilityUpdate(
  client: SanctumClient,
  albumId: number,
  isPublic: boolean,
): Promise<AccountAlbum> {
  return client<AccountAlbum>(`/api/account/albums/${albumId}/visibility`, {
    method: 'PUT',
    body: {
      is_public: isPublic,
    },
  })
}
