import type { Asserts } from 'yup'
import * as yup from 'yup'
import type { Image } from '~/entities/image'

export const imageUpdateSchema = yup.object({
  name: yup.string().required('Image name is required'),
})

export type ImageUpdateDto = Asserts<typeof imageUpdateSchema>

export type ImageUpdateFormResult =
  | { action: 'cancel' }
  | { action: 'confirm'; image: Image }
