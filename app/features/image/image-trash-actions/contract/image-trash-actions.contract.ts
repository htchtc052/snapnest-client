export enum ImageTrashActionType {
  Trash = 'trash',
  Restore = 'restore',
  Delete = 'delete',
}

export type ImageTrashActionResult = {
  actionType: ImageTrashActionType
  imageIds: number[]
}

export type ImageTrashActionModalResult =
  | { action: 'cancel' }
  | { action: 'confirm' }
