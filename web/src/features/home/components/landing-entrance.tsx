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
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
  type CSSProperties,
  type TransitionEvent as ReactTransitionEvent,
} from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { focusPrimaryCtaAfterOpening } from '../lib/opening-focus'
import { openingPhaseReached, type OpeningPhase } from '../types'

interface LandingEntranceProps {
  logo: string
  phase: OpeningPhase
  onPhaseChange: (phase: OpeningPhase) => void
  onComplete: () => void
}

interface TransferTarget {
  x: number
  y: number
  scale: number
}

const DEFAULT_TARGET: TransferTarget = { x: 0, y: 0, scale: 1 }
const LOGO_READY_TIMEOUT = 320
const SIGNAL_DURATION = 180
const ASSEMBLY_FALLBACK = 380
const FOCUS_FALLBACK = 250
const APERTURE_FALLBACK = 290
const LOCKUP_REVEAL_FALLBACK = 300
const BRAND_HOLD_DURATION = 200
const HANDOFF_FALLBACK = 440
const SETTLEMENT_DURATION = 420
const SETTLEMENT_EXIT_DELAY = 280
const EXIT_FALLBACK = 180
const OPENING_WATCHDOG = 3400

export function LandingEntrance(props: LandingEntranceProps) {
  const { t } = useTranslation()
  const markRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const callbacksRef = useRef(props)
  const landedRef = useRef({ mark: false, wordmark: false })
  const phaseRef = useRef<OpeningPhase>(props.phase)
  const settlingRef = useRef(false)
  const holdStartedRef = useRef(false)
  const exitStartedRef = useRef(false)
  const exitFinishedRef = useRef(false)
  const settlementReadyRef = useRef(false)
  const completedRef = useRef(false)
  const activeRef = useRef(true)
  const focusAfterCompleteRef = useRef(false)
  const timersRef = useRef(new Set<number>())
  const framesRef = useRef(new Set<number>())
  const [markTarget, setMarkTarget] = useState<TransferTarget>(DEFAULT_TARGET)
  const [wordmarkTarget, setWordmarkTarget] =
    useState<TransferTarget>(DEFAULT_TARGET)
  const [isExiting, setIsExiting] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)
  callbacksRef.current = props
  phaseRef.current = props.phase

  const clearOwnedWork = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current.clear()
    framesRef.current.forEach((frame) => window.cancelAnimationFrame(frame))
    framesRef.current.clear()
  }

  const setOwnedTimeout = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      if (activeRef.current) callback()
    }, delay)
    timersRef.current.add(timer)
    return timer
  }

  const clearOwnedTimeout = (timer: number) => {
    window.clearTimeout(timer)
    timersRef.current.delete(timer)
  }

  const requestOwnedFrame = (callback: FrameRequestCallback) => {
    const frame = window.requestAnimationFrame((timestamp) => {
      framesRef.current.delete(frame)
      if (activeRef.current) callback(timestamp)
    })
    framesRef.current.add(frame)
    return frame
  }

  const emitPhase = (phase: OpeningPhase) => {
    if (completedRef.current || phaseRef.current === phase) return
    phaseRef.current = phase
    callbacksRef.current.onPhaseChange(phase)
  }

  const completeOpening = () => {
    if (completedRef.current) return
    completedRef.current = true
    clearOwnedWork()
    callbacksRef.current.onComplete()
    if (!focusAfterCompleteRef.current) return

    focusPrimaryCtaAfterOpening()
  }

  const completeSettledOpening = () => {
    if (!settlementReadyRef.current || !exitFinishedRef.current) return
    completeOpening()
  }

  const startExit = () => {
    if (exitStartedRef.current || completedRef.current) return
    exitStartedRef.current = true
    setIsExiting(true)
    setOwnedTimeout(() => {
      exitFinishedRef.current = true
      completeSettledOpening()
    }, EXIT_FALLBACK)
  }

  const settleOpening = (fast = false) => {
    if (settlingRef.current) return
    settlingRef.current = true
    emitPhase('settle')
    if (fast) {
      settlementReadyRef.current = true
      startExit()
      return
    }
    setOwnedTimeout(startExit, SETTLEMENT_EXIT_DELAY)
    setOwnedTimeout(() => {
      settlementReadyRef.current = true
      completeSettledOpening()
    }, SETTLEMENT_DURATION)
  }

  const measureTargets = () => {
    const coreAnchor = document.querySelector<HTMLElement>(
      '[data-zzapi-core-anchor]'
    )
    const brandAnchor = document.querySelector<HTMLElement>(
      '[data-zzapi-brand-anchor]'
    )
    const mark = markRef.current
    const wordmark = wordmarkRef.current
    if (!coreAnchor || !brandAnchor || !mark || !wordmark) return false

    const markRect = mark.getBoundingClientRect()
    const coreRect = coreAnchor.getBoundingClientRect()
    const wordmarkRect = wordmark.getBoundingClientRect()
    const brandRect = brandAnchor.getBoundingClientRect()

    setMarkTarget({
      x:
        coreRect.left +
        coreRect.width / 2 -
        (markRect.left + markRect.width / 2),
      y:
        coreRect.top +
        coreRect.height / 2 -
        (markRect.top + markRect.height / 2),
      scale: Math.max(
        0.48,
        Math.min(
          1.1,
          Math.min(coreRect.width, coreRect.height) / markRect.width
        )
      ),
    })
    setWordmarkTarget({
      x:
        brandRect.left +
        brandRect.width / 2 -
        (wordmarkRect.left + wordmarkRect.width / 2),
      y:
        brandRect.top +
        brandRect.height / 2 -
        (wordmarkRect.top + wordmarkRect.height / 2),
      scale: Math.max(
        0.52,
        Math.min(1, brandRect.height / wordmarkRect.height)
      ),
    })
    return true
  }

  const startHandoff = () => {
    if (phaseRef.current !== 'lockup' || settlingRef.current) return
    measureTargets()
    requestOwnedFrame(() => {
      if (phaseRef.current !== 'lockup' || settlingRef.current) return
      emitPhase('handoff')
      setOwnedTimeout(() => settleOpening(), HANDOFF_FALLBACK)
    })
  }

  const startBrandHold = () => {
    if (
      phaseRef.current !== 'lockup' ||
      holdStartedRef.current ||
      settlingRef.current
    ) {
      return
    }
    holdStartedRef.current = true
    setOwnedTimeout(startHandoff, BRAND_HOLD_DURATION)
  }

  const startLockup = () => {
    if (phaseRef.current !== 'expand' || settlingRef.current) return
    emitPhase('lockup')
    setOwnedTimeout(startBrandHold, LOCKUP_REVEAL_FALLBACK)
  }

  const startExpand = () => {
    if (phaseRef.current !== 'ignite' || settlingRef.current) return
    emitPhase('expand')
    requestOwnedFrame(() => startLockup())
  }

  const startIgnite = () => {
    if (phaseRef.current !== 'focus' || settlingRef.current) return
    emitPhase('ignite')
    setOwnedTimeout(startExpand, APERTURE_FALLBACK)
  }

  const startFocus = () => {
    if (phaseRef.current !== 'assemble' || settlingRef.current) return
    emitPhase('focus')
    setOwnedTimeout(startIgnite, FOCUS_FALLBACK)
  }

  const startAssembly = () => {
    if (phaseRef.current !== 'signal' || settlingRef.current) return
    emitPhase('assemble')
    setOwnedTimeout(startFocus, ASSEMBLY_FALLBACK)
  }

  const startNormalOpening = () => {
    if (!activeRef.current || settlingRef.current || completedRef.current) {
      return
    }
    setOwnedTimeout(startAssembly, SIGNAL_DURATION)
    setOwnedTimeout(() => settleOpening(true), OPENING_WATCHDOG)
  }

  const completeFast = () => {
    if (!activeRef.current || settlingRef.current || completedRef.current) {
      return
    }
    setIsSkipping(true)
    settleOpening(true)
  }

  const skipOpening = () => {
    completeFast()
  }

  const skipOpeningFromControl = () => {
    focusAfterCompleteRef.current = true
    skipOpening()
  }

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(measureTargets)
    const resizeObserver = new ResizeObserver(measureTargets)
    resizeObserver.observe(document.documentElement)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    activeRef.current = true
    let effectActive = true
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' && event.key !== 'Escape') return
      event.preventDefault()
      focusAfterCompleteRef.current = event.key === 'Tab'
      skipOpening()
    }
    document.addEventListener('keydown', handleKeyDown, true)

    if (reduceMotion) {
      requestOwnedFrame(completeFast)
    } else {
      const logoImage = new Image()
      logoImage.src = callbacksRef.current.logo
      const readinessTimer = setOwnedTimeout(completeFast, LOGO_READY_TIMEOUT)
      void logoImage.decode().then(
        () => {
          if (!effectActive) return
          clearOwnedTimeout(readinessTimer)
          startNormalOpening()
        },
        () => {
          if (effectActive) completeFast()
        }
      )
    }

    return () => {
      effectActive = false
      activeRef.current = false
      clearOwnedWork()
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  const handleSliceTransitionEnd = (
    event: ReactTransitionEvent<HTMLImageElement>
  ) => {
    if (event.currentTarget !== event.target) return
    if (phaseRef.current === 'assemble' && event.propertyName === 'transform') {
      startFocus()
      return
    }
    if (phaseRef.current === 'focus' && event.propertyName === 'opacity') {
      startIgnite()
    }
  }

  const handleApertureAnimationEnd = (
    event: ReactAnimationEvent<HTMLDivElement>
  ) => {
    if (
      event.currentTarget === event.target &&
      event.animationName === 'zzapi-aperture-ignite'
    ) {
      startExpand()
    }
  }

  const handleWordmarkTransitionEnd = (
    event: ReactTransitionEvent<HTMLDivElement>
  ) => {
    if (
      event.currentTarget === event.target &&
      event.propertyName === 'clip-path'
    ) {
      startBrandHold()
    }
  }

  const handleProxyAnimationEnd = (
    proxy: 'mark' | 'wordmark',
    event: ReactAnimationEvent<HTMLElement>
  ) => {
    if (event.currentTarget !== event.target) return
    if (phaseRef.current !== 'handoff') return
    if (
      event.animationName !== 'zzapi-mark-handoff' &&
      event.animationName !== 'zzapi-wordmark-handoff'
    ) {
      return
    }

    landedRef.current[proxy] = true
    if (landedRef.current.mark && landedRef.current.wordmark) {
      settleOpening()
    }
  }

  const handleExitTransitionEnd = (
    event: ReactTransitionEvent<HTMLDivElement>
  ) => {
    if (
      event.currentTarget !== event.target ||
      event.propertyName !== 'opacity'
    ) {
      return
    }
    if (!exitStartedRef.current || !isExiting) return
    exitFinishedRef.current = true
    completeSettledOpening()
  }

  const markStyle = {
    '--zzapi-transfer-x': `${markTarget.x}px`,
    '--zzapi-transfer-y': `${markTarget.y}px`,
    '--zzapi-transfer-scale': markTarget.scale,
    '--zzapi-opening-mask': `url(${props.logo})`,
  } as CSSProperties
  const wordmarkStyle = {
    '--zzapi-transfer-x': `${wordmarkTarget.x}px`,
    '--zzapi-transfer-y': `${wordmarkTarget.y}px`,
    '--zzapi-transfer-scale': wordmarkTarget.scale,
    '--zzapi-wordmark-mid-x': `${wordmarkTarget.x * 0.35 + 34}px`,
    '--zzapi-wordmark-mid-y': `${wordmarkTarget.y * 0.8 + 42}px`,
  } as CSSProperties

  return (
    <div
      className={cn(
        'zzapi-opening fixed inset-0 z-[100] overflow-hidden',
        openingPhaseReached(props.phase, 'assemble') &&
          'zzapi-opening--assembled',
        openingPhaseReached(props.phase, 'focus') && 'zzapi-opening--focused',
        openingPhaseReached(props.phase, 'ignite') && 'zzapi-opening--ignited',
        openingPhaseReached(props.phase, 'expand') && 'zzapi-opening--expanded',
        openingPhaseReached(props.phase, 'lockup') && 'zzapi-opening--locked',
        openingPhaseReached(props.phase, 'handoff') && 'zzapi-opening--handoff',
        isExiting && 'zzapi-opening--exiting',
        isSkipping && 'zzapi-opening--skipping'
      )}
      data-opening-phase={props.phase}
      onPointerDown={skipOpening}
      onTransitionEnd={handleExitTransitionEnd}
    >
      <button
        type='button'
        className='focus:bg-background sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-10 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg'
        onClick={skipOpeningFromControl}
      >
        {t('Skip to Main')}
      </button>
      <div className='zzapi-opening-plane zzapi-opening-plane-a' />
      <div className='zzapi-opening-plane zzapi-opening-plane-b' />
      <div className='zzapi-opening-light-field' />
      <div className='zzapi-opening-glint' />
      <div className='zzapi-opening-axis zzapi-opening-axis-primary' />
      <div className='zzapi-opening-axis zzapi-opening-axis-secondary' />
      <div className='zzapi-opening-focus-ring' />
      <div
        className='zzapi-opening-aperture-light'
        onAnimationEnd={handleApertureAnimationEnd}
      />

      <div
        ref={markRef}
        className='zzapi-opening-mark-proxy'
        style={markStyle}
        onAnimationEnd={(event) => handleProxyAnimationEnd('mark', event)}
      >
        {['top', 'middle', 'bottom'].map((slice) => (
          <img
            key={slice}
            src={props.logo}
            alt=''
            className={`zzapi-opening-slice zzapi-opening-slice-${slice}`}
            onTransitionEnd={
              slice === 'bottom' ? handleSliceTransitionEnd : undefined
            }
          />
        ))}
        <img src={props.logo} alt='' className='zzapi-opening-logo' />
        <span className='zzapi-opening-sheen' />
      </div>

      <div
        ref={wordmarkRef}
        className='zzapi-opening-wordmark-proxy'
        style={wordmarkStyle}
        onTransitionEnd={handleWordmarkTransitionEnd}
        onAnimationEnd={(event) => handleProxyAnimationEnd('wordmark', event)}
      >
        zzapi
      </div>
    </div>
  )
}
