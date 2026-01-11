import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Image } from '~/models/Image'

export type ImagesPage = {
  entries: Image[]
  nextCursor: string | null
}

export function getImages(client: SanctumClient, cursor?: string): Promise<ImagesPage> {
  const cursorParam = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
  return client<ImagesPage>(`/api/account/images${cursorParam}`)
}
