export type AlbumHeaderAction = {
  key: string
  label: string
  icon: string
  color?: 'primary' | 'neutral'
  variant?: 'solid' | 'outline' | 'ghost'
  loading?: boolean
  disabled?: boolean
  onClick: () => void | Promise<void>
}
