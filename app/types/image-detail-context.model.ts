import type { Image } from '~/entities/image'

export type ImageDetailContext = {
  image: Image
  prevImageId: number | null
  nextImageId: number | null
}
