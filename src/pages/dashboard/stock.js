import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import * as QUERIES from '../../graphql/queries'

import {
  Dashboard,
} from '../../components'

import {
  toMoney,
} from '../../utils/functions'

const Stock = ({ ticker }) => {
  const { data, loading, error } = useQuery(
    QUERIES.COMPANY_BY_TICKER,
    { variables: { ticker, limit: 5 } }
  )
  if (error) return <>Error!</>
  if (loading) return <>Loading...</>
  const { companyByTicker } = data
  return (
    <div className="bg-white p-8 flex">
      <div className="w-3/4">
        <h1 className="text-4xl">{companyByTicker.ticker}</h1>
        {companyByTicker.name && <h4 className="text-xl">{companyByTicker.name}</h4>}
        {companyByTicker.weburl && <a href={companyByTicker.weburl} target="_blank" rel="noopener noreferrer" className="link">Website</a>}
        <div className="mt-8">
          <p>Open: ${toMoney(companyByTicker.open)}</p>
          <p>Price: ${toMoney(companyByTicker.price)}</p>
          <p>High: ${toMoney(companyByTicker.high)}</p>
          <p>Low: ${toMoney(companyByTicker.low)}</p>
          <p>Change: {companyByTicker.change}%</p>
        </div>
      </div>
      <div className="w-1/4">
        <h3 className="text-lg">Latest News:</h3>
        <ol>
          {companyByTicker.news.map(({ title, url }, i) => {
            return (
              <li key={i}>{url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="link">{title}</a>) : title}</li>
            )
          })}
          {companyByTicker.news.length === 0 && (
            <p className="italic">No new updates</p>
          )}
        </ol>
      </div>
    </div>
  )
}

export default ({ location }) => {
  const search = location.search.substring(1).split('=')
  if (search[0] !== 'ticker') {
    return (
      <Dashboard>
        <p>Please provide a ticker.</p>
      </Dashboard>
    )
  }
  return (
    <Dashboard>
      <Stock ticker={search[1].toUpperCase()} />
    </Dashboard>
  )
}