import React from 'react'
import { Link } from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'

import {
  Dashboard,
} from '../../components'

import { StockTemplate } from '../../templates'

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
  return (
    <Dashboard>
      <div className="flex flex-wrap">
        <div className="w-full bg-white rounded p-4">
          <h1 className="text-2xl font-bold">My Investments:</h1>
          <div className="border-gray-800 my-2" style={{ borderBottomWidth: 1 }} />
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
    </Dashboard>
  )
}