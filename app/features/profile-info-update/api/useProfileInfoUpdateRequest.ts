import type { ProfileInfoDto } from '~/entities/user/model'
import type { User } from '~/entities/user'

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
