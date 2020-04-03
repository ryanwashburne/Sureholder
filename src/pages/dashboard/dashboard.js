import React from 'react'
import { Link } from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'

import {
  Dashboard,
} from '../../components'

export default () => {
  const identity = useIdentityContext()
  const { updateUser, user } = identity
  const following = user.user_metadata.follow || []

  const [tickers, changeTickers] = React.useState(following)

  return (
    <Dashboard>
      <div className="flex flex-wrap">
        <div className="w-1/2 pr-2">
          <div className="p-4 bg-white rounded ">
            <h1 className="text-2xl font-bold mb-2">My Investments:</h1>
            {tickers.map((company, i) => {
              return (
                <div key={i} className="bg-gray-200 rounded mb-2 p-2 border-gray-400 items-center border flex">
                  <div className="flex-1">
                    <Link to={`/stock?ticker=${company}`} className="link underline">{company}</Link>
                  </div>
                    <button className="link" onClick={async () => {
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