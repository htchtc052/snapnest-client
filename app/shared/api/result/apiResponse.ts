import type { FormError } from '#ui/types'

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
  status: ApiCommonErrorStatus
  httpStatus: number
}

export type ApiCommonErrorStatus =
  | ApiResultStatus.BadRequest
  | ApiResultStatus.Forbidden
  | ApiResultStatus.NotFound
  | ApiResultStatus.Error

export type ApiOperationResponse<T> =
  | ApiSuccessResponse<T>
  | ApiValidationErrorResponse
  | ApiCommonErrorResponse

export type ApiOperationErrorResponse =
  | ApiValidationErrorResponse
  | ApiCommonErrorResponse
