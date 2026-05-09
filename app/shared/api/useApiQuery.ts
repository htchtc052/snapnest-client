import { computed, ref } from '#imports'
import type { Ref } from 'vue'

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
  const error = ref<unknown | null>(null)
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
      error.value = queryError
      status.value = ApiQueryStatus.Error

      console.error('[API query failed]', queryError)

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