import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AccountAlbum } from '~/types/account-album.model'
import type { AlbumCreateDto } from '~/types/album-create.contract'

export function albumCreate(client: SanctumClient, data: AlbumCreateDto): Promise<AccountAlbum> {
  return client<AccountAlbum>('/api/account/albums', {
    method: 'POST',
    body: data,
  })
}
