import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AccountAlbum } from '~/types/account-album.model'

export async function albumDelete(client: SanctumClient, id: AccountAlbum['id']): Promise<void> {
  await client(`/api/account/albums/${id}`, { method: 'DELETE' })
}
