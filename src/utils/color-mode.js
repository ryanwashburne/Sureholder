import React from 'react'

const LIGHT = 0
const DARK = 1

const getName = mode => {
  switch (mode) {
    case DARK:
      return 'DARK'
    default:
      return 'LIGHT'
  }
}

const ColorModeContext = React.createContext()
export const useColorMode = () => React.useContext(ColorModeContext)
export const ColorModeProvider = ({ children }) => {
  const [colorMode, changeMode] = React.useState({
    id: LIGHT,
    name: getName(LIGHT)
  })
  return (
    <ColorModeContext.Provider value={{
      colorMode,
      toggleColorMode: () => changeMode(colorMode.id === LIGHT ? { id: DARK, name: getName(DARK) } : { id: LIGHT, name: getName(LIGHT) }),
      cm: (inputA, inputB) => colorMode.id === LIGHT ? inputA || 'light' : inputB || 'dark',
    }}>
      {children}
    </ColorModeContext.Provider>
  )
}