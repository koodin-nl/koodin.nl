import * as React from 'react'

import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
} from '#app/components/ui/typography.tsx'
import { AnchorOrLink } from '#app/utils/misc.tsx'

import { defaultLanguage } from './i18n'

type Props = {
  children: string
  textAlign?: 'left' | 'right' | 'center'
  textColor?: 'primary' | 'secondary' | 'inverse' | 'inverse-secondary' | 'gray'
  bodyTextSize?: 'sm' | 'md' | 'lg' | 'xl'
  margins?: boolean
  responsive?: boolean
  linksInNewTab?: boolean
}

export function Markdown({ children, ...props }: Props) {
  const components = useComponents(props)
  return <ReactMarkdown children={children} components={components} />
}

type Components = React.ComponentProps<typeof ReactMarkdown>['components']

function useComponents({
  textAlign = 'left',
  textColor = 'primary',
  bodyTextSize = 'md',
  margins = true,
  responsive = true,
  linksInNewTab = false,
}: Omit<Props, 'children'>): Components {
  const { i18n } = useTranslation()

  const alignClassName = `text-${textAlign}`
  const colorClassName =
    textColor === 'gray' ? 'text-gray-300' : `text-${textColor}`

  const headingClassName = clsx(alignClassName, colorClassName, {
    'inline-block pt-6': margins,
    'first:pt-0': margins,
    'mb-6': margins,
  })

  const listClassName = clsx('tracking-tight', colorClassName, {
    'text-sm leading-6': bodyTextSize === 'sm',
    'text-base': bodyTextSize === 'md',
    'text-lg leading-6': bodyTextSize === 'lg',
    'text-2xl leading-9': bodyTextSize === 'xl' && !responsive,
    'text-lg leading-7 md:text-2xl md:leading-9':
      bodyTextSize === 'xl' && responsive,
  })

  return {
    h1: props => <H1 className={headingClassName}>{props.children}</H1>,
    h2: props => <H2 className={headingClassName}>{props.children}</H2>,
    h3: props => <H3 className={headingClassName}>{props.children}</H3>,
    h4: props => <H4 className={headingClassName}>{props.children}</H4>,
    h5: props => <H5 className={headingClassName}>{props.children}</H5>,
    h6: props => <H6 className={headingClassName}>{props.children}</H6>,
    p: props => (
      <Paragraph
        size={bodyTextSize}
        responsive={responsive}
        textColorClassName={colorClassName}
        className={clsx(alignClassName, {
          'mb-6': margins,
        })}
      >
        {props.children}
      </Paragraph>
    ),
    a: props => (
      <AnchorOrLink
        to={
          props.href?.includes(':') || i18n.language === defaultLanguage
            ? props.href
            : `/${i18n.language}${props.href}`
        }
        target={linksInNewTab ? '_blank' : undefined}
        rel={linksInNewTab ? 'noopener' : undefined}
        className={clsx('active underline', colorClassName, {
          'transition hover:text-white focus:text-white':
            textColor === 'inverse-secondary',
        })}
      >
        {props.children}
      </AnchorOrLink>
    ),
    strong: props => (
      <strong className={clsx('font-bold', colorClassName)}>
        {props.children}
      </strong>
    ),
    ul: props => (
      <ul className={`${listClassName} text-list`}>{props.children}</ul>
    ),
    ol: props => (
      <ol className={`${listClassName} decimal-list`}>{props.children}</ol>
    ),
  }
}
