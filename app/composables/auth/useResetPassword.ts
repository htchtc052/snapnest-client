import type { FormError } from '#ui/types'
import { resetPassword } from '~/api/resetPassword'
import { parseApiError } from '~/shared/api'
import type { PasswordResetDto } from '~/types/password-reset.contract'

export function useResetPassword() {
  const isLoading = ref(false)
  const client = useSanctumClient()
  const router = useRouter()

  async function resetPasswordRequest(data: PasswordResetDto): Promise<FormError[] | undefined> {
    isLoading.value = true

    try {
      await resetPassword(client, data)
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
    resetPassword: resetPasswordRequest,
    isLoading,
  }
}
