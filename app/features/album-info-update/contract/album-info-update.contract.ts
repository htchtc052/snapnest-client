import type { AccountAlbum } from '~/entities/album/model'

export type AlbumInfoUpdateModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: AccountAlbum }
