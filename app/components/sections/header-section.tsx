import * as React from 'react'

import { Link } from '@remix-run/react'

import { motion, useReducedMotion } from 'framer-motion'

import { GradientCircle } from '~/components/gradient-circle'
import { Grid } from '~/components/grid'
import { IconArrowDown } from '~/components/icons'
import { H1, H4, Paragraph } from '~/components/typography'
import { useLabels } from '~/utils/labels-provider'

type Props = {
  title: string
  body: string
}

export function HeaderSection({ title, body }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const { t } = useLabels()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="relative">
      {/*Mobile*/}
      <GradientCircle
        className="block mx-auto lg:hidden"
        opacity={15}
        height={666}
        width={666}
        top={170}
        left={1}
        right={1}
      />
      {/*Desktop*/}
      <GradientCircle
        className="hidden mx-auto border border-red-500 lg:block"
        opacity={15}
        height={920}
        width={920}
        top={-60}
        left={-40}
        right={1}
      />
      <Grid as="header" className="relative z-10">
        <motion.div
          className="col-span-full lg:col-span-10 lg:col-start-2"
          initial="initial"
          animate="visible"
          variants={{
            initial: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.div variants={childVariants}>
            <H1 className="mb-4 lg:mb-10 lg:text-center">{title}</H1>
          </motion.div>
          <motion.div className="lg:px-32" variants={childVariants}>
            <p className="lg:text-center lg:text-2xl">{body}</p>
          </motion.div>
          <motion.div
            className="text-center pt-28 lg:pt-72"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <span className="inline-block">
              <Paragraph
                className="flex flex-col items-center gap-2 text-lg transition lg:flex-row lg:text-2xl"
                as="span"
                textColorClassName="text-gray-400"
              >
                {t('indicator.scroll')}
                <motion.div
                  animate={{
                    y: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <IconArrowDown />
                </motion.div>
              </Paragraph>
            </span>
          </motion.div>
        </motion.div>
      </Grid>
    </div>
  )
}
