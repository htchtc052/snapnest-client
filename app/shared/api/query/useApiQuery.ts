import { computed, ref } from '#imports'
import type { Ref } from 'vue'
import { parseApiError } from '../error/apiError'

export function useApiQuery<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  const data = ref<TResult | null>(null) as Ref<TResult | null>
  const error = ref<unknown | null>(null)
  const isLoading = ref(false)

  const hasError = computed(() => error.value !== null)

  async function execute(...args: TArgs): Promise<TResult | null> {
    isLoading.value = true
    error.value = null

    try {
      const result = await handler(...args)

      data.value = result

      return result
    } catch (queryError: unknown) {
      const parsed = parseApiError(queryError)

      error.value = queryError

      console.error('[API query failed]', {
        httpStatus: parsed.httpStatus,
        error: queryError,
      })

      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    error,
    isLoading,
    hasError,
    execute,
  }
}
