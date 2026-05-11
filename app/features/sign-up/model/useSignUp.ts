import type { FormError } from '#ui/types'
import { ref } from '#imports'
import { parseApiError } from '~/shared/api'
import type { SignUpDto } from '../contract/sign-up.contract'
import { useSignUpRequest } from '../api/useSignUpRequest'

export function useSignUp() {
  const isLoading = ref(false)
  const { refreshIdentity } = useSanctumAuth()
  const config = useSanctumConfig()
  const router = useRouter()
  const { signUpRequest } = useSignUpRequest()

  async function signUp(data: SignUpDto): Promise<FormError[] | undefined> {
    isLoading.value = true

    try {
      await signUpRequest(data)
      await refreshIdentity()
      await router.push(config.redirect.onLogin || '/account/images')
    } catch (error: unknown) {
      const parsed = parseApiError(error)

      if (parsed.isValidationError) return parsed.validationErrors

      console.error('[Auth] Failed to sign up', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    signUp,
    isLoading,
  }
}
