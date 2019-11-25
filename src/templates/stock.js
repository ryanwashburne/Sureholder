import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import { updates, events } from '../data/spoof'

export default ({ ticker }) => {
  const [loaded, changeLoaded] = React.useState(false)
  const [data, changeData] = React.useState()
  const identity = useIdentityContext()
  const { user } = identity
  React.useEffect(() => {
    async function loadData() {
      try {
        const raw = await fetch(`/.netlify/functions/hello?company=${ticker}`, {
          headers: {
            'Authorization': `Bearer ${user.token.access_token}`,
          },
        })
        const data = await raw.json()
        console.log(data)
        changeData(data)
        changeLoaded(true)
      } catch(e) {
        console.error(e)
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
  const { updateUser } = identity
  const following = user.user_metadata.follow || []
  const index = following.indexOf(ticker)
  let already = false
  if (index > -1) {
    already = true
  }

  async function handleClick() {
    if (already) {
      // unfollow
      const index = following.indexOf(ticker)
      if (index > -1) {
        following.splice(index, 1)
      }
      await updateUser({ data: { follow: [...following] }})
    } else {
      // follow
      await updateUser({ data: { follow: [...following, ticker] }})
    }
    window.location.reload()
  }

  return (
    <div className="flex">
      <div className="w-1/4">
        <h1 className="text-4xl font-bold">{data['Name']}</h1>
        <h3 className="text-2xl font-bold">{ticker}</h3>
        <div className="border border-black rounded" style={{ width: 100, height: 100 }} />
        <p
          className="link my-2"
          onClick={handleClick}
        >
          {already ? 'Unfollow' : 'Follow'}
        </p>
        <p>Open: ${parseFloat(data['Open'])}</p>
        <p>High: ${parseFloat(data['High'])}</p>
        <p>Low: ${parseFloat(data['Low'])}</p>
        <p>Price: ${parseFloat(data['LastPrice'])}</p>
        <p>Change: ${parseFloat(data['Change'])}</p>
      </div>
      <div className="w-3/4">
        <UpdatesSection updates={updates} />
        <CalendarSection events={events} />
      </div>
    </div>
  )
}

const UpdatesSection = ({ updates = [] }) => {
  return (
    <div className="py-2">
      <h2 className="text-xl font-bold mb-1">Recent Updates</h2>
      {updates.map(({ title, date }, i) => {
        return (
          <div className="bg-white rounded p-3 mb-4 shadow" key={i}>
            <h3>{title}</h3>
            <p>{date}</p>
          </div>
        )
      })}
      <button className="btn">See More</button>
    </div>
  )
}

const CalendarSection = ({ events = [] }) => {
  return (
    <div className="py-2">
      <h2 className="text-xl font-bold mb-1">Upcoming Calendar Events</h2>
      {events.map(({ title, date }, i) => {
        return (
          <div className="bg-white rounded p-3 mb-4 shadow" key={i}>
            <h3>{title}</h3>
            <p>{date}</p>
          </div>
        )
      })}
      <button className="btn">See Full Calendar</button>
    </div>
  )
}