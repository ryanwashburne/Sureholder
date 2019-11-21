import React from 'react'
import { useNetlifyIdentity } from 'react-netlify-identity'

const apiKey = process.env.STOCK_API_KEY
 
export default ({ ticker }) => {
  const [loaded, changeLoaded] = React.useState(false)
  const [data, changeData] = React.useState()
  const identity = useNetlifyIdentity()
  React.useEffect(() => {
    async function loadData() {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
      try {
        const raw = await fetch(url)
        const data = await raw.json()
        if (data['Global Quote']) changeData(data)
        changeLoaded(true)
      } catch(e) {
        changeLoaded(true)
      }
    }
    loadData()
  }, [ticker])
  if (!loaded && !data) {
    return <p>Loading...</p>
  }
  if (loaded && !data) {
  return <p>No company found for: <span className="font-bold">{ticker}</span></p>
  }
  const { updateUser, user } = identity
  const following = user.user_metadata.follow || []
  const index = following.indexOf(ticker)
  let already = false
  if (index > -1) {
    already = true
  }
  return (
    <div>
      <h1 className="text-4xl font-bold">{ticker}</h1>
      <p
        className="link my-2"
        onClick={async () => {
          if (already) {
            // unfollow
            const index = following.indexOf(ticker)
            if (index > -1) {
              following.splice(index, 1)
            }
            await updateUser({ data: { follow: [...following] }})
            window.location.reload()
          } else {
            // follow
            await updateUser({ data: { follow: [...following, ticker] }})
            window.location.reload()
          }
        }}
      >
        {already ? 'Unfollow' : 'Follow'}
      </p>
      <p>Open: {data['Global Quote']['02. open']}</p>
      <p>Previous Close: {data['Global Quote']['08. previous close']}</p>
      <p>High: {data['Global Quote']['03. high']}</p>
      <p>Low: {data['Global Quote']['04. low']}</p>
      <p>Price: {data['Global Quote']['05. price']}</p>
      <p>Change: {data['Global Quote']['09. change']}</p>
    </div>
  )
}