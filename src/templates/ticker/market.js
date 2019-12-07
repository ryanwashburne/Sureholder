import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'

export default ({ market, ticker }) => {
  const identity = useIdentityContext()
  const { user } = identity
  const following = user.user_metadata.follow || []

  const { updateUser } = identity
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
    <div>
      <h3 className="text-2xl font-bold">{ticker}</h3>
      <p
        className="link my-2"
        onClick={handleClick}
      >
        {already ? 'Unfollow' : 'Follow'}
      </p>
      <p>Open: ${market.open}</p>
      <p>High: ${market.high}</p>
      <p>Low: ${market.low}</p>
      <p>Price: ${market.price}</p>
      <p>Change: ${market.change}</p>
    </div>
  )
}