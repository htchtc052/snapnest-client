import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { PasswordResetDto } from '~/types/password-reset.contract'

type ResetPasswordResponse = {
  status: string
}

export function resetPassword(
  client: SanctumClient,
  data: PasswordResetDto,
): Promise<ResetPasswordResponse> {
  return client<ResetPasswordResponse>('/reset-password', {
    method: 'POST',
    body: data,
  })
}
