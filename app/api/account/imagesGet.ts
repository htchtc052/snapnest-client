import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Image } from '~/types/image.model'

export type ImagesPage = {
  entries: Image[]
  nextCursor: string | null
}

export function imagesGet(client: SanctumClient, cursor?: string): Promise<ImagesPage> {
  const cursorParam = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
  return client<ImagesPage>(`/api/account/images${cursorParam}`)
}
