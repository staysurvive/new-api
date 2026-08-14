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
import { cn } from '@/lib/utils'

import { IconCard } from './icon-card'

interface ScrollingIconsProps {
  icons: readonly string[]
  direction?: 'up' | 'down'
  className?: string
}

/**
 * Scrolling icon column with seamless loop animation
 */
export function ScrollingIcons({
  icons,
  direction = 'up',
  className,
}: ScrollingIconsProps) {
  const animationClass =
    direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'
  const occurrences = new Map<string, number>()
  const keyedIcons = icons.map((iconName) => {
    const occurrence = occurrences.get(iconName) ?? 0
    occurrences.set(iconName, occurrence + 1)
    return { iconName, key: `${iconName}-${occurrence}` }
  })

  return (
    <div
      className={cn(
        'scroll-container hidden h-[360px] overflow-hidden lg:block',
        className
      )}
    >
      <div className={cn('flex flex-col gap-5', animationClass)}>
        {/* First set */}
        {keyedIcons.map((item) => (
          <IconCard
            key={`${direction}-1-${item.key}`}
            iconName={item.iconName}
          />
        ))}
        {/* Duplicate set for seamless loop */}
        {keyedIcons.map((item) => (
          <IconCard
            key={`${direction}-2-${item.key}`}
            iconName={item.iconName}
            ariaHidden
          />
        ))}
      </div>
    </div>
  )
}
