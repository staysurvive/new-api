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

import { focusPrimaryCtaAfterOpening } from '../lib/opening-focus'

test('focuses the primary CTA on the frame after the opening completes', () => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const documentDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    'document'
  )
  let scheduledFrame: FrameRequestCallback | undefined
  let focusOptions: FocusOptions | undefined

  try {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        requestAnimationFrame(callback: FrameRequestCallback) {
          scheduledFrame = callback
          return 1
        },
      },
    })
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: {
        querySelector(selector: string) {
          assert.equal(selector, '.zzapi-primary-cta')
          return {
            focus(options: FocusOptions) {
              focusOptions = options
            },
          }
        },
      },
    })

    focusPrimaryCtaAfterOpening()

    assert.equal(focusOptions, undefined)
    assert.ok(scheduledFrame)
    scheduledFrame(0)
    assert.deepEqual(focusOptions, { preventScroll: true })
  } finally {
    if (windowDescriptor) {
      Object.defineProperty(globalThis, 'window', windowDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, 'window')
    }
    if (documentDescriptor) {
      Object.defineProperty(globalThis, 'document', documentDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, 'document')
    }
  }
})
