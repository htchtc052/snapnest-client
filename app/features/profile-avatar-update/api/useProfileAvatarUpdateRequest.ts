import type { User } from '~/entities/user'

export function useProfileAvatarUpdateRequest() {
  const client = useSanctumClient()

  async function updateProfileAvatarRequest(avatar: File): Promise<User> {
    const body = new FormData()
    body.append('avatar', avatar)

    return await client<User>('/api/account/avatar', {
      method: 'POST',
      body,
    })
  }

  return {
    updateProfileAvatarRequest,
  }
}
