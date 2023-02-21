import type * as React from 'react'

import { SbBlokData, storyblokEditable } from '@storyblok/react'

import {
  IconBankNotes,
  IconEye,
  IconHeart,
  IconShield,
  IconUsers,
} from '~/components/icons'
import { usePreviewState } from '~/utils/providers'

export function isPreview(request: Request) {
  const { searchParams } = new URL(request.url)
  return !!searchParams.get('_storyblok')
}

export function StoryBlokWrapper({
  children,
  blok,
}: {
  children: React.ReactNode
  blok: SbBlokData
}) {
  const { preview } = usePreviewState()

  if (preview) {
    return (
      <div {...storyblokEditable(blok)} key={blok._uid}>
        {children}
      </div>
    )
  }

  return <>{children}</>
}

// Maps names in Storyblok to our icon components
export const sbIconMap: Record<string, React.ComponentType<any>> = {
  eye: IconEye,
  users: IconUsers,
  heart: IconHeart,
  banknotes: IconBankNotes,
  shield: IconShield,
}
