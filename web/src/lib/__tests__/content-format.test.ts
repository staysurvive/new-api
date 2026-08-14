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

import { isHttpUrl, isSafeInternalUrl } from '../content-format'

test('accepts only HTTP(S) URLs as external destinations', () => {
  assert.equal(isHttpUrl('https://docs.example.com/guide'), true)
  assert.equal(isHttpUrl('http://localhost:3000/docs'), true)
  assert.equal(isHttpUrl('javascript:alert(1)'), false)
  assert.equal(isHttpUrl('//docs.example.com/guide'), false)
})

test('accepts router-relative paths without accepting protocol-relative paths', () => {
  assert.equal(isSafeInternalUrl('/docs'), true)
  assert.equal(isSafeInternalUrl('/docs?section=api'), true)
  assert.equal(isSafeInternalUrl('//docs.example.com'), false)
  assert.equal(isSafeInternalUrl('/\\evil.com'), false)
  assert.equal(isSafeInternalUrl('javascript:alert(1)'), false)
})
