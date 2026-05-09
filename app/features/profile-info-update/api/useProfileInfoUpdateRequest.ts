import type { ProfileInfoDto } from '~/entities/user/model'
import type { User } from '~/types/user.model'

export function useProfileInfoUpdateRequest() {
  const client = useSanctumClient()

  async function updateProfileInfoRequest(data: ProfileInfoDto) {
    return await client<User>('/api/account', {
      method: 'PUT',
      body: data,
    })
  }

  return {
    updateProfileInfoRequest,
  }
}
