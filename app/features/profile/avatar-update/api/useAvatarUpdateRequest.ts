import type { User } from '~/entities/user'

export function useAvatarUpdateRequest() {
  const client = useSanctumClient()

  async function updateAvatarRequest(avatar: File): Promise<User> {
    const body = new FormData()
    body.append('avatar', avatar)

    return await client<User>('/api/account/avatar', {
      method: 'POST',
      body,
    })
  }

  return {
    updateAvatarRequest,
  }
}
