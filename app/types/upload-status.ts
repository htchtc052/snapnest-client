export const UPLOAD_STATUS = {
  waiting: 'waiting',
  uploading: 'uploading',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
} as const

export type UploadStatus = typeof UPLOAD_STATUS[keyof typeof UPLOAD_STATUS]

export const UPLOAD_STATUS_LABELS: Record<UploadStatus, string> = {
  [UPLOAD_STATUS.waiting]: 'Waiting',
  [UPLOAD_STATUS.uploading]: 'Uploading',
  [UPLOAD_STATUS.processing]: 'Processing',
  [UPLOAD_STATUS.completed]: 'Completed',
  [UPLOAD_STATUS.failed]: 'Failed',
}

export const UPLOAD_STATUS_COLORS: Record<UploadStatus, 'neutral' | 'primary' | 'success' | 'error'> = {
  [UPLOAD_STATUS.waiting]: 'neutral',
  [UPLOAD_STATUS.uploading]: 'primary',
  [UPLOAD_STATUS.processing]: 'primary',
  [UPLOAD_STATUS.completed]: 'success',
  [UPLOAD_STATUS.failed]: 'error',
}
