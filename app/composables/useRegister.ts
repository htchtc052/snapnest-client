import type { FormError } from '#ui/types'
import { register } from "~/api/register"
import { mapFormError } from "~/http/handle-form-error"
import type { RegistrationDto } from "~/types/registration.contract"

export function useRegister() {
  const isLoading = ref(false)
  const client = useSanctumClient()
  const { refreshIdentity } = useSanctumAuth()
  const config = useSanctumConfig()
  const router = useRouter()

  async function registerRequest(data: RegistrationDto): Promise<FormError[] | undefined> {
    isLoading.value = true
    try {
      await register(client, data)
      await refreshIdentity()
      await router.push(config.redirect.onLogin || '/account')
    } catch (error: unknown) {
      const parsed = mapFormError(error)
      if (parsed.isValidationError) return parsed.bag
      console.error('[Auth] Failed to register', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    register: registerRequest,
    isLoading,
  }
}
