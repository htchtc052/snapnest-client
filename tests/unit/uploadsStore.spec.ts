import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { FetchError } from 'ofetch'
import { useUploadsStore } from '~/stores/uploadsStore'
import { UPLOAD_ERROR_CODE } from '~/types/upload-error-code'
import { UPLOAD_STATUS } from '~/types/upload-status'
import { imagesUpload } from '~/api/account/imagesUpload'
import { refreshIdentityMock, sanctumIsAuthenticatedMock, sanctumUserMock } from '../setup'

vi.mock('~/api/account/imagesUpload', () => ({
  imagesUpload: vi.fn(),
}))

const uploadMock = vi.mocked(imagesUpload)
const uploadedImage = {
  id: 1,
  name: 'uploaded',
  size: 1024,
  width: 800,
  height: 600,
  capturedAt: '2026-01-01 00:00:00',
  createdAt: '2026-01-01 00:00:00',
  ownerId: 1,
  ownerName: 'user',
}

describe('uploadsStore', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    setActivePinia(createPinia())
    uploadMock.mockReset()
    refreshIdentityMock.mockReset()
    sanctumUserMock.value = null
    sanctumIsAuthenticatedMock.value = false
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('uploads files sequentially and marks them as uploaded', async () => {
    // Verifies sequential processing and status transitions on success.
    const store = useUploadsStore()
    const files = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ]

    uploadMock.mockResolvedValue(uploadedImage)
    vi.useFakeTimers()

    const promise = store.uploadFiles(files)
    await vi.runAllTimersAsync()
    await promise

    expect(uploadMock).toHaveBeenCalledTimes(2)
    expect(store.items.map(item => item.status)).toEqual([
      UPLOAD_STATUS.uploaded,
      UPLOAD_STATUS.uploaded,
    ])
    expect(refreshIdentityMock).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  it('marks a failed upload and continues', async () => {
    // Verifies a failure doesn't block later uploads and statuses reflect errors.
    const store = useUploadsStore()
    const files = [
      new File(['a'], 'bad.png', { type: 'image/png' }),
      new File(['b'], 'good.png', { type: 'image/png' }),
    ]

    uploadMock
      .mockRejectedValueOnce(new FetchError('fail'))
      .mockResolvedValueOnce(uploadedImage)

    vi.useFakeTimers()

    const promise = store.uploadFiles(files)
    await vi.runAllTimersAsync()
    await promise

    expect(store.items.map(item => item.status)).toEqual([
      UPLOAD_STATUS.failed,
      UPLOAD_STATUS.uploaded,
    ])
    expect(store.items[0]?.errorMessage).toBe('Upload failed')
    expect(refreshIdentityMock).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('stops queue on quota error, keeps failed item and removes waiting tail', async () => {
    const store = useUploadsStore()
    const files = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
      new File(['c'], 'three.png', { type: 'image/png' }),
    ]

    const error = new FetchError('quota')
    Object.defineProperty(error, 'response', {
      value: { _data: UPLOAD_ERROR_CODE.quotaImagesReached, status: 422 },
      configurable: true,
    })
    uploadMock.mockRejectedValueOnce(error)

    vi.useFakeTimers()

    const promise = store.uploadFiles(files)
    await vi.runAllTimersAsync()
    await promise

    expect(uploadMock).toHaveBeenCalledTimes(1)
    expect(store.items).toHaveLength(1)
    expect(store.items[0]?.status).toBe(UPLOAD_STATUS.failed)
    expect(store.items[0]?.errorMessage).toBe('Image limit reached')
    expect(refreshIdentityMock).toHaveBeenCalledTimes(0)

    vi.useRealTimers()
  })

  it('stops queue after successful upload when identity becomes upload-blocked', async () => {
    const store = useUploadsStore()
    const files = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ]

    uploadMock.mockResolvedValue(uploadedImage)
    refreshIdentityMock.mockImplementationOnce(async () => {
      sanctumUserMock.value = {
        isUploadBlocked: true,
        uploadBlockedReason: UPLOAD_ERROR_CODE.quotaBytesReached,
      }
    })

    vi.useFakeTimers()

    const promise = store.uploadFiles(files)
    await vi.runAllTimersAsync()
    await promise

    expect(uploadMock).toHaveBeenCalledTimes(1)
    expect(store.items).toHaveLength(1)
    expect(store.items[0]?.status).toBe(UPLOAD_STATUS.uploaded)
    expect(refreshIdentityMock).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('does not enqueue files when upload is blocked for user', async () => {
    sanctumUserMock.value = { isUploadBlocked: true }
    const store = useUploadsStore()
    const files = [new File(['a'], 'one.png', { type: 'image/png' })]

    await store.uploadFiles(files)

    expect(uploadMock).not.toHaveBeenCalled()
    expect(store.items).toEqual([])
  })

  it('does not enqueue files when queue limit is reached', async () => {
    const store = useUploadsStore()
    store.items = Array.from({ length: 1000 }, (_, index) => ({
      id: `id-${index}`,
      file: new File(['a'], `f-${index}.png`, { type: 'image/png' }),
      status: UPLOAD_STATUS.waiting,
    }))

    await store.uploadFiles([new File(['x'], 'new.png', { type: 'image/png' })])

    expect(uploadMock).not.toHaveBeenCalled()
    expect(store.items).toHaveLength(1000)
  })

  it('removes only waiting items and reports completion state', () => {
    // Waiting items can be removed; done state depends on all statuses.
    const store = useUploadsStore()
    store.items = [
      { id: 'w1', file: new File(['a'], 'w1.png'), status: UPLOAD_STATUS.waiting },
      { id: 'u1', file: new File(['b'], 'u1.png'), status: UPLOAD_STATUS.uploaded },
      { id: 'f1', file: new File(['c'], 'f1.png'), status: UPLOAD_STATUS.failed },
    ]

    expect(store.isDone).toBe(false)

    store.removeWaiting('w1')
    expect(store.items.map(item => item.id)).toEqual(['u1', 'f1'])
    expect(store.isDone).toBe(true)
  })
})
