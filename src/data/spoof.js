import { companies as json } from './companies'

export const companies = json

export const investments = [...json].splice(0, 5)