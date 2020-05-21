import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import moment from 'moment'

import { useQuery } from '@apollo/react-hooks'
import * as QUERIES from '../../graphql/queries'

import {
  Dashboard,
  Query,
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
    { variables: { ticker: props.ticker, limit: 3 } }
  )
  if (error) return <Query.Error />
  if (loading) return <Query.Loading />
  const { companyByTicker } = data
  const { ticker, market, news, profile } = companyByTicker
  const { companyName, description, website } = profile
  return (
    <div className="bg-white p-8 flex">
      <div className="w-3/4">
        <h1 className="text-4xl">{ticker}</h1>
        <p>{companyName}</p>
        <p className="italic text-xs my-4">{description}</p>
        {website && <a href={website} target="_blank" rel="noopener noreferrer" className="link">Website</a>}
        <div>
          {followingStock ? (
            <button className="btn--outlined my-4" onClick={handleUnfollow} disabled={disabled}>Un-follow</button>
          ) : (
            <button className="btn my-4" onClick={handleFollow} disabled={disabled}>Follow</button>
          )}
        </div>
        <div className="mt-8">
          <p>Price: ${toMoney(market.price)}</p>
          <p>High: ${toMoney(market.dayHigh)}</p>
          <p>Low: ${toMoney(market.dayLow)}</p>
          <p>Change: {market.change}%</p>
        </div>
      </div>
      <div className="w-1/4 ml-2">
        <h3 className="text-lg">Latest News:</h3>
        <ol>
          {news.map(({ headline, datetime, url }, i) => {
            return (
              <li key={i} className="mb-4 text-xs">
                <p><a href={url} target="_blank" rel="noopener noreferrer" className="link">{headline}</a></p>
                <p className="text-xs">{moment(datetime).format('MMM Do, YYYY')}</p>
              </li>
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

export default ({ match }) => {
  if (!match?.params?.ticker) {
    return (
      <Dashboard>
        <p>Please provide a ticker.</p>
      </Dashboard>
    )
  }
  if (!isNaN(match.params.articleId)) {
    return (
      <Dashboard>
        <p>{match.params.articleId}</p>
      </Dashboard>
    )
  }
  return (
    <Dashboard>
      <Stock ticker={match.params.ticker.toUpperCase()} />
    </Dashboard>
  )
}