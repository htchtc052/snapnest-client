import type { User } from '~/entities/user'

export type InfoUpdateFormResult =
  | { action: 'cancel' }
  | { action: 'confirm'; user: User }
