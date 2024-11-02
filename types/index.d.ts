import { ReactNode } from 'react'

declare global {
  namespace React {
    interface ReactElement {
      type: any
      props: any
      key: any | null
    }
  }
}

export {} 