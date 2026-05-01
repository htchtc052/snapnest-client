import type { Image } from '~/types/image.model'

export type ImageDetailContext = {
  image: Image
  prevImageId: number | null
  nextImageId: number | null
}
