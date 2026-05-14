import type { User } from '~/entities/user'

export type ProfileAvatarUpdateFormResult =
  | { action: 'cancel' }
  | { action: 'confirm'; user: User }

export type ProfileAvatarUpdateDto = {
  avatar: File | null
}
