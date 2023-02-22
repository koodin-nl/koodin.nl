import type { SbBlokData } from '@storyblok/react'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'

type Blok = SbBlokData & {
  body: SbBlokData[] | undefined
}

export function SbPage({ blok }: { blok: Blok }) {
  return (
    <main
      {...storyblokEditable(blok)}
      className="overflow-x-hidden lg:overflow-x-visible"
    >
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  )
}
