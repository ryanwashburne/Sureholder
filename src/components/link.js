import React from 'react'

import { Link } from 'react-router-dom'
import { useColorMode } from '../utils'

export default ({ href, to, className, children, ...props }) => {
  const { cm } = useColorMode()
  if (to) {
    return <Link to={to} className={`link--${cm()} ${className}`} {...props}>{children}</Link>
  }
  return (
    <a href={href} className={`link--${cm()} ${className}`} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  )
}