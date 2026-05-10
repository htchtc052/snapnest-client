import { ref } from '#imports'
import type { Ref } from 'vue'
import { parseApiError } from '../error/apiError'

export function useApiQuery<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  const data = ref<TResult | null>(null) as Ref<TResult | null>
  const hasError = ref(false)
  const isLoading = ref(false)

  async function execute(...args: TArgs): Promise<TResult | null> {
    isLoading.value = true
    hasError.value = false

    try {
      const result = await handler(...args)

      data.value = result

      return result
    } catch (queryError: unknown) {
      const parsed = parseApiError(queryError)

      hasError.value = true

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
    isLoading,
    hasError,
    execute,
  }
}
