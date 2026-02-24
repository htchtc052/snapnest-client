export type AlbumDeleteResult = boolean | undefined

export type AlbumDeleteModalResult =
  | { action: 'cancel' }
  | { action: 'confirm' }
