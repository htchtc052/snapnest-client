import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'

export type ImagesRestoreResponse = {
  restoredIds: number[]
  failedIds: number[]
}

export function imagesRestore(client: SanctumClient, ids: number[]): Promise<ImagesRestoreResponse> {
  return client<ImagesRestoreResponse>('/api/account/images/restore', {
    method: 'POST',
    body: { ids },
  })
}
