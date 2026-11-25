import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `Nameer | ${title}`
  }, [title])
}
