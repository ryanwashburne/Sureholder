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
  Card,
} from '../components'

import {
  MOMENT_FORMAT,
  useColorMode,
} from '../utils'

export default () => {
  const { cm } = useColorMode()
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
    <Frame gutter>
      <Helmet>Dashboard</Helmet>
      <div className="flex">
        <div className="w-3/4 pr-2">
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
        </div>
        <div className="w-1/4 pl-2">
          <Card className="mb-8" title="My Investments:">
            {tickers.map((company, i) => {
              return (
                <div key={i} className={`rounded mb-2 p-2 border-gray-400 items-center border flex`}>
                  <div className="flex-1">
                    <Link to={`/s/${company}`} className="link">{company}</Link>
                  </div>
                    <button className={`link--${cm()}`} onClick={async () => {
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
          </Card>
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
        </div>
      </div>
    </Frame>
  )
}