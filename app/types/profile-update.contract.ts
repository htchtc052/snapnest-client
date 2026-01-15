import * as yup from 'yup'
import type {Asserts} from "yup";

export const profileEditSchema = yup.object({
    name: yup.string().required('Name is required'),
    bio: yup.string().nullable().optional(),
    birthDate: yup.string().nullable().optional(),
})

export type ProfileUpdateDto = Asserts<typeof profileEditSchema>
