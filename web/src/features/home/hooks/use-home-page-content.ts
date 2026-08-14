/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import i18next from 'i18next'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { isHttpUrl } from '@/lib/content-format'

import { getHomePageContent } from '../api'
import type { HomePageContentResult } from '../types'

const STORAGE_KEY = 'home_page_content'

function getHomePageStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function readStoredHomePageContent(
  storage = getHomePageStorage()
): string {
  if (!storage) return ''

  try {
    return storage.getItem(STORAGE_KEY)?.trim() || ''
  } catch {
    return ''
  }
}

export function writeHomePageContentToStorage(
  content: string,
  storage = getHomePageStorage()
) {
  try {
    storage?.setItem(STORAGE_KEY, content)
  } catch {
    // Storage can be unavailable in private browsing or locked-down contexts.
  }
}

export function clearStoredHomePageContent(storage = getHomePageStorage()) {
  try {
    storage?.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be unavailable in private browsing or locked-down contexts.
  }
}

/**
 * Hook to load and manage custom home page content
 * Supports both Markdown/HTML content and iframe URLs
 */
export function useHomePageContent(): HomePageContentResult {
  const [content, setContent] = useState<string>(() =>
    readStoredHomePageContent()
  )
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadContent = async () => {
      // Load from localStorage first for immediate display
      try {
        const response = await getHomePageContent()
        const { success, data } = response

        if (!mounted) return

        const nextContent = typeof data === 'string' ? data.trim() : ''

        if (success && nextContent) {
          setContent(nextContent)
          writeHomePageContentToStorage(nextContent)
        } else {
          // Clear content if API returns empty
          setContent('')
          clearStoredHomePageContent()
        }
      } catch (error) {
        if (!mounted) return
        // eslint-disable-next-line no-console
        console.error('Failed to load home page content:', error)
        toast.error(i18next.t('Failed to load home page content'))
      } finally {
        if (mounted) {
          setIsLoaded(true)
        }
      }
    }

    loadContent()

    return () => {
      mounted = false
    }
  }, [])

  const isUrl = isHttpUrl(content.trim())

  return { content, isLoaded, isUrl }
}
