import * as yup from 'yup'

export const passwordConfirmationSchema = yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required");