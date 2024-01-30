import clsx from 'clsx'

import { Grid } from '#app/components/grid.tsx'
import { H3, H5 } from '#app/components/typography.tsx'
import { type Image } from '#app/types.ts'
import { getImgProps } from '#app/utils/images.ts'
import { useGroup } from '#app/utils/providers.tsx'

type Props = {
  subtitle?: string
  title: string
  text?: string
  image: Image
  imagePosition: 'left' | 'right'
  titleVariant: 'large' | 'small'
}
export function Banner({ subtitle, text, image, imagePosition }: Props) {
  const { theme } = useGroup()
  return (
    <Grid className="gap-y-10 lg:gap-y-0">
      <div
        className={clsx('col-span-full lg:col-span-5 lg:row-start-1', {
          'lg:col-start-8': imagePosition === 'left',
        })}
      >
        <H5 as="h2" variant="secondary" className="mb-2">
          {subtitle}
        </H5>
        {text ? (
          <H3 as="p" inverse={theme.startsWith('dark')}>
            {text}
          </H3>
        ) : null}
      </div>
      <div
        className={clsx(
          'col-span-full lg:row-start-1 lg:flex lg:flex-col lg:justify-center',
          {
            'lg:col-span-6 lg:col-start-7': imagePosition === 'right',
            'lg:col-span-5 lg:col-start-1': imagePosition === 'left',
          },
        )}
      >
        <img
          className="w-full object-cover"
          {...getImgProps(image.url, image.alt, {
            widths: [375, 508, 1016],
            sizes: [
              '(max-width: 1023px) 84vw',
              '(min-width: 1024px) 35vw',
              '375px',
            ],
          })}
        />
      </div>
    </Grid>
  )
}
