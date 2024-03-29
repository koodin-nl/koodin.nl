import { motion, useReducedMotion } from 'framer-motion'

import { GradientCircle } from '#app/components/gradient-circle.tsx'
import { Grid } from '#app/components/grid.tsx'
import { H1, Intro } from '#app/components/ui/typography.tsx'
import { multilineToBreaks } from '#app/utils/misc.tsx'

type Props = {
  hasShapes: boolean
  title: string
  body: string
  children: React.ReactNode
}

export function HeroSection({ children, title, body, hasShapes }: Props) {
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <>
      {hasShapes ? (
        <motion.img
          loading="eager"
          src="/images/rain-drops-background.svg"
          alt="Koodin waterdrops"
          className="absolute left-0 top-0 hidden h-screen w-screen select-none object-fill lg:block"
          initial="initial"
          animate="visible"
          variants={{
            initial: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, ease: 'easeIn' },
            },
          }}
        />
      ) : null}
      {/*Mobile*/}
      <GradientCircle
        className="block lg:hidden"
        height={521}
        width={521}
        top={120}
        left={-400}
      />
      {/*Desktop*/}
      <GradientCircle
        className="hidden lg:block"
        height={1013}
        width={1013}
        top={30}
        left={-400}
        opacity={20}
      />
      {/*Mobile*/}
      <GradientCircle
        className="block lg:hidden"
        height={566}
        width={566}
        right={-486}
        top={140}
      />
      {/*Desktop*/}
      <GradientCircle
        className="hidden lg:block"
        height={1100}
        width={1100}
        right={-600}
        top={10}
        opacity={20}
      />
      <Grid as="header">
        <motion.div
          className="col-span-4 md:col-span-8 lg:col-span-12"
          initial="initial"
          animate="visible"
          variants={{
            initial: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.div variants={childVariants} className="m-auto max-w-4xl">
            <H1 className="break mb-6 text-balance text-center">
              {multilineToBreaks(title)}
            </H1>
          </motion.div>

          <motion.div variants={childVariants}>
            <Intro className="block text-center">{body}</Intro>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 pt-10 lg:flex-row lg:gap-6"
            variants={childVariants}
          >
            {children}
          </motion.div>
        </motion.div>
      </Grid>
    </>
  )
}
