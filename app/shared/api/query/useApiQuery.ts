import { computed, ref } from '#imports'
import type { Ref } from 'vue'
import { type ApiCommonErrorResponse } from '../result/apiResponse'
import { parseApiError } from '../error/apiError'
import { mapHttpStatusToApiCommonStatus } from '../result/apiErrorStatus'

export enum ApiQueryStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export function useApiQuery<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  const data = ref<TResult | null>(null) as Ref<TResult | null>
  const error = ref<ApiCommonErrorResponse | null>(null)
  const status = ref<ApiQueryStatus>(ApiQueryStatus.Idle)

  const isLoading = computed(() => status.value === ApiQueryStatus.Pending)
  const isSuccess = computed(() => status.value === ApiQueryStatus.Success)
  const isError = computed(() => status.value === ApiQueryStatus.Error)
  const hasError = computed(() => error.value !== null)

  async function execute(...args: TArgs): Promise<TResult | null> {
    status.value = ApiQueryStatus.Pending
    error.value = null

    try {
      const result = await handler(...args)

      data.value = result
      status.value = ApiQueryStatus.Success

      return result
    } catch (queryError: unknown) {
      const parsed = parseApiError(queryError)
      const apiError: ApiCommonErrorResponse = {
        status: mapHttpStatusToApiCommonStatus(parsed.httpStatus),
        httpStatus: parsed.httpStatus,
      }

      error.value = apiError
      status.value = ApiQueryStatus.Error

      console.error('[API query failed]', {
        httpStatus: apiError.httpStatus,
        status: apiError.status,
        error: queryError,
      })

      return null
    }
  }

  return {
    data,
    error,
    status,
    isLoading,
    isSuccess,
    isError,
    hasError,
    execute,
  }
}
