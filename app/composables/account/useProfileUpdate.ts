import type { FormError } from '#ui/types'
import { profileUpdate } from "~/api/account/profileUpdate"
import { mapFormError } from "~/http/handle-form-error"
import type { ProfileUpdateDto } from "~/types/profile-update.contract"

export function useProfileUpdate() {
  const isUpdating = ref(false)
  const client = useSanctumClient()

  async function updateProfile(data: ProfileUpdateDto): Promise<FormError[] | true | undefined> {
    isUpdating.value = true
    try {
      await profileUpdate(client, data)
      return true
    } catch (error: unknown) {
      const parsed = mapFormError(error)
      if (parsed.isValidationError) return parsed.bag
      console.error('[Profile] Failed to update profile', error)
    } finally {
      isUpdating.value = false
    }
  }

  return {
    updateProfile,
    isUpdating,
  }
}
