import type { ProfileInfoDto } from '~/entities/user/model'
import type { User } from '~/entities/user'

export function useInfoUpdateRequest() {
  const client = useSanctumClient()

  async function updateInfoRequest(data: ProfileInfoDto) {
    return await client<User>('/api/account', {
      method: 'PUT',
      body: data,
    })
  }

  return {
    updateInfoRequest,
  }
}
