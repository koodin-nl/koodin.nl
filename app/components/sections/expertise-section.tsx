import * as React from 'react'

import { Link } from '@remix-run/react'

import clsx from 'clsx'
import { useReducedMotion, motion } from 'framer-motion'

import { Grid } from '~/components/grid'
import { IconArrowRight } from '~/components/icons'
import { H3, H4, Paragraph, Subtitle } from '~/components/typography'
import type { Section } from '~/types'
import { sbIconMap } from '~/utils/storyblok'

type Props = {
  subtitle: string
  title: string
  sections: Section[]
}

export function ExpertiseSection({ subtitle, title, sections }: Props) {
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="bg-gradient py-20 lg:py-40"
      id="formula"
      initial="initial"
      whileInView="visible"
      viewport={{ once: true, margin: '-115px 0px' }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.15, delay: 0.2 },
        },
      }}
    >
      <Grid rowGap>
        <motion.div className="col-span-full" variants={childVariants}>
          <Subtitle className="mb-4" variant="pink">
            {subtitle}
          </Subtitle>
          <H3 as="h2" inverse className="pb-10 lg:pb-16">
            {title}
          </H3>
        </motion.div>
        {sections.map((section) => {
          const Icon = sbIconMap[section.icon ?? '']
          return (
            <motion.div
              key={section.id}
              variants={childVariants}
              className={clsx(
                'bg-transparent-light col-span-full rounded-lg py-8 px-6 lg:py-14 lg:px-12',
                {
                  'lg:col-span-6': sections.length === 4,
                  'lg:col-span-4': sections.length === 3,
                },
              )}
            >
              <div className="mb-4 text-white">
                {Icon ? (
                  <Icon height={32} width={32} />
                ) : (
                  `Unknown icon: ${section.icon}`
                )}
              </div>
              <H4 as="h3" inverse className="mb-4">
                {section.title}
              </H4>
              <Paragraph size="xl" textColorClassName="text-inverse-secondary">
                {section.text}
              </Paragraph>
            </motion.div>
          )
        })}
      </Grid>
    </motion.div>
  )
}
