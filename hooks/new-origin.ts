import { useEffect, useState } from "react"

export const useOrigin = (): string | undefined => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return undefined 
  }

  return typeof window !== "undefined" ? window.location.origin : ""
}
