import * as yup from 'yup'

export const nameSchema = yup.string().required("Name is required");