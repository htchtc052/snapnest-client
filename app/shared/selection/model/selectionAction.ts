export type SelectionAction = {
  key: string
  label: string
  icon: string
  onSelect: () => void | Promise<void>
  title?: string
  visible?: boolean
  loading?: boolean
  disabled?: boolean
}
