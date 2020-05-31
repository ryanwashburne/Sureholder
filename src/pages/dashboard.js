import React from 'react'
import moment from 'moment'

import { useQuery } from '@apollo/react-hooks'
import * as QUERIES from '../graphql/queries'

import {
  Frame,
  Query,
  Link,
  Helmet,
  Card,
} from '../components'

import {
  MOMENT_FORMAT,
  useColorMode,
  useAuth,
} from '../utils'

const NewsFeed = ({ newsFeed }) => {
  return (
    <Card title="Latest News Feed:">
      {newsFeed.map(({ ticker, news }, i) => {
        const { headline, datetime, summary, url } = news
        return (
          <div key={i} className="mb-6">
            <p><Link className="font-bold text-xs link" to={`/s/${ticker}`}>{ticker}</Link></p>
            {url ? (<Link href={url}>{headline}</Link>) : headline}
            <div>
              <p className="truncate">{summary}</p>
            </div>
            <p className="text-xs">{moment(datetime).format(MOMENT_FORMAT)}</p>
          </div>
        )
      })}
      {newsFeed.length === 0 && <p className="italic">No new updates.</p>}
    </Card>
  )
}

const Investments = ({ tickers, onUnfollow }) => {
  const { cm } = useColorMode()
  return (
    <Card className="mb-8" title="My Investments:">
      {tickers.map((company, i) => {
        return (
          <div key={i} className={`rounded mb-2 p-2 border-gray-400 items-center border flex`}>
            <div className="flex-1">
              <Link to={`/s/${company}`} className="link">{company}</Link>
            </div>
              <button className={`link--${cm()}`} onClick={() => onUnfollow(company)}>Unfollow</button>
          </div>
        )
      })}
      {tickers.length === 0 && (
        <h3 className="text-lg italic">Go follow some companies</h3>
      )}
    </Card>
  )
}

const Earnings = ({ earningsFeed }) => {
  return (
    <Card title="Upcoming Earnings:">
      {earningsFeed.map(({ ticker, earnings }, i) => {
        const { currentQuarterEstimate, currentQuarterEstimateDate, currentQuarterEstimateYear, earningsDate } = earnings.earningsChart
        return (
          <div key={i} className="mb-6 text-xs">
            <p><Link className="font-bold link" to={`/s/${ticker}`}>{ticker}</Link></p>
            <p>{currentQuarterEstimateDate}{currentQuarterEstimateYear} / Estimate Rev: {currentQuarterEstimate}</p>
            <p>{moment.unix(earningsDate[0]).format(MOMENT_FORMAT)}-{moment.unix(earningsDate[1]).format(MOMENT_FORMAT)}</p>
          </div>
        )
      })}
      {earningsFeed.length === 0 && <p className="italic">No upcoming earnings.</p>}
    </Card>
  )
}

export default () => {
  const { user, updateUser } = useAuth()
  const [tickers, changeTickers] = React.useState(user?.user_metadata?.follow || [])

  const { data, error, loading } = useQuery(
    QUERIES.NEWS_FEED,
    { variables: { tickers, limit: 6 } }
  )
  const { data: dataE, error: errorE, loading: loadingE } = useQuery(
    QUERIES.EARNINGS_FEED,
    { variables: { tickers } }
  )
  if (error || errorE) return <Query.Error />
  if (loading || loadingE) return <Query.Loading />
  const { newsFeed } = data
  const { earningsFeed } = dataE

  return (
    <Frame>
      <Helmet>Dashboard</Helmet>
      <div className="flex">
        <div className="w-3/4 pr-2">
          <NewsFeed newsFeed={newsFeed} />
        </div>
        <div className="w-1/4 pl-2">
          <Investments
            tickers={tickers}
            onUnfollow={async company => {
              const temp = [...tickers]
              const index = temp.indexOf(company)
              if (index > -1) {
                temp.splice(index, 1)
                await updateUser({ data: { follow: [...temp] }})
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