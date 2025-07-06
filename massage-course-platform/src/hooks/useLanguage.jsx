import { createContext, useContext, useState } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}