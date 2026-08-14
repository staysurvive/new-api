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
import { after, describe, test } from 'node:test'

import { Window } from 'happy-dom'

const domWindow = new Window()
const domGlobals = [
  'window',
  'document',
  'navigator',
  'HTMLElement',
  'HTMLImageElement',
  'Node',
  'Element',
  'Event',
  'AnimationEvent',
  'TransitionEvent',
  'PointerEvent',
  'KeyboardEvent',
  'CustomEvent',
  'MutationObserver',
  'ResizeObserver',
  'getComputedStyle',
] as const

for (const key of domGlobals) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: domWindow[key],
  })
}

const { act, useState } = await import('react')
const { createRoot } = await import('react-dom/client')
const { LandingEntrance } = await import('../components/landing-entrance')
const reactTestGlobals = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean
}
reactTestGlobals.IS_REACT_ACT_ENVIRONMENT = true

type TimerTask = {
  callback: () => void
  dueAt: number
}

class ControlledClock {
  now = 0
  private nextId = 1
  private tasks = new Map<number, TimerTask>()

  setTimeout = (callback: () => void, delay = 0) => {
    const id = this.nextId++
    this.tasks.set(id, { callback, dueAt: this.now + delay })
    return id
  }

  clearTimeout = (id: number) => {
    this.tasks.delete(id)
  }

  requestAnimationFrame = (callback: FrameRequestCallback) =>
    this.setTimeout(() => callback(this.now), 16)

  cancelAnimationFrame = (id: number) => {
    this.clearTimeout(id)
  }

  advance(milliseconds: number) {
    const target = this.now + milliseconds
    while (true) {
      const next = [...this.tasks.entries()]
        .filter(([, task]) => task.dueAt <= target)
        .sort(([, left], [, right]) => left.dueAt - right.dueAt)[0]
      if (!next) break

      const [id, task] = next
      this.tasks.delete(id)
      this.now = task.dueAt
      task.callback()
    }
    this.now = target
  }

  get pendingCount() {
    return this.tasks.size
  }
}

type DecodeMode = 'resolve' | 'reject' | 'pending'

type RenderOptions = {
  decodeMode?: DecodeMode
  reduceMotion?: boolean
}

type RenderedEntrance = {
  clock: ControlledClock
  completeCalls: number[]
  container: HTMLDivElement
  phases: string[]
  resolveDecode?: () => void
  root: ReturnType<typeof createRoot>
}

async function renderEntrance(
  options: RenderOptions = {}
): Promise<RenderedEntrance> {
  const clock = new ControlledClock()
  const phases: string[] = []
  const completeCalls: number[] = []
  const decodeMode = options.decodeMode ?? 'resolve'
  let resolveDecode: (() => void) | undefined

  class PreparedImage {
    complete = true
    naturalWidth = 256
    src = ''

    async decode() {
      if (decodeMode === 'reject') throw new Error('decode')
      if (decodeMode === 'pending') {
        await new Promise<void>((resolve) => {
          resolveDecode = resolve
        })
      }
    }
  }

  Object.defineProperties(domWindow, {
    setTimeout: { configurable: true, value: clock.setTimeout },
    clearTimeout: { configurable: true, value: clock.clearTimeout },
    requestAnimationFrame: {
      configurable: true,
      value: clock.requestAnimationFrame,
    },
    cancelAnimationFrame: {
      configurable: true,
      value: clock.cancelAnimationFrame,
    },
    matchMedia: {
      configurable: true,
      value: () => ({
        matches: options.reduceMotion ?? false,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true,
      }),
    },
  })
  Object.defineProperty(globalThis, 'Image', {
    configurable: true,
    value: PreparedImage,
  })

  function Harness() {
    const [phase, setPhase] =
      useState<React.ComponentProps<typeof LandingEntrance>['phase']>('signal')

    return (
      <LandingEntrance
        logo='/landing-brand-core.png'
        phase={phase}
        onPhaseChange={(nextPhase) => {
          phases.push(nextPhase)
          setPhase(nextPhase)
        }}
        onComplete={() => completeCalls.push(clock.now)}
      />
    )
  }

  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  await act(async () => root.render(<Harness />))
  await act(async () => undefined)

  return { clock, completeCalls, container, phases, resolveDecode, root }
}

async function unmountEntrance(rendered: RenderedEntrance) {
  await act(async () => rendered.root.unmount())
  rendered.container.remove()
}

function dispatchTransition(element: Element, propertyName: string) {
  const event = new TransitionEvent('transitionend', { bubbles: true })
  Object.defineProperty(event, 'propertyName', { value: propertyName })
  element.dispatchEvent(event)
}

function dispatchAnimation(element: Element, animationName: string) {
  const event = new AnimationEvent('animationend', { bubbles: true })
  Object.defineProperty(event, 'animationName', { value: animationName })
  element.dispatchEvent(event)
}

describe('LandingEntrance lifecycle', () => {
  after(() => {
    domWindow.close()
  })

  test('advances visible milestones causally, holds the lockup, and owns settlement', async () => {
    const rendered = await renderEntrance()
    const opening = rendered.container.querySelector('.zzapi-opening')
    const bottomSlice = rendered.container.querySelector(
      '.zzapi-opening-slice-bottom'
    )
    const aperture = rendered.container.querySelector(
      '.zzapi-opening-aperture-light'
    )
    const mark = rendered.container.querySelector('.zzapi-opening-mark-proxy')
    const wordmark = rendered.container.querySelector(
      '.zzapi-opening-wordmark-proxy'
    )
    assert.ok(opening)
    assert.ok(bottomSlice)
    assert.ok(aperture)
    assert.ok(mark)
    assert.ok(wordmark)

    await act(async () => rendered.clock.advance(179))
    assert.deepEqual(rendered.phases, [])
    await act(async () => rendered.clock.advance(1))
    assert.deepEqual(rendered.phases, ['assemble'])

    await act(async () => dispatchTransition(bottomSlice, 'transform'))
    assert.deepEqual(rendered.phases, ['assemble', 'focus'])
    await act(async () => dispatchTransition(bottomSlice, 'opacity'))
    assert.deepEqual(rendered.phases, ['assemble', 'focus', 'ignite'])
    await act(async () => dispatchAnimation(aperture, 'zzapi-aperture-ignite'))
    assert.deepEqual(rendered.phases, ['assemble', 'focus', 'ignite', 'expand'])

    await act(async () => rendered.clock.advance(16))
    assert.equal(rendered.phases.at(-1), 'lockup')
    await act(async () => dispatchTransition(wordmark, 'clip-path'))
    const holdStartedAt = rendered.clock.now
    await act(async () => rendered.clock.advance(199))
    assert.equal(rendered.phases.at(-1), 'lockup')
    await act(async () => rendered.clock.advance(17))
    assert.equal(rendered.phases.at(-1), 'handoff')
    assert.ok(rendered.clock.now - holdStartedAt >= 200)

    await act(async () => dispatchAnimation(mark, 'zzapi-mark-handoff'))
    assert.equal(rendered.phases.at(-1), 'handoff')
    await act(async () => dispatchAnimation(wordmark, 'zzapi-wordmark-handoff'))
    assert.equal(rendered.phases.at(-1), 'settle')

    await act(async () => dispatchTransition(opening, 'opacity'))
    assert.deepEqual(rendered.completeCalls, [])
    await act(async () => rendered.clock.advance(279))
    assert.equal(opening.classList.contains('zzapi-opening--exiting'), false)
    await act(async () => rendered.clock.advance(1))
    assert.equal(opening.classList.contains('zzapi-opening--exiting'), true)
    await act(async () => dispatchTransition(opening, 'opacity'))
    assert.deepEqual(rendered.completeCalls, [])
    await act(async () => rendered.clock.advance(139))
    assert.deepEqual(rendered.completeCalls, [])
    await act(async () => rendered.clock.advance(1))
    await act(async () => dispatchTransition(opening, 'opacity'))
    assert.equal(rendered.completeCalls.length, 1)

    await unmountEntrance(rendered)
  })

  for (const decodeMode of ['reject', 'pending'] as const) {
    test(`falls back once to the static homepage when decode is ${decodeMode}`, async () => {
      const rendered = await renderEntrance({ decodeMode })
      await act(async () => rendered.clock.advance(500))

      assert.deepEqual(rendered.phases, ['settle'])
      assert.equal(rendered.completeCalls.length, 1)
      await act(async () => rendered.clock.advance(3000))
      assert.equal(rendered.completeCalls.length, 1)

      await unmountEntrance(rendered)
    })
  }

  test('reduced motion bypasses readiness and normal spatial phases', async () => {
    const rendered = await renderEntrance({
      decodeMode: 'pending',
      reduceMotion: true,
    })
    await act(async () => rendered.clock.advance(200))

    assert.deepEqual(rendered.phases, ['settle'])
    assert.equal(rendered.completeCalls.length, 1)

    await unmountEntrance(rendered)
  })

  test('pointer and Escape skip promptly without requesting CTA focus', async () => {
    for (const input of ['pointer', 'escape'] as const) {
      const rendered = await renderEntrance({ decodeMode: 'pending' })
      const opening = rendered.container.querySelector('.zzapi-opening')
      assert.ok(opening)

      await act(async () => {
        if (input === 'pointer') {
          opening.dispatchEvent(
            new PointerEvent('pointerdown', { bubbles: true })
          )
        } else {
          document.dispatchEvent(
            new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' })
          )
        }
      })
      await act(async () => rendered.clock.advance(200))

      assert.deepEqual(rendered.phases, ['settle'])
      assert.equal(rendered.completeCalls.length, 1)
      await unmountEntrance(rendered)
    }
  })

  test('Tab skips once and transfers focus to the primary CTA', async () => {
    const rendered = await renderEntrance({ decodeMode: 'pending' })
    const cta = document.createElement('button')
    cta.className = 'zzapi-primary-cta'
    document.body.append(cta)

    await act(async () =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' })
      )
    )
    await act(async () => rendered.clock.advance(220))

    assert.deepEqual(rendered.phases, ['settle'])
    assert.equal(rendered.completeCalls.length, 1)
    assert.equal(document.activeElement, cta)

    cta.remove()
    await unmountEntrance(rendered)
  })

  test('unmount cancels all owned readiness and timeline work', async () => {
    const rendered = await renderEntrance({ decodeMode: 'pending' })
    assert.ok(rendered.clock.pendingCount > 0)
    await unmountEntrance(rendered)
    rendered.resolveDecode?.()
    await act(async () => undefined)

    assert.equal(rendered.clock.pendingCount, 0)
    rendered.clock.advance(5000)
    assert.deepEqual(rendered.phases, [])
    assert.deepEqual(rendered.completeCalls, [])
  })
})
