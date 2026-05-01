import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'

type AlbumImagesAddResponse = {
  addedIds: number[]
}

export function albumImagesAdd(
  client: SanctumClient,
  albumId: number,
  ids: number[],
): Promise<AlbumImagesAddResponse> {
  return client<AlbumImagesAddResponse>(`/api/account/albums/${albumId}/images`, {
    method: 'POST',
    body: { ids },
  })
}
