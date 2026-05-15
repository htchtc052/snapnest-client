import type { User } from '~/entities/user'

export type AvatarUpdateFormResult = User

export type AvatarUpdateDto = {
  avatar: File | null
}
