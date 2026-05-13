import { formatDate } from '@vueuse/core'
import type { Image } from '../model'
import type { ImageCardData } from './imageCardData'

export function mapImageToImageCard(image: Image): ImageCardData {
  return {
    name: image.name,
    previewUrl: image.previewUrl,
    previewAlt: image.name,
    previewPlaceholder: 'No preview',
    capturedDateLabel: formatDate(new Date(image.capturedAt), 'YYYY.MM.DD'),
  }
}
