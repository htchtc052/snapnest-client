import type { Album } from '../model'
import type { AlbumDisplayData } from './albumDisplayData'
import { formatAlbumImagesCount } from './formatAlbumImagesCount'

export function mapAlbumToAlbumDisplay(album: Album): AlbumDisplayData {
  return {
    name: album.name,
    coverPreviewUrl: album.coverPreviewUrl,
    coverAlt: album.name ? `${album.name} cover` : 'Album cover',
    imagesCountLabel: formatAlbumImagesCount(album.imagesCount),
  }
}
