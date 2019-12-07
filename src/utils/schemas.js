import * as Yup from 'yup'

export const UpdateSchema = Yup.object().shape({
  title: Yup.string()
    .required('Required'),
  date: Yup.date()
    .required('Required'),
  link: Yup.string()
    .url('Invalid URL'),
})