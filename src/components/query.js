import React from 'react'

const Error = () => {
  return (
    <div className="h-screen w-full flex justify-center flex-col items-center">
      <h1 className="text-4xl font-bold">ERROR</h1>
      <p>Something went wrong. Most likely had too many requests to the third-party API</p>
      <p>Please wait a few seconds and reload the page to try again</p>
    </div>
  )
}

const Loading = () => {
  const [dots, changeDots] = React.useState(['...'])

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      changeDots(s => {
        if (s.length > 2) {
          return []
        }
        return [...s, '.']
      })
    }, 800)
    return () => {
      window.clearInterval(timer);
    }
  }, [])

  return (
    <div className="h-screen w-full flex justify-center flex-col items-center">
      <h1 className="text-4xl font-bold">Loading{dots}</h1>
    </div>
  )
}

export default {
  Error,
  Loading,
}