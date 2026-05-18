import { usePersistentOverlay } from '~/shared/overlay'
import UploadImagesDrawer from '../ui/UploadImagesDrawer.vue'

export function useUploadImagesOverlay() {
  const uploadImagesOverlay = usePersistentOverlay(UploadImagesDrawer)

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
