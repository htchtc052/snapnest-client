import type { Album } from '~/types/album.model'
import type { Image } from '~/types/image.model'

export type AlbumWithImagesResponse = {
  album: Album
  images: Image[]
}
