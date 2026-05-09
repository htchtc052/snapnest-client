import { ref } from '#imports'
import {
  ApiResultStatus,
  type ApiCommonErrorResponse,
  type ApiOperationResponse,
} from './apiResponse'
import { parseApiError } from './apiError'
import { mapHttpStatusToApiCommonStatus } from './apiErrorStatus'

export type { ApiOperationResponse }

export function useApiOperation<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  const toast = useToast()
  const isLoading = ref(false)

  async function execute(...args: TArgs): Promise<ApiOperationResponse<TResult>> {
    isLoading.value = true

    try {
      return {
        status: ApiResultStatus.Success,
        data: await handler(...args),
      }
    } catch (error: unknown) {
      const parsed = parseApiError(error)

      if (parsed.isValidationError) {
        return {
          status: ApiResultStatus.Validation,
          errors: parsed.validationErrors,
          httpStatus: parsed.httpStatus,
        }
      }

      const result: ApiCommonErrorResponse = {
        status: mapHttpStatusToApiCommonStatus(parsed.httpStatus),
        httpStatus: parsed.httpStatus,
      }

      console.error('[API operation failed]', {
        httpStatus: result.httpStatus,
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
