
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isTouch, setIsTouch] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check screen size
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const handleResize = () => {
      setIsMobile(mql.matches)
    }
    
    // Check if touch device
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    // Initial check
    handleResize()
    
    // Add listener
    mql.addEventListener("change", handleResize)
    
    return () => mql.removeEventListener("change", handleResize)
  }, [])

  return {
    isMobile,
    isTouch,
    isTablet: !isMobile && isTouch,
    isDesktop: !isMobile && !isTouch,
    hasTouchCapability: isTouch
  }
}
