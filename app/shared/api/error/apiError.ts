import type { FormError } from '#ui/types'
import { FetchError } from 'ofetch'
import { ApiHttpStatus } from '../result/apiErrorStatus'

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
      : ApiHttpStatus.InternalServerError

  const isValidationError = httpStatus === ApiHttpStatus.Validation

  const validationErrors =
    isValidationError && isFetchError && error.data?.errors
      ? mapValidationErrors(error.data.errors)
      : []

  return {
    isValidationError,
    httpStatus,
    validationErrors,
  }
}
