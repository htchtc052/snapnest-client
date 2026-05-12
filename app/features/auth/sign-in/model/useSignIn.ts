import type { FormError } from '#ui/types'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { SignInDto } from '../contract/sign-in.contract'

export function useSignIn() {
  const { login } = useSanctumAuth()
  const {
    execute: executeSignIn,
    isLoading,
  } = useApiOperation(login)

  async function signIn(data: SignInDto): Promise<FormError[] | undefined> {
    const result = await executeSignIn(data)

    if (result.status === ApiResultStatus.Validation) return result.errors
  }

  return {
    signIn,
    isLoading,
  }
}
