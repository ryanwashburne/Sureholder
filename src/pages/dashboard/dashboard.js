import React from 'react'
import { Link } from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'

import {
  Dashboard,
} from '../../components'

import { StockTemplate } from '../../templates'

import { useQuery } from '@apollo/react-hooks'
import * as QUERIES from '../../graphql/queries'

export default ({ location }) => {
  if (location.search) {
    try {
      const ticker = location.search.split('=')[1]
      return (
        <Dashboard>
          <StockTemplate ticker={ticker.toUpperCase()} />
        </Dashboard>
      )
    } catch(_) {}
  }
  const identity = useIdentityContext()
  const { updateUser, user } = identity
  const following = user.user_metadata.follow || []

  // const { data, loading, error } = useQuery(QUERIES.COMPANY_BY_TICKER, {

  // })
  // console.log(data, loading, error)
  // if (error) return <>Error!</>
  // if (loading) return <>Loading...</>
  const ticker = 'AAPL'
  const variables = React.useMemo(() => ({ ticker }), [ticker])
  const { data, loading, error } = useQuery(
    QUERIES.COMPANY_BY_TICKER,
    { variables }
  )
  console.log(data)

  return (
    <Dashboard>
      <div className="flex flex-wrap">
        <div className="w-1/2 pr-2">
          <div className="p-4 bg-white rounded ">
            <h1 className="text-2xl font-bold mb-2">My Investments:</h1>
            {following.map((company, i) => {
              return (
                <div key={i} className="bg-gray-200 rounded mb-2 p-2 border-gray-400 items-center border flex">
                  <div className="flex-1">
                    <Link to={`/?stock=${company}`} className="link underline">{company}</Link>
                  </div>
                  <div>
                    <span className="link" onClick={async () => {
                      const index = following.indexOf(company);
                      if (index > -1) {
                        following.splice(index, 1);
                      }
                      await updateUser({ data: { follow: [...following] }})
                      window.location.reload()
                    }}>Unfollow</span>
                  </div>
                </div>
              )
            })}
            {following.length === 0 && (
              <h3 className="text-lg italic">Go follow some companies</h3>
            )}
          </div>
        </div>
        <div className="w-1/2 pl-2">
          <div className="bg-white rounded p-4">
            <h3 className="font-bold">Feed:</h3>
            {/* {data.allUpdates.map(({ title, date, link, company }, i) => {
              return (
                <div key={i} className="mb-4">
                  {link && <h3 className="link underline"><a href={link} target="_blank">{title}</a></h3>}
                  {!link && <h3>{title}</h3>}
                  <p>{date}</p>
                  <p><a href={`/?stock=${company.ticker}`} className="link">{company.ticker}</a></p>
                </div>
              )
            })} */}
            <p className="italic">No new updates.</p>
          </div>
        </div>
      </div>
    </Dashboard>
  )
}