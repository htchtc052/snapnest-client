import type { FormError } from '#ui/types'
import { forgotPassword } from '~/api/forgotPassword'
import { parseApiError } from '~/shared/api'
import type { ForgotPasswordDto } from '~/types/forgot-password.contract'

export function useForgotPassword() {
  const isLoading = ref(false)
  const statusMessage = ref<string | null>(null)
  const client = useSanctumClient()

  async function sendResetLink(data: ForgotPasswordDto): Promise<FormError[] | undefined> {
    isLoading.value = true
    statusMessage.value = null

    try {
      const response = await forgotPassword(client, data)
      statusMessage.value = response.status
    } catch (error: unknown) {
      const parsed = parseApiError(error)

      if (parsed.isValidationError) return parsed.validationErrors

      console.error('[Auth] Failed to send password reset link', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    sendResetLink,
    isLoading,
    statusMessage,
  }
}
