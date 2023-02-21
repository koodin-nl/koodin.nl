import type * as React from 'react'

import { Link } from '@remix-run/react'

import { Grid } from '~/components/grid'
import { H3, H4, Subtitle } from '~/components/typography'
import { useVacancies } from '~/utils/providers'

type Props = {
  children: React.ReactNode
  subtitle: string
  title: string
}

export function CareersSection({ children, subtitle, title }: Props) {
  const { vacancies } = useVacancies()

  return (
    <div className="bg-gradient py-20 lg:py-40">
      <Grid>
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          <Subtitle variant="pink" className="mb-4">
            {subtitle}
          </Subtitle>
          <H3 as="h2" inverse className="mb-14 lg:mb-12">
            {title}
          </H3>
          <div className="hidden lg:block">{children}</div>
        </div>
        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          {vacancies.map((vacancy) => (
            <Link
              key={vacancy.id}
              to={`/${vacancy.full_slug}`}
              className="border-light block border-b py-6 first:pt-0 hover:border-white focus:border-white"
            >
              <H4 as="span" inverse>
                {vacancy.name}
              </H4>
            </Link>
          ))}
        </div>
        <div className="block pt-14 lg:hidden">{children}</div>
      </Grid>
    </div>
  )
}
