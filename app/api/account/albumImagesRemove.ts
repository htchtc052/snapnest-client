import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'

type AlbumImagesRemoveResponse = {
  removedIds: number[]
}

export function albumImagesRemove(
  client: SanctumClient,
  albumId: number,
  ids: number[],
): Promise<AlbumImagesRemoveResponse> {
  return client<AlbumImagesRemoveResponse>(`/api/account/albums/${albumId}/images`, {
    method: 'DELETE',
    body: { ids },
  })
}
