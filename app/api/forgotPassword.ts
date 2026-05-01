import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { ForgotPasswordDto } from '~/types/forgot-password.contract'

type ForgotPasswordResponse = {
  status: string
}

export function forgotPassword(
  client: SanctumClient,
  data: ForgotPasswordDto,
): Promise<ForgotPasswordResponse> {
  return client<ForgotPasswordResponse>('/forgot-password', {
    method: 'POST',
    body: data,
  })
}
