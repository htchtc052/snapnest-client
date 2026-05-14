import type { Album } from '../model'
import type { AlbumPreviewCardData } from './albumPreviewCardData'
import { mapAlbumToAlbumDisplay } from './mapAlbumToAlbumDisplay'

export function mapAlbumToAlbumPreviewCard(album: Album): AlbumPreviewCardData {
  return {
    ...mapAlbumToAlbumDisplay(album),
    isShared: album.isPublic,
    emptyLabel: 'Empty album',
  }
}
