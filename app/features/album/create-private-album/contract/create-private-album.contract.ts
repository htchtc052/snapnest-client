import type { AccountAlbum } from '~/entities/album/model'

export type AlbumCreateFormResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: AccountAlbum }
