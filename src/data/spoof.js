import { companies as json } from './companies'

export const companies = json

export const investments = [...json].splice(0, 5)

const dummy = [
  {
    title: 'Example Title',
    date: '111',
  },
]
export const updates = dummy
export const events = dummy