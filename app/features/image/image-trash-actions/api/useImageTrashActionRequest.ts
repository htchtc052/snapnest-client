import type { ImageTrashActionResult, ImageTrashActionType } from '../contract/image-trash-actions.contract'

export function useImageTrashActionRequest() {
  const client = useSanctumClient()

  async function executeImageTrashActionRequest(actionType: ImageTrashActionType, ids: number[]) {
    return await client<ImageTrashActionResult>('/api/account/images/action', {
      method: 'POST',
      body: {
        actionType,
        ids,
      },
    })
  }

  return {
    executeImageTrashActionRequest,
  }
}
