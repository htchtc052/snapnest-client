import type { User } from '~/entities/user'

export type ProfileInfoUpdateModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; user: User }
