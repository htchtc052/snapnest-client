import { formatDate } from '@vueuse/core'
import type { Album } from '../model'
import type { AlbumDetailsCardData } from './albumDetailsCardData'

export function mapAlbumToAlbumDetailsCard(album: Album): AlbumDetailsCardData {
  const createdAtLabel = formatDate(new Date(album.createdAt), 'YYYY.MM.DD')
  const imagesCountLabel = `${album.imagesCount} ${album.imagesCount === 1 ? 'photo' : 'photos'}`

  return {
    name: album.name,
    coverPreviewUrl: album.coverPreviewUrl,
    coverAlt: album.name ? `${album.name} cover` : 'Album cover',
    ownerNameLabel: `By ${album.ownerName}`,
    metaLabel: `${imagesCountLabel} • ${createdAtLabel}`,
  }
}
