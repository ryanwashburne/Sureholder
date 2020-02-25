import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import { useQuery } from '@apollo/react-hooks'
import * as QUERIES from '../../graphql/queries'

import CalendarSection from './calendar'
import LogoSection from './logo'
import UpdatesSection from './updates'
import MarketSection from './market'

export default ({ ticker }) => {
  const identity = useIdentityContext()
  const { roles } = identity.user.app_metadata
  const isAdmin = roles && roles.indexOf('admin') > -1

  const variables = React.useMemo(() => ({ ticker }), [ticker])
  const { data, loading, error } = useQuery(
    QUERIES.COMPANY_BY_TICKER,
    { variables }
  )

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !data || !data.companyByTicker) {
    return <p>No company found for: <span className="font-bold">{ticker}</span></p>
  }

  return (
    <div className="flex">
      <div className="w-1/4">
        {/* <LogoSection admin={isAdmin} ticker={ticker} src={data.companyByTicker.logo} /> */}
        {/* <MarketSection market={data.companyByTicker.market} ticker={ticker} /> */}
      </div>
      <div className="w-3/4">
        {/* <UpdatesSection admin={isAdmin} ticker={ticker} /> */}
        {/* <CalendarSection admin={isAdmin} /> */}
      </div>
    </div>
  )
}
