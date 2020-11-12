import React from 'react'
import moment from 'moment'

import { Card, Link } from './'

import { MOMENT_FORMAT } from '../utils'

export default ({ earningsFeed }) => {
  return (
    <Card title="Upcoming Earnings:">
      {earningsFeed.map(({ ticker, earnings }, i) => {
        const {
          currentQuarterEstimate,
          currentQuarterEstimateDate,
          currentQuarterEstimateYear,
          earningsDate,
        } = earnings.earningsChart
        const startDate = moment.unix(earningsDate[0]).format(MOMENT_FORMAT)
        const endDate = earningsDate[1]
          ? moment.unix(earningsDate[1]).format(MOMENT_FORMAT)
          : null
        return (
          <div key={i} className="mb-6 text-xs">
            <p>
              <Link className="font-bold link" to={`/s/${ticker}`}>
                {ticker}
              </Link>
            </p>
            <p>
              {currentQuarterEstimateDate}
              {currentQuarterEstimateYear} / Estimate Rev:{' '}
              {currentQuarterEstimate}
            </p>
            <p>
              {startDate}
              {endDate &&
                `-${moment.unix(earningsDate[1]).format(MOMENT_FORMAT)}`}
            </p>
          </div>
        )
      })}
      {earningsFeed.length === 0 && (
        <p className="italic">No upcoming earnings.</p>
      )}
    </Card>
  )
}
