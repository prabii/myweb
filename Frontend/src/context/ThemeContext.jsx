import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isBlackWhite, setIsBlackWhite] = useState(() => {
    const saved = localStorage.getItem('mechheaven_theme')
    return saved === 'blackwhite'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isBlackWhite ? 'blackwhite' : 'dark')
    localStorage.setItem('mechheaven_theme', isBlackWhite ? 'blackwhite' : 'dark')
  }, [isBlackWhite])

  const toggleTheme = () => {
    setIsBlackWhite(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isBlackWhite, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

