import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AlbumInfoDto } from '~/types/album-info.contract'
import type { AccountAlbum } from '~/types/account-album.model'

export function albumUpdate(client: SanctumClient, id: number, data: AlbumInfoDto): Promise<AccountAlbum> {
  return client<AccountAlbum>(`/api/account/albums/${id}`, {
    method: 'PUT',
    body: data,
  })
}
