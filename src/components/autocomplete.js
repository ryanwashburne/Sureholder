import React from 'react'
import { withRouter } from 'react-router-dom'

import { useLazyQuery } from '@apollo/client'
import * as QUERIES from '../graphql/queries'

import { useColorMode } from '../utils'
import Input from './input'

export default withRouter(({ history, onData, onLoading }) => {
  const [search, changeSearch] = React.useState('')
  const [searchResponse, changeResponse] = React.useState(null)
  const { cm } = useColorMode()

  const [tickerSearch, { data: searchData }] = useLazyQuery(
    QUERIES.TICKER_SEARCH,
  )

  React.useEffect(() => {
    changeResponse(null)
    if (search.length > 0) {
      const timer = window.setTimeout(async () => {
        await tickerSearch({
          variables: { search },
        })
        onLoading(false)
      }, 800)
      onLoading(true)
      return () => {
        window.clearInterval(timer)
      }
    }
  }, [search, onLoading, tickerSearch])

  React.useEffect(() => {
    if (searchData) {
      changeResponse(searchData?.tickerSearch)
    }
  }, [searchData])

  return (
    <div>
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          changeSearch('')
          changeResponse(null)
          history.push(`/s/${search.toUpperCase()}`)
        }}
      >
        <Input
          name="search"
          placeholder="Search..."
          onChange={(e) => changeSearch(e.target.value)}
          value={search}
        />
      </form>
      <div className="relative">
        <div
          className={`absolute p-2 w-56 ${cm('bg-gray-100', 'bg-gray-900')}`}
          style={{ top: 2 }}
        >
          {search.length > 0 && !searchResponse && onLoading()}
          {onData(searchResponse, () => {
            changeSearch('')
            changeResponse(null)
          })}
        </div>
      </div>
    </div>
  )
})
