import { formatDate } from '@vueuse/core'
import type { Album } from '../model'
import type { AlbumDetailsCardData } from './albumDetailsCardData'
import { mapAlbumToAlbumDisplay } from './mapAlbumToAlbumDisplay'

export function mapAlbumToAlbumDetailsCard(album: Album): AlbumDetailsCardData {
  const display = mapAlbumToAlbumDisplay(album)
  const createdAtLabel = formatDate(new Date(album.createdAt), 'YYYY.MM.DD')

  return {
    name: display.name,
    coverPreviewUrl: display.coverPreviewUrl,
    coverAlt: display.coverAlt,
    ownerNameLabel: `By ${album.ownerName}`,
    metaLabel: `${display.imagesCountLabel} • ${createdAtLabel}`,
  }
}
