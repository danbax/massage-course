import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

// Available languages configuration
export const languageConfig = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    flagIcon: 'US'
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    flagIcon: 'RU'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    flagIcon: 'DE'
  },
  uk: {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    flagIcon: 'UA'
  }
}

export const getAvailableLanguages = () => {
  const availableLanguageCodes = ['en', 'ru', 'de', 'uk']
  return availableLanguageCodes.map(code => languageConfig[code]).filter(Boolean)
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [translations, setTranslations] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Dynamic import function for language files
  const loadLanguage = async (languageCode) => {
    try {
      setIsLoading(true)
      const module = await import(`../data/languages/${languageCode}.js`)
      return module.default || module.translations
    } catch (error) {
      console.warn(`Failed to load language ${languageCode}:`, error)
      // Fallback to English if the language file doesn't exist
      if (languageCode !== 'en') {
        return await loadLanguage('en')
      }
      return {}
    }
  }

  // Load initial language
  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem('preferred-language') || 'en'
      await changeLanguage(savedLanguage)
    }
    initializeLanguage()
  }, [])

  const t = (key, params = {}) => {
    if (!translations[currentLanguage]) {
      return key
    }

    const keys = key.split('.')
    let value = translations[currentLanguage]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    
    // Handle parameterized translations
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match
      })
    }
    
    return value || key
  }

  const changeLanguage = async (lang) => {
    try {
      setIsLoading(true)
      const languageData = await loadLanguage(lang)
      
      setTranslations(prev => ({
        ...prev,
        [lang]: languageData
      }))
      
      setCurrentLanguage(lang)
      localStorage.setItem('preferred-language', lang)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sync language with server (for authenticated users)
  const syncLanguageWithServer = async (settingsApi) => {
    try {
      await settingsApi.updateSettings({
        language: currentLanguage
      })
    } catch (error) {
      console.error('Failed to sync language with server:', error)
    }
  }

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      t,
      isLoading,
      syncLanguageWithServer,
      availableLanguages: getAvailableLanguages()
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