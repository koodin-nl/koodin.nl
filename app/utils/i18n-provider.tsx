import * as React from 'react'

import type { TranslatedSlug } from '~/types'
import {
  defaultLocale,
  supportedLocales,
  isSupportedLocale,
  type SupportedLocale,
} from '~/utils/i18n'

type I18nContextState = {
  locale: SupportedLocale
  supportedLocales: SupportedLocale[]
  updateLocale: (locale: SupportedLocale) => void
  translatedSlugs: TranslatedSlug[]
  isDefaultLocale: boolean
}

export const I18nContext = React.createContext<I18nContextState>(
  {} as I18nContextState,
)

export const useI18n = () => React.useContext(I18nContext)

export const I18nProvider = ({
  children,
  locale,
  translatedSlugs = [],
}: {
  children: React.ReactNode
  locale: unknown
  translatedSlugs?: TranslatedSlug[]
}) => {
  console.log({ locale })

  const [currentLocale, setCurrentLocale] = React.useState<SupportedLocale>(
    isSupportedLocale(locale) ? locale : defaultLocale,
  )

  const updateLocale = React.useCallback((locale: SupportedLocale) => {
    setCurrentLocale(locale)
  }, [])

  const value: I18nContextState = {
    updateLocale,
    translatedSlugs,
    supportedLocales: supportedLocales,
    locale: currentLocale,
    isDefaultLocale: currentLocale === defaultLocale,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
