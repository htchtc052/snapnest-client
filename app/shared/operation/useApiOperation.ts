import type { FormError } from '#ui/types'
import { ref } from '#imports'
import { mapFormError } from '~/http/handle-form-error'

export type ApiOperationResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: 'validation'; errors: FormError[] }
  | { ok: false; reason: 'error' }

export function useApiOperation<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  const toast = useToast()
  const isLoading = ref(false)

  async function execute(...args: TArgs): Promise<ApiOperationResult<TResult>> {
    isLoading.value = true

    try {
      return {
        ok: true,
        data: await handler(...args),
      }
    } catch (error: unknown) {
      const parsed = mapFormError(error)

      if (parsed.isValidationError) {
        return {
          ok: false,
          reason: 'validation',
          errors: parsed.bag,
        }
      }

      console.error('[API operation failed]', error)

      toast.add({
        title: 'Something went wrong.',
        color: 'error',
      })

      return {
        ok: false,
        reason: 'error',
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    execute,
    isLoading,
  }
}
