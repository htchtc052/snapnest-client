import type { AccountAlbum } from '~/entities/album/model'

export type AlbumView = AccountAlbum & {
  isOwner: boolean
}
