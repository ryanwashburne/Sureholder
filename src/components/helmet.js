import React from 'react'

import { Helmet } from 'react-helmet'

export default ({ children, ...props }) => {
  return (
    <Helmet title={`${children ? children + ' - ' : ''}Sureholder`} {...props} />
  )
}