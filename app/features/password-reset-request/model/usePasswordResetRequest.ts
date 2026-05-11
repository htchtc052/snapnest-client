import type { FormError } from '#ui/types'
import { ref } from '#imports'
import { parseApiError } from '~/shared/api'
import { usePasswordResetEmailRequest } from '../api/usePasswordResetEmailRequest'
import type { PasswordResetRequestDto } from '../contract/password-reset-request.contract'

export function usePasswordResetRequest() {
  const isLoading = ref(false)
  const statusMessage = ref<string | null>(null)
  const { sendPasswordResetEmailRequest } = usePasswordResetEmailRequest()

  async function sendResetLink(data: PasswordResetRequestDto): Promise<FormError[] | undefined> {
    isLoading.value = true
    statusMessage.value = null

    try {
      const response = await sendPasswordResetEmailRequest(data)

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
