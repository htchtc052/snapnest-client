import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { imagesUpload } from '~/api/account/imagesUpload'
import { UPLOAD_STATUS, type UploadStatus } from '~/types/upload-status'

export const useUploadsStore = defineStore('uploads', () => {
  type UploadItem = { id: string; file: File; status: UploadStatus }

  const items = ref<UploadItem[]>([])
  const isProcessing = ref(false)
  let sequence = 0

  const client = useSanctumClient()
  const toast = useToast()
  const appConfig = useAppConfig()

  function createId(file: File) {
    sequence += 1
    return `${file.name}-${file.lastModified}-${sequence}`
  }

  function appendFiles(files: File[]) {
    const next = files.map(file => ({
      id: createId(file),
      file,
      status: UPLOAD_STATUS.waiting,
    }))
    items.value = [...items.value, ...next]
  }

  function clear() {
    items.value = []
    isProcessing.value = false
  }

  function setStatus(id: string, status: UploadStatus) {
    items.value = items.value.map(item => (item.id === id ? { ...item, status } : item))
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async function processNext() {
    const next = items.value.find(item => item.status === UPLOAD_STATUS.waiting)
    if (!next) return

    setStatus(next.id, UPLOAD_STATUS.uploading)
    try {
      await imagesUpload(client, next.file)
      setStatus(next.id, UPLOAD_STATUS.uploaded)
    } catch (error: unknown) {
      console.error('[Images] Upload failed', error)
      setStatus(next.id, UPLOAD_STATUS.failed)
    }

    await sleep(120)
    await processNext()
  }

  async function uploadFiles(files: File[]) {
    if (!files.length) return
    const maxFiles = appConfig.upload?.maxFiles
    if (files.length > maxFiles) {
      toast.add({ title: `You can upload up to ${maxFiles} files at once.`, color: 'error' })
      return
    }

    appendFiles(files)
    if (isProcessing.value) return

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

  const isDone = computed(
    () => items.value.length > 0
      && items.value.every(
        item => item.status === UPLOAD_STATUS.uploaded || item.status === UPLOAD_STATUS.failed,
      )
  )

  return {
    items,
    isDone,
    uploadFiles,
    clear,
    removeWaiting,
  }
})
