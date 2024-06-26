import * as React from 'react'

import clsx from 'clsx'

import { AnchorOrLink } from '#app/utils/misc.tsx'

import { Icon } from './icon.tsx'

type ButtonType = 'primary' | 'secondary' | 'outline' | 'outline-inverse'
type ButtonSize = 'small' | 'medium' | 'large'
type ButtonRingOffsetColor = 'white' | 'black'
type ButtonProps = {
  variant?: ButtonType
  size?: ButtonSize
  ringOffsetColor?: ButtonRingOffsetColor
  children: React.ReactNode | React.ReactNode[]
}

function getClassName({ className }: { className?: string }) {
  return clsx(
    'group relative inline-flex place-self-center font-bold focus:outline-none opacity-100 disabled:opacity:50 transition',
    className,
  )
}

function ButtonInner({
  children,
  variant,
  size = 'large',
  ringOffsetColor = 'white',
}: ButtonProps) {
  return (
    <>
      <div
        className={clsx(
          'focus-ring absolute inset-0 transform rounded-full font-bold opacity-100 transition-all disabled:opacity-50',
          {
            'focus-ring-blue bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] bg-[0%] duration-1000 group-hover:bg-[-100%] group-active:bg-[0%]':
              variant === 'primary',
            'focus-ring-black bg-gray-900': variant === 'secondary',
            'focus-ring-black border-black': variant === 'outline',
            'focus-ring-inverse border-white': variant === 'outline-inverse',
            'border-2 bg-transparent':
              variant === 'outline' || variant === 'outline-inverse',
            'ring-offset-black': ringOffsetColor === 'black',
            'ring-offset-white': ringOffsetColor === 'white',
          },
        )}
      />
      <div
        className={clsx(
          'relative flex w-full items-center justify-center gap-x-2 whitespace-nowrap text-center text-lg leading-6 transition-all group-active:opacity-70',
          {
            'text-white': variant !== 'outline',
            'text-black': variant === 'outline',
            'px-6 py-4': size === 'large',
            'px-6 py-3': size === 'medium',
            'px-4 py-2 text-sm': size === 'small',
          },
        )}
      >
        {children}
      </div>
    </>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'large',
  className,
  ringOffsetColor,
  ...buttonProps
}: ButtonProps & JSX.IntrinsicElements['button']) {
  return (
    <button {...buttonProps} className={getClassName({ className })}>
      <ButtonInner
        variant={variant}
        size={size}
        ringOffsetColor={ringOffsetColor}
      >
        {children}
      </ButtonInner>
    </button>
  )
}

export function LinkButton({
  className,
  underlined,
  ...buttonProps
}: { underlined?: boolean } & JSX.IntrinsicElements['button']) {
  return (
    <button
      {...buttonProps}
      className={clsx(
        className,
        underlined
          ? 'underlined whitespace-nowrap focus:outline-none'
          : 'underline',
        'text-primary inline-block',
      )}
    />
  )
}

type ButtonLinkProps = React.ComponentPropsWithRef<typeof AnchorOrLink> &
  ButtonProps

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { children, variant = 'primary', className, ringOffsetColor, ...rest },
    ref,
  ) {
    return (
      <AnchorOrLink ref={ref} className={getClassName({ className })} {...rest}>
        <ButtonInner variant={variant} ringOffsetColor={ringOffsetColor}>
          {children}
        </ButtonInner>
      </AnchorOrLink>
    )
  },
)

export function PhoneButton({
  children,
  variant,
  ringOffsetColor,
  ...rest
}: ButtonLinkProps & { children: string }) {
  const [hasCopied, setHasCopied] = React.useState(false)

  const onCopy = async () => {
    if (hasCopied) return

    await navigator.clipboard.writeText(children)
    setHasCopied(true)
  }

  React.useEffect(() => {
    let timeout: number

    if (hasCopied) {
      timeout = window.setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }

    return () => {
      window.clearTimeout(timeout)
    }
  }, [hasCopied])

  return (
    <>
      {/*Mobile*/}
      <ButtonLink
        className="inline-block w-max lg:hidden"
        variant={variant}
        href={`tel:${children}`}
        ringOffsetColor={ringOffsetColor}
        {...rest}
      >
        <Icon name="phone" size="lg" />
        {children}
      </ButtonLink>

      {/*Desktop*/}
      <Button
        className="hidden lg:inline-block"
        variant={variant}
        onClick={onCopy}
        ringOffsetColor={ringOffsetColor}
      >
        <div className="absolute bottom-0 left-6 top-0 flex flex-col items-center gap-4 overflow-hidden">
          <div
            className={clsx(
              `h-6 w-6 -translate-y-12 transition group-hover:translate-y-4 group-focus:translate-y-4`,
              {
                hidden: hasCopied,
              },
            )}
          >
            <Icon name="square-stack" size="lg" />
          </div>
          <div
            className={clsx(
              `h-6 w-6 -translate-y-6 transition group-hover:translate-y-12 group-focus:translate-y-12`,
              {
                hidden: hasCopied,
              },
            )}
          >
            <Icon name="phone" size="lg" />
          </div>
          <div
            className={clsx('h-6 w-6 translate-y-4', {
              'text-inverse-secondary': variant === 'outline-inverse',
              hidden: !hasCopied,
              block: hasCopied,
            })}
          >
            <Icon name="check-circle" size="lg" />
          </div>
        </div>

        {hasCopied ? (
          <div
            className={clsx(
              'pl-8 lg:font-bold',
              variant === 'outline-inverse'
                ? 'text-inverse-secondary'
                : 'text-primary',
            )}
          >
            Gekopieerd
          </div>
        ) : (
          <div className="pl-8">{children}</div>
        )}
      </Button>
    </>
  )
}
