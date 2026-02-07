import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUploadsStore } from '~/stores/uploadsStore'
import { UPLOAD_STATUS } from '~/types/upload-status'
import { imagesUpload } from '~/api/account/imagesUpload'

vi.mock('~/api/account/imagesUpload', () => ({
  imagesUpload: vi.fn(),
}))

const uploadMock = vi.mocked(imagesUpload)

describe('uploadsStore', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    setActivePinia(createPinia())
    uploadMock.mockReset()
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

    uploadMock.mockResolvedValue({})
    vi.useFakeTimers()

    const promise = store.uploadFiles(files)
    await vi.runAllTimersAsync()
    await promise

    expect(uploadMock).toHaveBeenCalledTimes(2)
    expect(store.items.map(item => item.status)).toEqual([
      UPLOAD_STATUS.uploaded,
      UPLOAD_STATUS.uploaded,
    ])

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
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({})

    vi.useFakeTimers()

    const promise = store.uploadFiles(files)
    await vi.runAllTimersAsync()
    await promise

    expect(store.items.map(item => item.status)).toEqual([
      UPLOAD_STATUS.failed,
      UPLOAD_STATUS.uploaded,
    ])

    vi.useRealTimers()
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
