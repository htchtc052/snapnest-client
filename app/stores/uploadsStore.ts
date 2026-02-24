import { defineStore } from 'pinia'
import type { FetchError } from 'ofetch'
import { computed, ref } from 'vue'
import { imagesUpload } from '~/api/account/imagesUpload'
import { UPLOAD_ERROR_CODE } from '~/types/upload-error-code'
import type { Image } from '~/types/image.model'
import { UPLOAD_STATUS, type UploadStatus } from '~/types/upload-status'
import type { User } from '~/types/user.model'

export const useUploadsStore = defineStore('uploads', () => {
  type UploadItem = { id: string; file: File; status: UploadStatus; errorMessage?: string; image?: Image }

  const items = ref<UploadItem[]>([])
  const isProcessing = ref(false)
  const stopQueue = ref(false)
  let sequence = 0

  const client = useSanctumClient()
  const toast = useToast()
  const appConfig = useAppConfig()
  const { user, refreshIdentity } = useSanctumAuth<User>()

  function createId(file: File) {
    sequence += 1
    return `${file.name}-${file.lastModified}-${sequence}`
  }

  function appendFiles(files: File[]) {
    const next = files.map(file => ({
      id: createId(file),
      file,
      status: UPLOAD_STATUS.waiting,
      errorMessage: undefined,
      image: undefined,
    }))
    items.value = [...items.value, ...next]
  }

  function clear() {
    items.value = []
    isProcessing.value = false
    stopQueue.value = false
  }

  function setStatus(id: string, status: UploadStatus, errorMessage?: string) {
    items.value = items.value.map((item) => {
      if (item.id !== id) return item

      if (status === UPLOAD_STATUS.failed) {
        return { ...item, status, errorMessage }
      }

      return { ...item, status, errorMessage: undefined }
    })
  }

  function setUploaded(id: string, image: Image) {
    items.value = items.value.map((item) => {
      if (item.id !== id) return item

      return { ...item, status: UPLOAD_STATUS.uploaded, image, errorMessage: undefined }
    })
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function removeWaitingItems() {
    items.value = items.value.filter(item => item.status !== UPLOAD_STATUS.waiting)
  }

  async function processNext() {
    if (stopQueue.value) return

    const next = items.value.find(item => item.status === UPLOAD_STATUS.waiting)
    if (!next) return

    let shouldStopQueue = false
    let currentFileErrorMessage = ''

    setStatus(next.id, UPLOAD_STATUS.uploading)
    try {
      const image = await imagesUpload(client, next.file)
      setUploaded(next.id, image)
      await refreshIdentity()

      if (user.value?.isUploadBlocked) {
        shouldStopQueue = true
      }
    } catch (error: unknown) {
      const responseCode = (error as FetchError).response?._data
      console.error('[Images] Upload failed', error)

      if (responseCode === UPLOAD_ERROR_CODE.imageRequired) {
        currentFileErrorMessage = 'Image is required'
      } else if (responseCode === UPLOAD_ERROR_CODE.invalidMime) {
        currentFileErrorMessage = 'Unsupported format'
      } else if (responseCode === UPLOAD_ERROR_CODE.fileTooLarge) {
        currentFileErrorMessage = 'File is too large'
      } else if (responseCode === UPLOAD_ERROR_CODE.quotaImagesReached) {
        currentFileErrorMessage = 'Image limit reached'
        shouldStopQueue = true
      } else if (responseCode === UPLOAD_ERROR_CODE.quotaBytesReached) {
        currentFileErrorMessage = 'Storage limit reached'
        shouldStopQueue = true
      } else {
        currentFileErrorMessage = 'Upload failed'
      }

      setStatus(next.id, UPLOAD_STATUS.failed, currentFileErrorMessage)
    }

    if (shouldStopQueue) {
      stopQueue.value = true
      removeWaitingItems()
      return
    }

    await sleep(120)
    await processNext()
  }

  async function uploadFiles(files: File[]) {
    if (!files.length) return
    const maxFilesPerSelection = appConfig.upload?.maxFilesPerSelection
    if (files.length > maxFilesPerSelection) {
      toast.add({ title: `You can upload up to ${maxFilesPerSelection} files at once.`, color: 'error' })
      return
    }

    const maxQueueItems = appConfig.upload?.maxQueueItems
    if (items.value.length + files.length > maxQueueItems) {
      toast.add({ title: `Upload queue limit is ${maxQueueItems} files.`, color: 'error' })
      return
    }

    if (user.value?.isUploadBlocked) {
      return
    }

    appendFiles(files)
    if (isProcessing.value) return

    stopQueue.value = false
    isProcessing.value = true
    try {
      await processNext()
    } finally {
      isProcessing.value = false
    }
  }

  function removeWaiting(id: string) {
    items.value = items.value.filter(item => !(item.id === id && item.status === UPLOAD_STATUS.waiting))
  }

  const isDone = computed(() =>
    items.value.every(
      item => item.status === UPLOAD_STATUS.uploaded || item.status === UPLOAD_STATUS.failed,
    ),
  )

  return {
    items,
    isDone,
    uploadFiles,
    clear,
    removeWaiting,
  }
})
