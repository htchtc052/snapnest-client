export const UPLOAD_ERROR_CODE = {
  imageRequired: 'UPLOAD_IMAGE_REQUIRED',
  invalidMime: 'UPLOAD_INVALID_MIME',
  fileTooLarge: 'UPLOAD_FILE_TOO_LARGE',
  quotaImagesReached: 'UPLOAD_QUOTA_IMAGES_REACHED',
  quotaBytesReached: 'UPLOAD_QUOTA_BYTES_REACHED',
} as const

export type UploadErrorCode = typeof UPLOAD_ERROR_CODE[keyof typeof UPLOAD_ERROR_CODE]

export function isUploadErrorCode(value: unknown): value is UploadErrorCode {
  return typeof value === 'string' && Object.values(UPLOAD_ERROR_CODE).includes(value as UploadErrorCode)
}

export function isQuotaUploadErrorCode(code: UploadErrorCode | null | undefined): boolean {
  return code === UPLOAD_ERROR_CODE.quotaImagesReached || code === UPLOAD_ERROR_CODE.quotaBytesReached
}

export function uploadErrorMessage(code: UploadErrorCode | null | undefined): string {
  switch (code) {
    case UPLOAD_ERROR_CODE.imageRequired:
      return 'Image is required'
    case UPLOAD_ERROR_CODE.invalidMime:
      return 'Unsupported format'
    case UPLOAD_ERROR_CODE.fileTooLarge:
      return 'File is too large'
    case UPLOAD_ERROR_CODE.quotaImagesReached:
      return 'Image limit reached'
    case UPLOAD_ERROR_CODE.quotaBytesReached:
      return 'Storage limit reached'
    default:
      return 'Upload failed'
  }
}
