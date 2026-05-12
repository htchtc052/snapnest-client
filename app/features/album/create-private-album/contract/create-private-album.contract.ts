import type { AccountAlbum } from '~/entities/album/model'

export type AlbumCreateModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: AccountAlbum }
