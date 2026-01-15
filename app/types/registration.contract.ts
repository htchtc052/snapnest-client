import * as yup from 'yup'

export const registrationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    password_confirmation: yup
        .string()
        .required('Please confirm password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
})

export type RegistrationDto = yup.Asserts<typeof registrationSchema>
