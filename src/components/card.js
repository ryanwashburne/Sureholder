import React from 'react'
import { useColorMode } from '../utils'

export default ({ title, className, children, ...props}) => {
  const { cm } = useColorMode()
  return (
    <div className={`
      rounded
      shadow-xl
      ${cm('bg-gray-100', 'bg-gray-900')}
      p-4
      ${className}
    `} {...props}>
      {title && <h3 className="font-bold mb-2 text-lg">{title}</h3>}
      {children}
    </div>
  )
}