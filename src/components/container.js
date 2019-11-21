import React from 'react'

export default ({ style, className, ...props }) => {
  return (
    <div style={{ maxWidth: 1000 }} className={`mx-6 md:mx-auto ${className}`} {...props} />
  )
}