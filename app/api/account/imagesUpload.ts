import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'

export function imagesUpload(client: SanctumClient, file: File): Promise<unknown> {
  const data = new FormData()
  data.append('image', file)
  return client('/api/account/images', {
    method: 'POST',
    body: data,
  })
}
