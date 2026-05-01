import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AlbumInfoDto } from '~/types/album-info.contract'
import type { AccountAlbum } from '~/types/account-album.model'

export function privateAlbumCreate(client: SanctumClient, data: AlbumInfoDto): Promise<AccountAlbum> {
  return client<AccountAlbum>('/api/account/albums/private', {
    method: 'POST',
    body: data,
  })
}
