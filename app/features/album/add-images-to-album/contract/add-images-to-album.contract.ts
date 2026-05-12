import type { AccountAlbum } from '~/entities/album/model'

export type AddImagesToAlbumResult = {
  addedIds: number[]
}

export type AlbumSelectModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: AccountAlbum }
