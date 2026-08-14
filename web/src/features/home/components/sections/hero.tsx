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
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { isHttpUrl, isSafeInternalUrl } from '@/lib/content-format'
import { cn } from '@/lib/utils'

import type { OpeningPhase } from '../../types'
import { InfrastructureMap } from '../infrastructure-map'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
  logo?: string
  openingPhase: OpeningPhase
}

const DEFAULT_DOCS_URL = 'https://docs.newapi.pro'

function getSafeDocsUrl(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_DOCS_URL

  const candidate = value.trim()
  if (!candidate) return DEFAULT_DOCS_URL
  if (isHttpUrl(candidate)) return candidate

  // Only allow router-relative destinations. Protocol-relative and scheme-based
  // values must not be passed to an internal Link target.
  if (isSafeInternalUrl(candidate)) return candidate

  return DEFAULT_DOCS_URL
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const landingLogo = props.logo || '/landing-brand-core.png'
  const docsUrl = getSafeDocsUrl(status?.docs_link)

  const docsButton = (
    <Button
      variant='outline'
      className='zzapi-secondary-cta group h-12 rounded-lg px-5 text-sm font-medium'
      render={
        isHttpUrl(docsUrl) ? (
          <a href={docsUrl} target='_blank' rel='noopener noreferrer' />
        ) : (
          <Link to={docsUrl} />
        )
      }
    >
      <BookOpen aria-hidden />
      <span>{t('Docs')}</span>
    </Button>
  )

  return (
    <section
      className={cn('home-hero relative z-10 overflow-hidden', props.className)}
      data-opening-phase={props.openingPhase}
    >
      <div aria-hidden className='home-hero-field absolute inset-0 -z-10' />
      <div aria-hidden className='home-hero-geometry absolute inset-0 -z-10' />

      <div className='home-hero-stage relative mx-auto max-w-7xl'>
        <div className='home-hero-map absolute inset-0'>
          <InfrastructureMap
            logo={landingLogo}
            openingPhase={props.openingPhase}
          />
        </div>

        <div className='home-hero-copy relative z-30 flex min-w-0 flex-col items-start'>
          <h1 className='home-hero-title'>
            <span>{t('One API for')}</span>
            <span className='zzapi-gradient-text'>{t('Every Model')}</span>
          </h1>

          <p className='home-hero-description'>
            {t(
              'Unified access, intelligent routing, and usage control for production AI.'
            )}
          </p>

          <div className='home-hero-actions'>
            <Button
              className='zzapi-primary-cta group h-12 rounded-lg px-5 text-sm font-medium'
              render={
                <Link to={props.isAuthenticated ? '/dashboard' : '/sign-up'} />
              }
            >
              {props.isAuthenticated ? t('Go to Dashboard') : t('Get Started')}
              <ArrowRight aria-hidden />
            </Button>
            {docsButton}
          </div>
        </div>
      </div>
    </section>
  )
}
