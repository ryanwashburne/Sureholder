import React from 'react'
import moment from 'moment'

import { Card, Link } from './'

import { MOMENT_FORMAT } from '../utils'

export default ({ newsFeed }) => {
  return (
    <Card title="Latest News Feed:">
      {newsFeed.map(({ ticker, news }, i) => {
        const { headline, datetime, summary, url } = news
        return (
          <div key={i} className="mb-6">
            <p>
              <Link className="font-bold text-xs link" to={`/s/${ticker}`}>
                {ticker}
              </Link>
            </p>
            {url ? <Link href={url}>{headline}</Link> : headline}
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
