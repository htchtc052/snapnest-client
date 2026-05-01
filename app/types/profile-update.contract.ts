import * as yup from 'yup'
import type { Asserts } from 'yup'

export const profileEditSchema = yup.object({
  name: yup.string().required('Name is required'),
})

export type ProfileUpdateDto = Asserts<typeof profileEditSchema>
