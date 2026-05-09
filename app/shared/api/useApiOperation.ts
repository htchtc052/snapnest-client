import { ref } from '#imports'
import {
  ApiResultStatus,
  createApiSuccessResponse,
  parseApiOperationError,
  type ApiOperationResponse,
} from './apiResponse'

export type { ApiOperationResponse }

export function useApiOperation<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  const toast = useToast()
  const isLoading = ref(false)

  async function execute(...args: TArgs): Promise<ApiOperationResponse<TResult>> {
    isLoading.value = true

    try {
      return createApiSuccessResponse(await handler(...args))
    } catch (error: unknown) {
      const result = parseApiOperationError(error)

      if (result.status === ApiResultStatus.Validation) return result

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
