import { ApiResultStatus, type ApiCommonErrorStatus } from './apiResponse'

const BAD_REQUEST_CODE = 400
const FORBIDDEN_CODE = 403
const NOT_FOUND_CODE = 404

export function mapHttpStatusToApiCommonStatus(code: number): ApiCommonErrorStatus {
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
