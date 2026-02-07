import { describe, expect, it } from 'vitest'
import { useImagesGet } from '~/composables/account/useImagesGet'
import type { Image } from '~/types/image.model'

function makeImage(id: number, capturedAt: string): Image {
  return {
    id,
    name: `image-${id}`,
    capturedAt,
    createdAt: capturedAt,
    ownerId: 1,
    ownerName: 'user',
  }
}

describe('useImagesGet grouping', () => {
  it('groups by day/month/year correctly', () => {
    // Same-day images should group together; switching grouping updates keys.
    const { images, imagesGrouped, grouping } = useImagesGet()

    images.value = [
      makeImage(1, '2025-01-02 10:00:00'),
      makeImage(2, '2025-01-02 12:00:00'),
      makeImage(3, '2025-02-03 09:00:00'),
    ]

    grouping.value = 'day'
    expect(imagesGrouped.value.map(group => group.key)).toEqual(['2025-01-02', '2025-02-03'])
    expect(imagesGrouped.value[0].items).toHaveLength(2)

    grouping.value = 'month'
    expect(imagesGrouped.value.map(group => group.key)).toEqual(['2025-01', '2025-02'])

    grouping.value = 'year'
    expect(imagesGrouped.value.map(group => group.key)).toEqual(['2025'])
  })

  it('updates list when removing or updating images', () => {
    // Basic list operations should keep items in sync.
    const { images, removeImages, updateImage } = useImagesGet()

    images.value = [
      makeImage(1, '2025-01-02 10:00:00'),
      makeImage(2, '2025-01-03 10:00:00'),
    ]

    removeImages([1])
    expect(images.value.map(item => item.id)).toEqual([2])

    updateImage({ ...images.value[0], name: 'renamed' })
    expect(images.value[0].name).toBe('renamed')
  })
})
