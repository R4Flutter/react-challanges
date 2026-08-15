import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) {
        return initialValue
      }
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage unavailable: skip persistence
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage