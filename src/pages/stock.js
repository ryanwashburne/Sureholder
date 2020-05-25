import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import moment from 'moment'

import { useQuery, useMutation } from '@apollo/react-hooks'
import * as QUERIES from '../graphql/queries'
import * as MUTATIONS from '../graphql/mutations'

import {
  Frame,
  Query,
  Link,
} from '../components'

import {
  toMoney,
  MOMENT_FORMAT,
  isAdmin,
} from '../utils'

const Stock = ({ ticker }) => {
  const identity = useIdentityContext()
  const { updateUser, user } = identity
  const following = user.user_metadata.follow || []

  const [followingStock, changeFollowStock] = React.useState(following.indexOf(ticker) > -1)
  const [disabled, changeDisabled] = React.useState(false)

  const [input, changeInput] = React.useState('')
  const [addUpdate, { data: dataU, error: errorU }]= useMutation(MUTATIONS.ADD_UPDATE)
  if (dataU || errorU) {
    console.log(dataU, errorU)
  }
  const [delUpdate, { data: dataD, error: errorD }]= useMutation(MUTATIONS.DELETE_UPDATE)
  if (dataD || errorD) {
    console.log(dataD, errorD)
  }

  async function handleFollow() {
    changeDisabled(true)
    try {
      const temp = [...following]
      const index = temp.indexOf(ticker)
      if (index === -1) {
        await updateUser({ data: { follow: [...following, ticker] }})
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
      const index = temp.indexOf(ticker)
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
    { variables: { ticker, limit: 3 } }
  )
  if (error) return <Query.Error />
  if (loading) return <Query.Loading />
  const { companyByTicker } = data
  const { market, news, profile, filings, updates } = companyByTicker
  const { companyName, description, website } = profile
  return (
    <div className="bg-white p-8 flex">
      <div className="w-3/4">
        {updates.map(({ title, content, date, id }, i) => {
          return isAdmin(user) ? (
            <div key={i} className="mb-8">
              <p className="font-bold">{title}</p>
              <p>{content}</p>
              <p className="text-xs">{date}</p>
              <button onClick={() => delUpdate({ variables: { id }})} className="btn--primary">Delete</button>
            </div>
          ) : null
        })}
        <h1 className="text-4xl">{ticker}</h1>
        <p>{companyName}</p>
        <p className="italic text-xs my-4">{description}</p>
        {website && <Link href={website}>Website</Link>}
        <div className="flex mb-8">
          <div className="w-1/2">
            {followingStock ? (
              <button className="btn--outlined my-4" onClick={handleUnfollow} disabled={disabled}>Un-follow</button>
            ) : (
              <button className="btn my-4" onClick={handleFollow} disabled={disabled}>Follow</button>
            )}
          </div>
          <div className="w-1/2">
            <p>Price: ${toMoney(market.price)}</p>
            <p>High: ${toMoney(market.dayHigh)}</p>
            <p>Low: ${toMoney(market.dayLow)}</p>
            <p>Change: {market.change}%</p>
          </div>
        </div>
        <section>
          {filings.map(({ title, link, pubDate }, i) => {
            return (
              <div key={i} className="mb-4">
                <p><Link href={link}>{title}</Link></p>
                <p>{moment(pubDate).format(MOMENT_FORMAT)}</p>
              </div>
            )
          })}
        </section>

        <section>
          <form onSubmit={e => { e.preventDefault(); addUpdate({variables: {
            addUpdateInput: {
              content: input,
              date: moment().format('YYYY-MM-DD'),
              title: 'Title Here',
              ticker,
            }
          }})}}>
            <label htmlFor="test-data">Add Update</label>
            <input name="test-data" value={input} onChange={e => changeInput(e.target.value)} />
            <button type="submit">Submit</button>
          </form>
        </section>
      </div>
      <div className="w-1/4 ml-2">
        <h3 className="text-lg">Latest News:</h3>
        <ol>
          {news.map(({ headline, datetime, url }, i) => {
            return (
              <li key={i} className="mb-4 text-xs">
                <p><Link href={url}>{headline}</Link></p>
                <p className="text-xs">{moment(datetime).format(MOMENT_FORMAT)}</p>
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
      <Frame>
        <p>Please provide a ticker.</p>
      </Frame>
    )
  }
  if (!isNaN(match.params.articleId)) {
    return (
      <Frame>
        <p>{match.params.articleId}</p>
      </Frame>
    )
  }
  return (
    <Frame>
      <Stock ticker={match.params.ticker.toUpperCase()} />
    </Frame>
  )
}