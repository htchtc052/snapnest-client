import type { FormError } from '#ui/types'
import { ref } from '#imports'
import { mapFormError } from '~/http/handle-form-error'

const BAD_REQUEST_CODE = 400
const FORBIDDEN_CODE = 403
const NOT_FOUND_CODE = 404

export enum ApiOperationResult {
  Success = 'success',
  Validation = 'validation',
  BadRequest = 'badRequest',
  Forbidden = 'forbidden',
  NotFound = 'notFound',
  Error = 'error',
}

type ApiOperationSuccessResponse<T> = {
  status: ApiOperationResult.Success
  data: T
}

type ApiOperationValidationResponse = {
  status: ApiOperationResult.Validation
  errors: FormError[]
}

type ApiOperationNonValidationErrorResponse =
  | { status: ApiOperationResult.BadRequest }
  | { status: ApiOperationResult.Forbidden }
  | { status: ApiOperationResult.NotFound }
  | { status: ApiOperationResult.Error }

export type ApiOperationResponse<T> =
  | ApiOperationSuccessResponse<T>
  | ApiOperationValidationResponse
  | ApiOperationNonValidationErrorResponse

function mapOperationError(code: number): ApiOperationNonValidationErrorResponse {
  switch (code) {
    case BAD_REQUEST_CODE:
      return { status: ApiOperationResult.BadRequest }

    case FORBIDDEN_CODE:
      return { status: ApiOperationResult.Forbidden }

    case NOT_FOUND_CODE:
      return { status: ApiOperationResult.NotFound }

    default:
      return { status: ApiOperationResult.Error }
  }
}

export function useApiOperation<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  const toast = useToast()
  const isLoading = ref(false)

  async function execute(...args: TArgs): Promise<ApiOperationResponse<TResult>> {
    isLoading.value = true

    try {
      return {
        status: ApiOperationResult.Success,
        data: await handler(...args),
      }
    } catch (error: unknown) {
      const parsed = mapFormError(error)

      if (parsed.isValidationError) {
        return {
          status: ApiOperationResult.Validation,
          errors: parsed.bag,
        }
      }

      const result = mapOperationError(parsed.code)

      console.error('[API operation failed]', {
        httpStatus: parsed.code,
        status: result.status,
        error,
      })

      toast.add({
        title: 'Something went wrong.',
        color: 'error',
      })

      return result
    } finally {
      isLoading.value = false
    }
  }

  return {
    execute,
    isLoading,
  }
}
