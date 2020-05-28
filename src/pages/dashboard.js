import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import moment from 'moment'

import { useQuery } from '@apollo/react-hooks'
import * as QUERIES from '../graphql/queries'

import {
  Frame,
  Query,
  Link,
  Helmet,
} from '../components'

import {
  MOMENT_FORMAT,
} from '../utils'

export default () => {
  const identity = useIdentityContext()
  const { updateUser, user } = identity

  const [tickers, changeTickers] = React.useState(user?.user_metadata?.follow || [])

  const { data, loading, error } = useQuery(
    QUERIES.NEWS_FEED,
    { variables: { tickers, limit: 5 } }
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
          <div className="bg-white rounded p-4">
            <h3 className="font-bold mb-8">Latest News Feed:</h3>
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
          </div>
        </div>
        <div className="w-1/4 pl-2">
          <div className="p-4 bg-white rounded mb-8">
            <h1 className="text-2xl font-bold mb-2">My Investments:</h1>
            {tickers.map((company, i) => {
              return (
                <div key={i} className="bg-gray-200 rounded mb-2 p-2 border-gray-400 items-center border flex">
                  <div className="flex-1">
                    <Link to={`/s/${company}`} className="link underline">{company}</Link>
                  </div>
                    <button className="link" onClick={async () => {
                      const temp = [...tickers]
                      const index = temp.indexOf(company)
                      if (index > -1) {
                        temp.splice(index, 1)
                        await updateUser({ data: { follow: [...temp] }})
                        changeTickers(temp)
                      }
                    }}>Unfollow</button>
                </div>
              )
            })}
            {tickers.length === 0 && (
              <h3 className="text-lg italic">Go follow some companies</h3>
            )}
          </div>
          <div className="p-4 bg-white rounded">
            <h1 className="text-2xl font-bold mb-2">Upcoming Earnings:</h1>
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
          </div>
        </div>
      </div>
    </Frame>
  )
}