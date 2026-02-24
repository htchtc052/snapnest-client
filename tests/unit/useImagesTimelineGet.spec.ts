import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useImagesGet } from '~/composables/account/useImagesGet'
import type { Image } from '~/types/image.model'

function makeImage(id: number, capturedAt: string): Image {
  return {
    id,
    name: `image-${id}`,
    size: 123456,
    width: 1200,
    height: 800,
    capturedAt,
    createdAt: capturedAt,
    ownerId: 1,
    ownerName: 'user',
  }
}

function makeStore() {
  const Host = defineComponent({
    setup() {
      const store = useImagesGet()
      return { store }
    },
    template: '<div />',
  })

  const wrapper = mount(Host)
  return wrapper.vm.store
}

describe('useImagesTimelineGet', () => {
  it('updates list when removing or updating images', () => {
    const { images, removeImages, updateImage } = makeStore()

    images.value = [
      makeImage(1, '2025-01-02 10:00:00'),
      makeImage(2, '2025-01-03 10:00:00'),
    ]

    removeImages([1])
    expect(images.value.map(item => item.id)).toEqual([2])

    updateImage({ ...images.value[0], name: 'renamed' })
    expect(images.value[0].name).toBe('renamed')
  })

  it('ignores missing ids in remove operation', () => {
    const { images, removeImages } = makeStore()

    images.value = [
      makeImage(1, '2025-01-02 10:00:00'),
      makeImage(2, '2025-01-03 10:00:00'),
    ]

    removeImages([999])
    expect(images.value.map(item => item.id)).toEqual([1, 2])
  })
})
