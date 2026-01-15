import type { FormError } from '#ui/types';
import { mapFormError } from "~/http/handle-form-error";
import type { LoginDto } from "~/types/login.contract";

export function useLogin() {
    const isLoading = ref(false)
    const { login } = useSanctumAuth()

    async function loginRequest(data: LoginDto): Promise<FormError[] | undefined> {
        isLoading.value = true
        try {
            await login(data)
        } catch (error: unknown) {
            const parsed = mapFormError(error)
            if (parsed.isValidationError) return parsed.bag
            console.error('[Auth] Failed to login', error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        login: loginRequest,
        isLoading,
    }
}
