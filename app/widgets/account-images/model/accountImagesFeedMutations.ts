import type { Image } from '~/types/image.model'
import type { AccountImagesApiResponse } from '../api/useAccountImagesRequest'

export function appendImages(feed: AccountImagesApiResponse, images: Image[]) {
  feed.images.push(...images)
}

export function removeImagesById(feed: AccountImagesApiResponse, ids: number[]) {
  const idsSet = new Set(ids)

  for (let index = feed.images.length - 1; index >= 0; index--) {
    const image = feed.images[index]

    if (image && idsSet.has(image.id)) {
      feed.images.splice(index, 1)
    }
  }
}

export function replaceImage(feed: AccountImagesApiResponse, updatedImage: Image) {
  const index = feed.images.findIndex(image => image.id === updatedImage.id)
  if (index === -1) return

  feed.images[index] = {
    ...feed.images[index],
    ...updatedImage,
  }
}
