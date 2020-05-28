import * as Yup from 'yup'

export const ADD_UPDATE_SCHEMA = Yup.object({
  ticker: Yup.string()
    .required('Required'),
  title: Yup.string()
    .required('Required'),
  content: Yup.string()
    .required('Required'),
  date: Yup.string()
    .required('Required'),
  url: Yup.string()
    .url('Invalid URL'),
})