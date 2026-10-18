import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

  return React.useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(mediaQuery)
      mql.addEventListener("change", onStoreChange)
      return () => mql.removeEventListener("change", onStoreChange)
    },
    () => window.matchMedia(mediaQuery).matches,
    () => false
  )
}
