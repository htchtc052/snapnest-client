import type { FormError } from '#ui/types'
import { ref } from '#imports'
import { parseApiError } from '~/shared/api'
import { usePasswordResetSubmitRequest } from '../api/usePasswordResetSubmitRequest'
import type { PasswordResetDto } from '../contract/password-reset.contract'

export function usePasswordReset() {
  const isLoading = ref(false)
  const router = useRouter()
  const { submitPasswordResetRequest } = usePasswordResetSubmitRequest()

  async function resetPassword(data: PasswordResetDto): Promise<FormError[] | undefined> {
    isLoading.value = true

    try {
      await submitPasswordResetRequest(data)
      await router.push('/login?reset=1')
    } catch (error: unknown) {
      const parsed = parseApiError(error)

      if (parsed.isValidationError) return parsed.validationErrors

      console.error('[Auth] Failed to reset password', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    resetPassword,
    isLoading,
  }
}
