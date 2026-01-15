

export type AttachImagesInput = { albumId: number; imageIds: number[] }

export type AttachImagesModalResult =
    | { action: 'cancel' }
    | { action: 'confirm' }
