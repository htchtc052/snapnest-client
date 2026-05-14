import type { User } from '~/entities/user'

export type ProfileInfoUpdateFormResult =
  | { action: 'cancel' }
  | { action: 'confirm'; user: User }
