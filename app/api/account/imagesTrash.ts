import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'

export type ImagesTrashActionResponse = {
  trashedIds: number[]
  failedIds: number[]
}

export function imagesTrash(client: SanctumClient, ids: number[]): Promise<ImagesTrashActionResponse> {
  return client<ImagesTrashActionResponse>('/api/account/images/trash', {
    method: 'POST',
    body: { ids },
  })
}
