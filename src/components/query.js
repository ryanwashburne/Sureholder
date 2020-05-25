import React from 'react'

import Link from './link'

const Error = () => {
  return (
    <div className="h-screen w-full flex justify-center flex-col items-center">
      <h1 className="text-4xl font-bold">ERROR</h1>
      <p>Something went wrong. Please wait a few seconds and reload the page to try again</p>
      <p>If the issue is not resolved, please contact: <Link href="mailto:sureholder@gmail.com">sureholder@gmail.com</Link></p>
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
      window.clearInterval(timer)
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