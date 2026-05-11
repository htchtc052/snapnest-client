import type { FormError } from '#ui/types'
import { ref } from '#imports'
import { parseApiError } from '~/shared/api'
import type { SignInDto } from '../contract/sign-in.contract'

export function useSignIn() {
  const isLoading = ref(false)
  const { login } = useSanctumAuth()

  async function signIn(data: SignInDto): Promise<FormError[] | undefined> {
    isLoading.value = true

    try {
      await login(data)
    } catch (error: unknown) {
      const parsed = parseApiError(error)

      if (parsed.isValidationError) return parsed.validationErrors

      console.error('[Auth] Failed to sign in', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    signIn,
    isLoading,
  }
}
