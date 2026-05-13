import type { Image } from '../model'
import type { ImageCardData } from './imageCardData'
import { formatImageCapturedDate } from './formatImageCapturedDate'

export function mapImageToImageCard(image: Image): ImageCardData {
  return {
    name: image.name,
    previewUrl: image.previewUrl ?? null,
    previewAlt: image.name,
    previewPlaceholder: 'No preview',
    capturedDateLabel: formatImageCapturedDate(image.capturedAt),
  }
}
