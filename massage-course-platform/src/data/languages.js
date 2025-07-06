// Language configuration with flags and bilingual names
export const languageConfig = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸', // You can replace with actual flag components
    flagIcon: 'US'
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    flagIcon: 'RU'
  },
  // Easily add more languages here
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    flagIcon: 'ES'
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    flagIcon: 'FR'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    flagIcon: 'DE'
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    flagIcon: 'IT'
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    flagIcon: 'PT'
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    flagIcon: 'CN'
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    flagIcon: 'JP'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    flagIcon: 'SA'
  }
}

// Get list of currently available languages (those with translations)
export const getAvailableLanguages = () => {
  const availableLanguageCodes = ['en', 'ru'] // Update this when adding new translations
  return availableLanguageCodes.map(code => languageConfig[code]).filter(Boolean)
}

// Get all configured languages (for admin/configuration purposes)
export const getAllLanguages = () => {
  return Object.values(languageConfig)
}
