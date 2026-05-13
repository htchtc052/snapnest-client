import type { Image } from '../model'
import type { ImageCardData } from './imageCardData'
import { formatImageCapturedDate } from './formatImageCapturedDate'

export function mapImageToImageCard(image: Image): ImageCardData {
  return {
    name: image.name,
    previewUrl: getImagePreviewUrl(image),
    previewAlt: image.name,
    previewPlaceholder: getImagePreviewPlaceholder(image),
    capturedDateLabel: formatImageCapturedDate(image.capturedAt),
  }
}

function getImagePreviewUrl(image: Image): string | null {
  if (image.derivativesStatus === 'pending' || image.derivativesStatus === 'failed') {
    return null
  }

  return image.previewUrl ?? null
}

function getImagePreviewPlaceholder(image: Image): string {
  if (image.derivativesStatus === 'pending') return 'Processing'

  if (image.derivativesStatus === 'failed') return 'Preview failed'

  return 'No preview'
}
