import 'i18next'

import type common from './public/locales/nl/common.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
    }
  }
}
