export type ConfirmResult = boolean

export type ConfirmFormProps = {
  title?: string
  description: string
  confirmLabel: string
  confirmIcon?: string
  confirmColor?: 'primary' | 'error'
}
