import type { Album } from '~/types/album.model'

export type AlbumShareCreateDto = {
  image_ids: number[]
  is_public: boolean
}

export type AlbumShareCreateResult = Album | undefined
