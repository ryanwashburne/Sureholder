import React from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'

import {
  Input,
} from './'

import { ReactComponent as HomeIcon } from '../images/icons/home.svg'
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

export default withRouter(({ history, ...props }) => {
  const [popper, changePopper] = React.useState()
  const [search, changeSearch] = React.useState('')
  const identity = useIdentityContext()
  const { user } = identity
  const { roles } = user.app_metadata
  const isAdmin = roles && roles.indexOf('admin') > -1
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-full text-white bg-gray-900 flex" style={{ width: RIGHT_DRAWER }}>
        <div className="flex flex-col bg-gray-800 text-md text-gray-500" style={{ width: RIGHT_DRAWER }}>
          <div className="p-4 flex-1">
            <form className="flex" onSubmit={(e) => { const s = search; e.preventDefault(); changeSearch(''); history.push(`/?stock=${s}`); window.location.reload() }}>
              <Input
                name="search"
                placeholder="Search..."
                onChange={(e) => changeSearch(e.target.value)}
                value={search}
              />
              <button className="bg-gray-600 p-2 rounded text-gray-100">Go</button>
            </form>

            <div className="my-8" />
            
            <Pill to="" icon={<HomeIcon className="fill-current inline" style={{ width: 20, height: 20 }} />}>
              Dashboard
            </Pill>
            {isAdmin && <Pill to="admin" icon={<HomeIcon className="fill-current inline" style={{ width: 20, height: 20 }} />}>
              Admin
            </Pill>}
          </div>

          <div className="p-4 flex items-center">
            <span>{user.user_metadata.full_name}</span>
            <div className="flex-1" />
            <Link to="/settings">
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

      

      <main className="h-min-screen bg-gray-200 w-full p-4 mx-auto">
        {props.children}
      </main>
    </div>
  )
})