import React from 'react'
import { NavLink } from 'react-router-dom'

import Link from './link'
import Autocomplete from './autocomplete'

import {
  useAuth,
  ADMIN,
  USER,
} from '../utils'

import { ReactComponent as HomeIcon } from '../images/icons/home.svg'
import { ReactComponent as UserIcon } from '../images/icons/user.svg'
import { ReactComponent as SettingsIcon } from '../images/icons/cog.svg'

import { Manager, Reference, Popper } from 'react-popper'

const RIGHT_DRAWER = 250

const Pill = ({ to, icon, children }) => {
  return (
    <NavLink exact to={`/${to}`} className="p-2 rounded flex items-center hover:text-white hover:bg-gray-700 mb-1" activeClassName="bg-gray-700 text-white">
      {icon}
      <span className="ml-4">{children}</span>
    </NavLink>
  )
}

export default ({ children }) => {
  const [popper, changePopper] = React.useState()
  const { user, changeViewingMode, viewingMode } = useAuth()
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-full text-white bg-gray-900 flex" style={{ width: RIGHT_DRAWER }}>
        <div className="flex flex-col bg-gray-800 text-md text-gray-500" style={{ width: RIGHT_DRAWER }}>
          <div className="p-4 flex-1">
            <Autocomplete
              onLoading={() => <p>Loading...</p>}
              onData={(data, clear) => data?.map(({ name, ticker }, i) => {
                return (
                  <div key={i} className="mb-2">
                    <Link to={`/s/${ticker}`} onClick={clear} className="text-white hover:text-gray-400 font-semibold">{name} <span className="text-xs">{ticker}</span></Link>
                  </div>
                )
              })}
            />

            <div className="my-6" />
            
            <Pill to="" icon={<HomeIcon className="fill-current inline" style={{ width: 20, height: 20 }} />}>
              Dashboard
            </Pill>
            {viewingMode.id === ADMIN && (
              <Pill to="admin" icon={<UserIcon className="fill-current inline" style={{ width: 20, height: 20 }} />}>
                Admin
              </Pill>
            )}
          </div>
          <div className="px-4">
            <button className="hover:bg-gray-700 rounded px-2 py-1" onClick={() => changeViewingMode(viewingMode.id === ADMIN ? USER : ADMIN)}>Viewing Mode: {viewingMode.name}</button>
          </div>
          <div className="p-4 flex items-center">
            <span>{user.user_metadata.full_name}</span>
            <div className="flex-1" />
            <Link to="/settings" className="text-current">
              <Manager>
                <Reference>
                  {({ ref }) => (
                    <SettingsIcon
                      ref={ref}
                      className="fill-current hover:text-white hover:bg-gray-700 rounded p-1 cursor-pointer"
                      style={{ width: 30, height: 30 }}
                      onMouseEnter={() => changePopper('settings')}
                      onMouseLeave={() => changePopper()}
                    />
                  )}
                </Reference>
                {popper === 'settings' &&
                  <Popper placement="top">
                    {({ ref, style, placement }) => (
                      <div ref={ref} style={style} className="bg-black text-white p-1 mb-1 rounded text-xs" data-placement={placement}>
                        Settings
                      </div>
                    )}
                  </Popper>
                }
              </Manager>
            </Link>
          </div>
        </div>
      </div>

      <div className="min-h-screen" style={{ minWidth: RIGHT_DRAWER }}></div>

      

      <main className="h-min-screen bg-gray-200 p-4 mx-auto" style={{ width: `calc(100% - ${RIGHT_DRAWER}px)`}}>
        {children}
      </main>
    </div>
  )
}