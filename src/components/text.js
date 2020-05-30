import React from 'react'

import {
  useColorMode,
} from '../utils'

export default ({ className, hover = ['', ''], ...props }) => {
  const { cm  } = useColorMode()
  return (
    <p className={`${cm('text-black', 'text-white')} ${cm(hover[0], hover[1])} ${className}`} {...props} />
  )
}