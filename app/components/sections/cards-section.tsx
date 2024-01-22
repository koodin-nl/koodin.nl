import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'

import { Card, type Props as CardProps } from '../card'
import { Grid } from '../grid'
import { H3, H5, Paragraph } from '../typography'
import { useGroup } from '~/utils/providers'

const columnStyle: Record<number, string> = {
  1: 'lg:col-span-12',
  2: 'lg:col-span-6',
  3: 'lg:col-span-4',
  4: 'md:col-span-6 lg:col-span-3',
}

type Props = {
  cards: (Omit<CardProps, 'variant'> & { id: string; body: React.ReactNode })[]
  sectionTitle: string
  columns: number
  bodyTitle?: string
  body?: string
  transparantCards?: boolean
}
export function CardsSection({
  cards,
  sectionTitle,
  columns,
  bodyTitle,
  body,
  transparantCards,
}: Props) {
  const { theme } = useGroup()
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const onlySectionTitle = sectionTitle && !bodyTitle && !body
  return (
    <motion.div
      initial="initial"
      whileInView="visible"
      viewport={{ once: true, margin: '-115px 0px' }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.3, delay: 0.2 },
        },
      }}
    >
      <Grid className={clsx('z-10')}>
        <motion.div
          className={clsx('col-span-full', onlySectionTitle ? 'mb-6' : 'mb-20')}
          variants={childVariants}
        >
          <H5 as="h2" variant="secondary">
            {sectionTitle}
          </H5>
          {bodyTitle && (
            <H3 as="h2" inverse={theme.startsWith('dark')} className="mt-4">
              {bodyTitle}
            </H3>
          )}
          {body && <Paragraph className="mt-4">{body}</Paragraph>}
        </motion.div>
        <motion.div
          className="grid grid-cols-12 gap-4 card-grid col-span-full filter lg:gap-6"
          variants={childVariants}
        >
          {cards?.map(({ id, icon, title, link, body }) => (
            <Card
              key={id}
              icon={icon}
              link={link}
              title={title}
              transparantCards={transparantCards}
              variant={theme.startsWith('dark') ? 'dark' : 'light'}
              className={clsx('col-span-12', columnStyle[columns])}
            >
              {body}
            </Card>
          ))}
        </motion.div>
      </Grid>
    </motion.div>
  )
}
