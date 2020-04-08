import React from 'react'

export default () => {
  return (
    <div className="h-screen w-full flex justify-center flex-col items-center">
      <h1 className="text-4xl font-bold">ERROR</h1>
      <p>Something went wrong. Most likely had too many requests to the third-party API</p>
      <p>Please wait a few seconds and reload the page to try again</p>
    </div>
  )
}