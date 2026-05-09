import type { User } from '~/types/user.model'

export type ProfileInfoUpdateModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; user: User }
