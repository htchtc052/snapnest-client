import type { ApiClient } from '~/shared/api'
import type { Image } from '~/entities/image'

export function imagesUpload(client: ApiClient, file: File): Promise<Image> {
  const data = new FormData()
  data.append('image', file)

  return client<Image>('/api/account/images', {
    method: 'POST',
    body: data,
  })
}
