import { usePersistentOverlay } from '~/shared/overlay'
import UploadImagesSlideover from '../ui/UploadImagesSlideover.vue'

export function useUploadImagesOverlay() {
  const uploadImagesOverlay = usePersistentOverlay(UploadImagesSlideover)

  function openUploadImagesLayer() {
    return uploadImagesOverlay.open()
  }

  function closeUploadImagesLayer() {
    return uploadImagesOverlay.close()
  }

  function unmountUploadImagesLayer() {
    uploadImagesOverlay.unmount()
  }

  return {
    openUploadImagesLayer,
    closeUploadImagesLayer,
    unmountUploadImagesLayer,
  }
}
