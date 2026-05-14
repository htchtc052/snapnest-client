import type { Image } from './image.model'

export function appendImages(images: Image[], nextImages: Image[]) {
  images.push(...nextImages)
}

export function removeImagesById(images: Image[], imageIds: Image['id'][]) {
  const imageIdsSet = new Set(imageIds)

  for (let index = images.length - 1; index >= 0; index--) {
    const image = images[index]

    if (image && imageIdsSet.has(image.id)) {
      images.splice(index, 1)
    }
  }
}

export function replaceImageById(images: Image[], updatedImage: Image) {
  const index = images.findIndex(image => image.id === updatedImage.id)
  if (index === -1) return

  images[index] = updatedImage
}
