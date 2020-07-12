import React from 'react'
import moment from 'moment'

import { useQuery, useMutation } from '@apollo/react-hooks'
import * as QUERIES from '../graphql/queries'
import * as MUTATIONS from '../graphql/mutations'

import { Frame, Query, Link, Helmet, Card } from '../components'

import { toMoney, MOMENT_FORMAT, useAuth, ADMIN, useColorMode } from '../utils'

const Stock = ({ ticker }) => {
  const { cm } = useColorMode()
  const { updateUser, user, viewingMode, isLoggedIn } = useAuth()
  const following = user?.user_metadata?.follow || []

  const [followingStock, changeFollowStock] = React.useState(
    following.indexOf(ticker) > -1,
  )
  const [disabled, changeDisabled] = React.useState(false)

  const [delUpdate, { data: dataD, error: errorD }] = useMutation(
    MUTATIONS.DELETE_UPDATE,
  )
  if (dataD || errorD) {
    console.log(dataD, errorD)
  }

  async function handleFollow() {
    changeDisabled(true)
    try {
      const temp = [...following]
      const index = temp.indexOf(ticker)
      if (index === -1) {
        await updateUser({ data: { follow: [...following, ticker] } })
        changeFollowStock(true)
      }
    } catch (e) {
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
        await updateUser({ data: { follow: [...temp] } })
        changeFollowStock(false)
      }
    } catch (e) {
      console.error(e)
    }
    changeDisabled(false)
  }

  const { data, loading, error } = useQuery(QUERIES.COMPANY_BY_TICKER, {
    variables: { ticker, limit: 3 },
  })
  if (error) return <Query.Error />
  if (loading) return <Query.Loading />
  const { companyByTicker } = data
  const { market, news, profile, filings, updates } = companyByTicker
  const { companyName, description, website } = profile
  return (
    <Frame>
      <div className="flex">
        <Helmet>{ticker}</Helmet>
        <div className="w-3/4">
          <Card>
            {updates.length > 0 && (
              <h3 className="font-semibold mb-2">Sureholder Updates:</h3>
            )}
            <div className="flex overflow-x-scroll mb-8">
              {updates.map(({ title, content, date, id }, i) => {
                return (
                  <Card
                    key={i}
                    className="border mr-8"
                    style={{ minWidth: 200 }}
                    title={title}
                  >
                    <p>{content}</p>
                    <p className="text-xs">
                      {moment(date).format(MOMENT_FORMAT)}
                    </p>
                    {viewingMode.id === ADMIN && (
                      <button
                        onClick={() => {
                          delUpdate({ variables: { id } })
                          window.location.reload()
                        }}
                        className={`mt-2 btn--${cm()}`}
                      >
                        Delete
                      </button>
                    )}
                  </Card>
                )
              })}
            </div>
            <h1 className="text-4xl">{ticker}</h1>
            <p>{companyName}</p>
            <p className="italic text-xs my-4">{description}</p>
            {website && <Link href={website}>Website</Link>}
            <div className="flex mb-8">
              <div className="w-1/2">
                {isLoggedIn ? (
                  <div className="my-4">
                    {followingStock ? (
                      <button
                        className={`btn--${cm()}--outlined`}
                        onClick={handleUnfollow}
                        disabled={disabled}
                      >
                        Un-follow
                      </button>
                    ) : (
                      <button
                        className={`btn--${cm()}`}
                        onClick={handleFollow}
                        disabled={disabled}
                      >
                        Follow
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <button className={`btn--${cm()}--outlined`} disabled>
                      Sign In to Follow
                    </button>
                  </div>
                )}
              </div>
              <div>
                <p>Price: ${toMoney(market.price)}</p>
                <p>High: ${toMoney(market.dayHigh)}</p>
                <p>Low: ${toMoney(market.dayLow)}</p>
                <p>Change: {Number(market.change).toFixed(2)}%</p>
              </div>
            </div>
            <section>
              {filings.map(({ title, link, pubDate }, i) => {
                return (
                  <div key={i} className="mb-4">
                    <p>
                      <Link href={link}>{title}</Link>
                    </p>
                    <p>{moment(pubDate).format(MOMENT_FORMAT)}</p>
                  </div>
                )
              })}
            </section>
          </Card>
        </div>

        <div className="w-1/4 ml-2">
          <Card title="Latest News:">
            <ol>
              {news.map(({ headline, datetime, url }, i) => {
                return (
                  <li key={i} className="mb-4 text-xs">
                    <p>
                      <Link href={url}>{headline}</Link>
                    </p>
                    <p className="text-xs">
                      {moment(datetime).format(MOMENT_FORMAT)}
                    </p>
                  </li>
                )
              })}
              {news.length === 0 && <p className="italic">No new updates</p>}
            </ol>
          </Card>
        </div>
      </div>
    </Frame>
  )
}

export default ({ match }) => {
  return <Stock ticker={match.params.ticker.toUpperCase()} />
}
