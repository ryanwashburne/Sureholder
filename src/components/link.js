import React from 'react'

import { Link } from 'react-router-dom'

export default ({ href, to, className, ...props }) => {
  if (to) {
    return <Link to={to} className={`link ${className}`} {...props} />
  }
  return (
    <a href={href} className={`link ${className}`} target="_blank" rel="noopener noreferrer" {...props} />
  )
}