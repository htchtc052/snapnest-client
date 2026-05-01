import type { AccountAlbum } from '~/types/account-album.model'

export type AlbumCreateDto = {
  image_ids: number[]
}

export type AlbumCreateResult = AccountAlbum | undefined
