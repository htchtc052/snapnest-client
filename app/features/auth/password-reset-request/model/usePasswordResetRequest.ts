import type { FormError } from '#ui/types'
import { ref } from '#imports'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { usePasswordResetEmailRequest } from '../api/usePasswordResetEmailRequest'
import type { PasswordResetRequestDto } from '../contract/password-reset-request.contract'

export function usePasswordResetRequest() {
  const statusMessage = ref<string | null>(null)
  const { sendPasswordResetEmailRequest } = usePasswordResetEmailRequest()
  const {
    execute: sendPasswordResetEmail,
    isLoading,
  } = useApiOperation(sendPasswordResetEmailRequest)

  async function sendResetLink(data: PasswordResetRequestDto): Promise<FormError[] | undefined> {
    statusMessage.value = null

    const result = await sendPasswordResetEmail(data)

    if (result.status === ApiResultStatus.Success) {
      statusMessage.value = result.data.status
      return
    }

    if (result.status === ApiResultStatus.Validation) return result.errors
  }

  return {
    sendResetLink,
    isLoading,
    statusMessage,
  }
}
