import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import { useQuery } from '@apollo/react-hooks'
import * as QUERIES from '../../graphql/queries'

import {
  Dashboard,
} from '../../components'

import {
  toMoney,
} from '../../utils/functions'

const Stock = (props) => {
  const identity = useIdentityContext()
  const { updateUser, user } = identity
  const following = user.user_metadata.follow || []

  const [followingStock, changeFollowStock] = React.useState(following.indexOf(props.ticker) > -1)
  const [disabled, changeDisabled] = React.useState(false)

  async function handleFollow() {
    changeDisabled(true)
    try {
      const temp = [...following]
      const index = temp.indexOf(props.ticker)
      if (index === -1) {
        await updateUser({ data: { follow: [...following, props.ticker] }})
        changeFollowStock(true)
      }
    } catch(e) {
      console.error(e)
    }
    changeDisabled(false)
  }

  async function handleUnfollow() {
    changeDisabled(true)
    try {
      const temp = [...following]
      const index = temp.indexOf(props.ticker)
      if (index > -1) {
        temp.splice(index, 1)
        await updateUser({ data: { follow: [...temp] }})
        changeFollowStock(false)
      }
    } catch(e) {
      console.error(e)
    }
    changeDisabled(false)
  }

  const { data, loading, error } = useQuery(
    QUERIES.COMPANY_BY_TICKER,
    { variables: { ticker: props.ticker, limit: 5 } }
  )
  if (error) return <>Error!</>
  if (loading) return <>Loading...</>
  const { companyByTicker } = data
  const { ticker, market, news } = companyByTicker

  return (
    <div className="bg-white p-8 flex">
      <div className="w-3/4">
        <h1 className="text-4xl">{ticker}</h1>
        <div>
          {followingStock ? (
            <button className="btn--outlined my-4" onClick={handleUnfollow} disabled={disabled}>Un-follow</button>
          ) : (
            <button className="btn my-4" onClick={handleFollow} disabled={disabled}>Follow</button>
          )}
        </div>
        <div className="mt-8">
          <p>Open: ${toMoney(market.open)}</p>
          <p>Price: ${toMoney(market.price)}</p>
          <p>High: ${toMoney(market.high)}</p>
          <p>Low: ${toMoney(market.low)}</p>
          <p>Change: {market.change}%</p>
        </div>
      </div>
      <div className="w-1/4">
        <h3 className="text-lg">Latest News:</h3>
        <ol>
          {news.map(({ title, url }, i) => {
            return (
              <li key={i}>{url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="link">{title}</a>) : title}</li>
            )
          })}
          {news.length === 0 && (
            <p className="italic">No new updates</p>
          )}
        </ol>
      </div>
    </div>
  )
}

export default ({ location }) => {
  const search = location.search.substring(1).split('=')
  if (search[0] !== 'ticker') {
    return (
      <Dashboard>
        <p>Please provide a ticker.</p>
      </Dashboard>
    )
  }
  return (
    <Dashboard>
      <Stock ticker={search[1].toUpperCase()} />
    </Dashboard>
  )
}