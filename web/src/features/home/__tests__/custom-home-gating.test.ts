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
import { describe, test } from 'node:test'

import { OPENING_PHASES, shouldRenderCustomHome } from '../types'

describe('custom home gating', () => {
  const cachedContent = [
    'https://example.com/custom-home',
    '<main>Custom home</main>',
    '# Custom home',
  ]

  for (const content of cachedContent) {
    test(`renders cached custom content immediately: ${content}`, () => {
      assert.equal(shouldRenderCustomHome(content, true, 'signal'), true)
    })
  }

  test('keeps delayed content behind the opening until the handoff completes', () => {
    for (const phase of OPENING_PHASES) {
      const expected = phase === 'ambient'
      assert.equal(
        shouldRenderCustomHome('# Delayed home', false, phase),
        expected
      )
    }
  })

  for (const phase of OPENING_PHASES) {
    test(`keeps the default homepage for empty content in ${phase}`, () => {
      assert.equal(shouldRenderCustomHome('', false, phase), false)
      assert.equal(shouldRenderCustomHome('', true, phase), false)
    })
  }
})
