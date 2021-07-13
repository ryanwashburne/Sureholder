import React from 'react'
import moment from 'moment'

import { Card, Link } from './'

import { MOMENT_FORMAT } from '../utils'

export default ({ pressFeed }) => {
  return (
    <Card title="Latest Press:">
      {pressFeed.map(({ ticker, press }, i) => {
        const { headline, datetime, description, url } = press
        return (
          <div key={i} className="mb-6">
            <p>
              <Link className="font-bold text-xs link" to={`/s/${ticker}`}>
                {ticker}
              </Link>
            </p>
            {url ? <Link href={url}>{headline}</Link> : headline}
            <div>
              <p className="truncate">{description}</p>
            </div>
            <p className="text-xs">{moment(datetime).format(MOMENT_FORMAT)}</p>
          </div>
        )
      })}
      {pressFeed.length === 0 && <p className="italic">No new press.</p>}
    </Card>
  )
}
