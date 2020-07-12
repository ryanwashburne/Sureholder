import React from 'react'

import Link from './link'
import Autocomplete from './autocomplete'
import Icon from './icon'
import Popper from './popper'

import IdentityModal from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'

import { useAuth, ADMIN, USER, useColorMode } from '../utils'

import Logo from '../images/Sureholder.png'

const NAVBAR_HEIGHT = 'h-20'

const Button = ({ className, ...props }) => {
  const { cm } = useColorMode()
  const buttonClassName = cm(
    'hover:text-white hover:bg-gray-800',
    'hover:text-black hover:bg-gray-300',
  )
  return (
    <button
      className={`${buttonClassName} font-bold p-2 rounded flex items-center ${className}`}
      {...props}
    />
  )
}

const Header = ({ onLogin }) => {
  const { changeViewingMode, viewingMode, isLoggedIn, isAdmin } = useAuth()
  const { cm } = useColorMode()
  return (
    <div
      className={`fixed w-full shadow-lg border-b ${cm(
        'bg-gray-100 border-gray-200',
        'bg-gray-900 border-gray-800',
      )} ${NAVBAR_HEIGHT}`}
    >
      <div className="flex h-full text-md items-center px-4">
        <Link to="/">
          <img
            alt="Sureholder Logo"
            src={Logo}
            className={`${cm('bg-gray-100', 'bg-gray-200')} rounded`}
            style={{ maxHeight: 45 }}
          />
        </Link>
        {isAdmin && (
          <Button
            onClick={() =>
              changeViewingMode(viewingMode.id === ADMIN ? USER : ADMIN)
            }
          >
            <span className="mr-1">{viewingMode.name} Mode</span>
            {viewingMode.id === ADMIN ? (
              <Icon name="admin-line" />
            ) : (
              <Icon name="user-line" />
            )}
          </Button>
        )}
        {viewingMode.id === ADMIN && <Link to="/admin">Admin Dashboard</Link>}
        <div className="flex-grow" />

        {isLoggedIn ? (
          <Popper text="Settings" className="mx-6" to="/settings">
            <Icon name="settings-2-line" />
          </Popper>
        ) : (
          <Button className="mx-6" onClick={onLogin}>
            <span className="mr-1">Login</span>
            <Icon name="login-circle-line" />
          </Button>
        )}

        <Autocomplete
          onLoading={() => <p>Loading...</p>}
          onData={(data, clear) =>
            data?.map(({ name, ticker }, i) => {
              return (
                <div key={i} className="font-semibold">
                  <Link to={`/s/${ticker}`} onClick={clear}>
                    {name} <span className="text-xs">{ticker}</span>
                  </Link>
                </div>
              )
            })
          }
        />
      </div>
    </div>
  )
}

const Footer = () => {
  const { toggleColorMode, isDark } = useColorMode()
  return (
    <div className="fixed bottom-0 h-16 flex items-center w-full px-4">
      <div className="flex-grow" />
      <Popper text="Color Mode" onClick={() => toggleColorMode()}>
        {isDark ? (
          <Icon name="contrast-2-line" />
        ) : (
          <Icon name="contrast-2-fill" />
        )}
      </Popper>
    </div>
  )
}

export default ({ children }) => {
  const [modal, changeModal] = React.useState(false)
  return (
    <div className="min-h-screen">
      <Header onLogin={() => changeModal(true)} />

      <div className={`w-full ${NAVBAR_HEIGHT}`} />

      <main className="h-min-screen p-4 w-full">{children}</main>

      <Footer />

      <IdentityModal
        showDialog={modal}
        onCloseDialog={() => changeModal(false)}
        onLogin={() => window.location.reload()}
        onLogout={() => window.location.reload()}
      />
    </div>
  )
}
