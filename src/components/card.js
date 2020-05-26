import React from 'react'

export default ({ className, ...props}) => {
  return (
    <div className={`
      rounded
      shadow-xl
      bg-white
      p-4
      ${className}
    `} {...props} />
  )
}