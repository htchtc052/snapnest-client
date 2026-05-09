export type ShareImagesDto = {
  image_ids: number[]
}

export type ShareImagesConfirmModalResult = {
  action: 'cancel' | 'confirm'
}
