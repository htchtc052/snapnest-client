import type { PasswordResetDto } from '../contract/password-reset.contract'

type PasswordResetSubmitResponse = {
  status: string
}

export function usePasswordResetSubmitRequest() {
  const client = useSanctumClient()

  function submitPasswordResetRequest(data: PasswordResetDto): Promise<PasswordResetSubmitResponse> {
    return client<PasswordResetSubmitResponse>('/reset-password', {
      method: 'POST',
      body: data,
    })
  }

  return {
    submitPasswordResetRequest,
  }
}
