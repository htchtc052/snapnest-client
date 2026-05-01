import type { AccountAlbum } from '~/types/account-album.model'

export type AlbumSelectModalResult =
  | { action: 'cancel' }
  | { action: 'create' }
  | { action: 'confirm'; album: AccountAlbum }
