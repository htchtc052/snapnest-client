import { ApiResultStatus, type ApiCommonErrorStatus } from './apiResponse'

export enum ApiHttpStatus {
  BadRequest = 400,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export function mapHttpStatusToApiCommonStatus(code: number): ApiCommonErrorStatus {
  switch (code) {
    case ApiHttpStatus.BadRequest:
      return ApiResultStatus.BadRequest

    case ApiHttpStatus.Forbidden:
      return ApiResultStatus.Forbidden

    case ApiHttpStatus.NotFound:
      return ApiResultStatus.NotFound

    default:
      return ApiResultStatus.Error
  }
}
