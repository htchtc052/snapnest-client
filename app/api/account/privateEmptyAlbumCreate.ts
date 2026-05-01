import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AccountAlbum } from '~/types/account-album.model'

export function privateEmptyAlbumCreate(client: SanctumClient): Promise<AccountAlbum> {
  return client<AccountAlbum>('/api/account/albums/private/empty', {
    method: 'POST',
  })
}
