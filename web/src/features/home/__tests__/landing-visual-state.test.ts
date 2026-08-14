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
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

import { Window } from 'happy-dom'

const landingStyles = readFileSync(
  new URL('../../../styles/index.css', import.meta.url),
  'utf8'
)

test('hides the aperture planes before revealing Hero copy during settlement', () => {
  const domWindow = new Window()

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const opening = domWindow.document.createElement('div')
    opening.className = 'zzapi-opening zzapi-opening--handoff'
    opening.dataset.openingPhase = 'handoff'
    const plane = domWindow.document.createElement('div')
    plane.className = 'zzapi-opening-plane zzapi-opening-plane-a'
    opening.append(plane)

    const hero = domWindow.document.createElement('section')
    hero.className = 'home-hero'
    hero.dataset.openingPhase = 'handoff'
    const copy = domWindow.document.createElement('div')
    copy.className = 'home-hero-copy'
    hero.append(copy)

    domWindow.document.body.append(opening, hero)

    assert.notEqual(domWindow.getComputedStyle(plane).visibility, 'hidden')
    assert.equal(domWindow.getComputedStyle(copy).visibility, 'hidden')

    opening.dataset.openingPhase = 'settle'
    hero.dataset.openingPhase = 'settle'

    assert.equal(domWindow.getComputedStyle(plane).visibility, 'hidden')
    assert.notEqual(domWindow.getComputedStyle(copy).visibility, 'hidden')
  } finally {
    domWindow.close()
  }
})

test('hides redundant routing metadata at mobile viewport widths', () => {
  const domWindow = new Window({ width: 390, height: 844 })

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const metadata = domWindow.document.createElement('div')
    metadata.className = 'zzapi-network-meta'
    domWindow.document.body.append(metadata)

    assert.equal(domWindow.getComputedStyle(metadata).display, 'none')
  } finally {
    domWindow.close()
  }
})
