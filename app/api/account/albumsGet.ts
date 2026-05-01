import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AccountAlbum } from '~/types/account-album.model'

export function albumsGet(client: SanctumClient): Promise<AccountAlbum[]> {
  return client<AccountAlbum[]>('/api/account/albums')
}
