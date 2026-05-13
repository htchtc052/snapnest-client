import type { Image } from './image.model'

export enum ImagePreviewState {
  Ready = 'ready',
  Processing = 'processing',
  Failed = 'failed',
  Missing = 'missing',
}

export type ImageView = {
  id: number
  name: string
  previewUrl: string | null
  previewAlt: string
  previewState: ImagePreviewState
  previewPlaceholder: string
  capturedDateLabel: string
}

export function mapImageToView(image: Image): ImageView {
  const previewState = getImagePreviewState(image)

  return {
    id: image.id,
    name: image.name,
    previewUrl: previewState === ImagePreviewState.Ready ? (image.previewUrl ?? null) : null,
    previewAlt: image.name,
    previewState,
    previewPlaceholder: getImagePreviewPlaceholder(previewState),
    capturedDateLabel: formatImageCapturedDate(image.capturedAt),
  }
}

function getImagePreviewState(image: Image): ImagePreviewState {
  if (image.derivativesStatus === 'pending') return ImagePreviewState.Processing

  if (image.derivativesStatus === 'failed') return ImagePreviewState.Failed

  if (image.previewUrl) return ImagePreviewState.Ready

  return ImagePreviewState.Missing
}

function getImagePreviewPlaceholder(previewState: ImagePreviewState): string {
  switch (previewState) {
    case ImagePreviewState.Processing:
      return 'Processing'

    case ImagePreviewState.Failed:
      return 'Preview failed'

    case ImagePreviewState.Missing:
      return 'No preview'

    case ImagePreviewState.Ready:
      return ''
  }
}

function formatImageCapturedDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}
