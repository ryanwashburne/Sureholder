import React from 'react'

import { useQuery } from '@apollo/client'
import * as QUERIES from '../graphql/queries'

import {
  Frame,
  Query,
  Link,
  Helmet,
  Card,
  Earnings,
  Newsfeed,
  PressFeed,
} from '../components'

import { useColorMode, useAuth } from '../utils'

const Investments = ({ tickers, onUnfollow }) => {
  const { cm } = useColorMode()
  return (
    <Card className="mb-8" title="My Investments:">
      {tickers.map((company, i) => {
        return (
          <div
            key={i}
            className={`rounded mb-2 p-2 border-gray-400 items-center border flex`}
          >
            <div className="flex-1">
              <Link to={`/s/${company}`} className="link">
                {company}
              </Link>
            </div>
            <button
              className={`link--${cm()}`}
              onClick={() => onUnfollow(company)}
            >
              Unfollow
            </button>
          </div>
        )
      })}
      {tickers.length === 0 && (
        <h3 className="text-lg italic">Go follow some companies</h3>
      )}
    </Card>
  )
}

export default () => {
  const { user, updateUser } = useAuth()
  const [tickers, changeTickers] = React.useState(
    user?.user_metadata?.follow || [],
  )

  const { data, error, loading } = useQuery(QUERIES.NEWS_FEED, {
    variables: { tickers, limit: 6 },
  })
  const {
    data: dataPF,
    error: errorPF,
    loading: loadingPF,
  } = useQuery(QUERIES.PRESS_FEED, {
    variables: { tickers, limit: 6 },
  })
  const {
    data: dataE,
    error: errorE,
    loading: loadingE,
  } = useQuery(QUERIES.EARNINGS_FEED, { variables: { tickers } })
  if (error || errorPF || errorE) return <Query.Error />
  if (loading || loadingPF || loadingE) return <Query.Loading />
  const { newsFeed } = data
  const { pressFeed } = dataPF
  const { earningsFeed } = dataE

  return (
    <Frame>
      <Helmet>Dashboard</Helmet>
      <div className="flex">
        <div className="w-3/4 pr-2">
          {/* <Newsfeed newsFeed={newsFeed} /> */}
          <PressFeed pressFeed={pressFeed} />
        </div>
        <div className="w-1/4 pl-2">
          <Investments
            tickers={tickers}
            onUnfollow={async (company) => {
              const temp = [...tickers]
              const index = temp.indexOf(company)
              if (index > -1) {
                temp.splice(index, 1)
                await updateUser({ data: { follow: [...temp] } })
                changeTickers(temp)
              }
            }}
          />
          <Earnings earningsFeed={earningsFeed} />
        </div>
      </div>
    </Frame>
  )
}
