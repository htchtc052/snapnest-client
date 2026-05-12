import type { FormError } from '#ui/types'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { SignUpDto } from '../contract/sign-up.contract'
import { useSignUpRequest } from '../api/useSignUpRequest'

export function useSignUp() {
  const { refreshIdentity } = useSanctumAuth()
  const config = useSanctumConfig()
  const router = useRouter()
  const { signUpRequest } = useSignUpRequest()
  const {
    execute: executeSignUp,
    isLoading,
  } = useApiOperation(signUpRequest)

  async function signUp(data: SignUpDto): Promise<FormError[] | undefined> {
    const result = await executeSignUp(data)

    if (result.status === ApiResultStatus.Validation) return result.errors

    if (result.status !== ApiResultStatus.Success) return

    await refreshIdentity()
    await router.push(config.redirect.onLogin || '/account/images')
  }

  return {
    signUp,
    isLoading,
  }
}
