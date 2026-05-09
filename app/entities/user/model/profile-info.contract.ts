import type { Asserts } from 'yup'
import * as yup from 'yup'

export const profileInfoSchema = yup.object({
  name: yup.string().required('Name is required'),
})

export type ProfileInfoDto = Asserts<typeof profileInfoSchema>
