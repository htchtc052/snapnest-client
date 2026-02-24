export const UPLOAD_STATUS = {
  waiting: 'waiting',
  uploading: 'uploading',
  uploaded: 'uploaded',
  failed: 'failed',
} as const

export type UploadStatus = typeof UPLOAD_STATUS[keyof typeof UPLOAD_STATUS]

export const UPLOAD_STATUS_LABELS: Record<UploadStatus, string> = {
  [UPLOAD_STATUS.waiting]: 'Waiting',
  [UPLOAD_STATUS.uploading]: 'Uploading',
  [UPLOAD_STATUS.uploaded]: 'Uploaded',
  [UPLOAD_STATUS.failed]: 'Failed',
}

export const UPLOAD_STATUS_COLORS: Record<UploadStatus, 'neutral' | 'primary' | 'success' | 'error'> = {
  [UPLOAD_STATUS.waiting]: 'neutral',
  [UPLOAD_STATUS.uploading]: 'primary',
  [UPLOAD_STATUS.uploaded]: 'success',
  [UPLOAD_STATUS.failed]: 'error',
}
