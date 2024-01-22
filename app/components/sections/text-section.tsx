import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'

import { Grid } from '~/components/grid'
import { H3, H5 } from '~/components/typography'
import type { Image } from '~/types'
import { getImgProps } from '~/utils/images'
import { useGroup } from '~/utils/providers'

type TextSectionProps = {
  subtitle: string
  title: string
  body: string
  transparantCards?: boolean
  image?: Image
}

export function TextSection({
  subtitle,
  title,
  body,
  image,
}: TextSectionProps) {
  const { theme } = useGroup()
  const isDark = theme.startsWith('dark')
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const paragraphs = body.split(/\n\s*\n/) // Voor elke paragraaf een <p> tag maken.
  const bodyWithParagraphs = paragraphs.map((paragraph, index) => (
    <motion.p
      key={index}
      variants={childVariants}
      dangerouslySetInnerHTML={{ __html: paragraph }}
    ></motion.p>
  ))

  return (
    <Grid>
      <motion.div
        className="col-span-full lg:col-span-10 lg:col-start-2"
        initial="initial"
        whileInView="visible"
        viewport={{ once: true, margin: '-115px 0px' }}
        variants={{
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delay: 0.1 },
          },
        }}
      >
        <motion.div variants={childVariants}>
          <H5 as="h2" className="mb-4" variant="secondary">
            {subtitle}
          </H5>
        </motion.div>
        <motion.div variants={childVariants}>
          <H3 className="mb-6" inverse={isDark}>
            {title}
          </H3>
        </motion.div>
        <motion.div
          className={clsx('space-y-6 text-2xl', isDark && 'text-gray-100')}
        >
          {bodyWithParagraphs}
        </motion.div>
        {image?.url ? (
          <motion.div className="pt-12 -ml-8vw -mr-8vw lg:m-0">
            <img
              className="w-full lg:rounded-lg"
              {...getImgProps(image.url, image.alt, {
                widths: [431, 862, 1724],
                sizes: [
                  '(max-width: 1023px) 100vw',
                  '(min-width: 1024px) 60vw',
                ],
              })}
            />
          </motion.div>
        ) : null}
      </motion.div>
    </Grid>
  )
}
