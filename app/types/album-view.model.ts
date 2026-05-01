import type { AccountAlbum } from '~/types/account-album.model'

export type AlbumView = AccountAlbum & {
  isOwner: boolean
}
