import type { FormError } from '#ui/types'
import { mapFormError } from '~/http/handle-form-error'

const BAD_REQUEST_CODE = 400
const FORBIDDEN_CODE = 403
const NOT_FOUND_CODE = 404

export enum ApiResultStatus {
  Success = 'success',
  Validation = 'validation',
  BadRequest = 'badRequest',
  Forbidden = 'forbidden',
  NotFound = 'notFound',
  Error = 'error',
}

export type ApiSuccessResponse<T> = {
  status: ApiResultStatus.Success
  data: T
}

export type ApiValidationErrorResponse = {
  status: ApiResultStatus.Validation
  errors: FormError[]
  httpStatus: number
}

export type ApiCommonErrorResponse = {
  status:
    | ApiResultStatus.BadRequest
    | ApiResultStatus.Forbidden
    | ApiResultStatus.NotFound
    | ApiResultStatus.Error
  httpStatus: number
}

export type ApiQueryResponse<T> =
  | ApiSuccessResponse<T>
  | ApiCommonErrorResponse

export type ApiOperationResponse<T> =
  | ApiSuccessResponse<T>
  | ApiValidationErrorResponse
  | ApiCommonErrorResponse

export type ApiOperationErrorResponse =
  | ApiValidationErrorResponse
  | ApiCommonErrorResponse

function mapApiCommonErrorStatus(code: number): ApiCommonErrorResponse['status'] {
  switch (code) {
    case BAD_REQUEST_CODE:
      return ApiResultStatus.BadRequest

    case FORBIDDEN_CODE:
      return ApiResultStatus.Forbidden

    case NOT_FOUND_CODE:
      return ApiResultStatus.NotFound

    default:
      return ApiResultStatus.Error
  }
}

export function createApiSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    status: ApiResultStatus.Success,
    data,
  }
}

export function parseApiCommonError(error: unknown): ApiCommonErrorResponse {
  const parsed = mapFormError(error)

  return {
    status: mapApiCommonErrorStatus(parsed.code),
    httpStatus: parsed.code,
  }
}

export function parseApiOperationError(error: unknown): ApiOperationErrorResponse {
  const parsed = mapFormError(error)

  if (parsed.isValidationError) {
    return {
      status: ApiResultStatus.Validation,
      errors: parsed.bag,
      httpStatus: parsed.code,
    }
  }

  return {
    status: mapApiCommonErrorStatus(parsed.code),
    httpStatus: parsed.code,
  }
}
