import type { PasswordResetRequestDto } from '../contract/password-reset-request.contract'

type PasswordResetEmailResponse = {
  status: string
}

export function usePasswordResetEmailRequest() {
  const client = useSanctumClient()

  function sendPasswordResetEmailRequest(
    data: PasswordResetRequestDto,
  ): Promise<PasswordResetEmailResponse> {
    return client<PasswordResetEmailResponse>('/forgot-password', {
      method: 'POST',
      body: data,
    })
  }

  return {
    sendPasswordResetEmailRequest,
  }
}
