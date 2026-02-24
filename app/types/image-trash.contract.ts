export type TrashImagesModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; trashedIds?: number[] }
