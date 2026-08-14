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
import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  clearStoredHomePageContent,
  readStoredHomePageContent,
  writeHomePageContentToStorage,
} from '../hooks/use-home-page-content'

test('home page storage failures fall back without throwing', () => {
  const blockedStorage = {
    getItem() {
      throw new DOMException('Storage is blocked', 'SecurityError')
    },
    setItem() {
      throw new DOMException('Storage is blocked', 'SecurityError')
    },
    removeItem() {
      throw new DOMException('Storage is blocked', 'SecurityError')
    },
  } as unknown as Storage

  assert.equal(readStoredHomePageContent(blockedStorage), '')
  assert.doesNotThrow(() =>
    writeHomePageContentToStorage('<main>cached</main>', blockedStorage)
  )
  assert.doesNotThrow(() => clearStoredHomePageContent(blockedStorage))
})

test('home page storage trims blank cached content', () => {
  const values = new Map<string, string>([['home_page_content', '  /docs  ']])
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  } as unknown as Storage

  assert.equal(readStoredHomePageContent(storage), '/docs')
})
