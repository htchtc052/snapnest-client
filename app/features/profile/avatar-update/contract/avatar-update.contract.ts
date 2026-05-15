import type { User } from '~/entities/user'

export type AvatarUpdateFormResult =
  | { action: 'cancel' }
  | { action: 'confirm'; user: User }

export type AvatarUpdateDto = {
  avatar: File | null
}
