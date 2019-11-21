import React from 'react'

export default ({ label, error, className, ...props }) => {
  return (
    <>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        className={`
          ${className}
          shadow
          appearance-none
          border
          ${error && `border-red-500`}
          rounded
          w-full
          py-2
          px-3
          text-gray-700
          leading-tight
          focus:outline-none
          focus:shadow-outline
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </>
  )
}