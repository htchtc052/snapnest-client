import { useOpenPersistentDrawerContent } from '~/shared/overlay'
import UploadImagesContent from '../ui/UploadImagesContent.vue'

export function useUploadImagesOverlay() {
  const uploadImagesOverlay = useOpenPersistentDrawerContent({
    component: UploadImagesContent,
    title: 'Uploads',
  })

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
