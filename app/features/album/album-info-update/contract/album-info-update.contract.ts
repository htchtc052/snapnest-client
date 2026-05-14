import type { AccountAlbum } from '~/entities/album/model'

export type AlbumInfoUpdateFormResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: AccountAlbum }
