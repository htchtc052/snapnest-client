import type { FormError } from '#ui/types'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { usePasswordResetSubmitRequest } from '../api/usePasswordResetSubmitRequest'
import type { PasswordResetDto } from '../contract/password-reset.contract'

export function usePasswordReset() {
  const router = useRouter()
  const { submitPasswordResetRequest } = usePasswordResetSubmitRequest()
  const {
    execute: submitPasswordReset,
    isLoading,
  } = useApiOperation(submitPasswordResetRequest)

  async function resetPassword(data: PasswordResetDto): Promise<FormError[] | undefined> {
    const result = await submitPasswordReset(data)

    if (result.status === ApiResultStatus.Success) {
      await router.push('/login?reset=1')
      return
    }

    if (result.status === ApiResultStatus.Validation) return result.errors
  }

  return {
    resetPassword,
    isLoading,
  }
}
