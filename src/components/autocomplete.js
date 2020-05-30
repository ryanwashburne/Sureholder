import React from 'react'
import { withRouter } from 'react-router-dom'

import { useLazyQuery } from '@apollo/react-hooks'
import * as QUERIES from '../graphql/queries'

import Input from './input'

export default withRouter(({ history, onData, onLoading }) => {
  const [search, changeSearch] = React.useState('')
  const [searchResponse, changeResponse] = React.useState(null)

  const [tickerSearch, { data: searchData }] = useLazyQuery(QUERIES.TICKER_SEARCH)

  React.useEffect(() => {
    changeResponse(null)
    if (search.length > 0) {
      const timer = window.setTimeout(async () => {
        await tickerSearch({
          variables: { search }
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
    <>
      <form className="flex mb-4" onSubmit={e => {
        e.preventDefault()
        changeSearch('')
        changeResponse(null)
        history.push(`/s/${search.toUpperCase()}`)
      }}>
        <Input
          name="search"
          placeholder="Search..."
          onChange={e => changeSearch(e.target.value)}
          value={search}
        />
      </form>
      {search.length > 0 && !searchResponse && onLoading()}
      {onData(searchResponse, () => {
        changeSearch('')
        changeResponse(null)
      })}
    </>
  )
})