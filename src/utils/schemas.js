import * as Yup from 'yup'

export const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .required('Required')
    .min(6, '6 characters min.')
    .max(12, '12 characters max.'),
})