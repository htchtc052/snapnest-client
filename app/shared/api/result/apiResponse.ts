import type { FormError } from '#ui/types'

export enum ApiResultStatus {
  Success = 'success',
  Validation = 'validation',
  Error = 'error',
}

export type ApiOperationResponse<T> =
  | {
    status: ApiResultStatus.Success
    data: T
  }
  | {
    status: ApiResultStatus.Validation
    errors: FormError[]
  }
  | {
    status: ApiResultStatus.Error
  }
