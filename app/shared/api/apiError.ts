import type { FormError } from '#ui/types'
import { FetchError } from 'ofetch'

const VALIDATION_ERROR_CODE = 422
const SERVER_ERROR_CODE = 500

export type ParsedApiError = {
  isValidationError: boolean
  httpStatus: number
  validationErrors: FormError[]
}

type BackendErrors = Record<string, string[]>

function mapValidationErrors(errors: BackendErrors): FormError[] {
  return Object.entries(errors).map(([name, messages]) => ({
    name,
    message: messages[0] ?? '',
  }))
}

export function parseApiError(error: unknown): ParsedApiError {
  const isFetchError = error instanceof FetchError
  const httpStatus =
    isFetchError && error.response?.status
      ? error.response.status
      : SERVER_ERROR_CODE

  const isValidationError = httpStatus === VALIDATION_ERROR_CODE

  const validationErrors =
    isValidationError && isFetchError && error.response?._data?.errors
      ? mapValidationErrors(error.response._data.errors)
      : []

  return {
    isValidationError,
    httpStatus,
    validationErrors,
  }
}
