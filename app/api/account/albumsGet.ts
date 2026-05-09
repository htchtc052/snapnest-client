import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AccountAlbum } from '~/entities/album/model'

export function albumsGet(client: SanctumClient): Promise<AccountAlbum[]> {
  return client<AccountAlbum[]>('/api/account/albums')
}
