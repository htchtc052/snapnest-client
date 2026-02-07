import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Album } from '~/types/album.model'
import type { AlbumShareCreateDto } from '~/types/album-share-create.contract'

export function albumShareCreate(client: SanctumClient, data: AlbumShareCreateDto): Promise<Album> {
  return client<Album>('/api/account/albums', {
    method: 'POST',
    body: data,
  })
}
