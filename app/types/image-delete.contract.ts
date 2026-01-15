export type DeleteImagesResult = { deletedIds: number[] }

export type DeleteImagesModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; deletedIds?: number[] }
