export type ConfirmResult =
  | { action: 'cancel' }
  | { action: 'confirm' }

export type ConfirmFormProps = {
  title?: string
  modalTitle?: string
  description: string
  confirmLabel: string
  confirmIcon?: string
  confirmColor?: 'primary' | 'error'
}
