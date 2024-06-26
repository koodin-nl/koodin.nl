import { type Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    screens: {
      sm: '370px',
      md: '640px',
      lg: '1024px',
      xl: '1500px',
    },
    colors: {
      // color scheme is defined in /app.css
      transparent: 'transparent',
      current: 'currentColor',
      white: 'hsl(var(--color-white) / <alpha-value>)',
      black: 'hsl(var(--color-black) / <alpha-value>)',
      gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 'body'].reduce(
        (acc, cv) => ({
          ...acc,
          [cv]: `hsl(var(--color-gray-${cv}) / <alpha-value>)`,
        }),
        {},
      ),
      blue: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].reduce(
        (acc, cv) => ({
          ...acc,
          [cv]: `hsl(var(--color-blue-${cv}) / <alpha-value>)`,
        }),
        {},
      ),
      purple: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].reduce(
        (acc, cv) => ({
          ...acc,
          [cv]: `hsl(var(--color-purple-${cv}) / <alpha-value>)`,
        }),
        {},
      ),
      red: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].reduce(
        (acc, cv) => ({
          ...acc,
          [cv]: `hsl(var(--color-coral-${cv}) / <alpha-value>)`,
        }),
        {},
      ),
    },
    extend: {
      fontFamily: {
        sans: ['Nunito Sans'],
        display: ['Plus Jakarta Sans'],
      },
      fontSize: {
        '3xl': '2rem', // 32px
        '4xl': '2.5rem', // 4px
        '5xl': '3rem', // 48px
        '6xl': '3.5rem', // 56px
      },
      lineHeight: {
        normal: '120%',
      },
      letterSpacing: {
        tight: '-0.02em',
      },
      textOpacity: {
        60: '0.6',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      gridTemplateRows: {
        'max-content': 'max-content',
      },
      maxWidth: {
        '5xl': '65rem', // 1040px
      },
      spacing: {
        '8vw': '8vw', // page margin
        '100vw': '100vw',
        '200vw': '200vw',
        '100vh': '100vh',
        18: '4.5rem', //72px
        30: '7.5rem', // 120px
      },
      blur: {
        '4xl': '100px',
      },
      dropShadow: {},
      opacity: {
        1: '0.01',
      },
      boxShadow: {
        card: '0px 23px 38px 0px rgba(28, 32, 54, 0.10), 0px 1px 0px 0px rgba(255, 255, 255, 0.35) inset',
        'card-container': '0px 16px 64px hsl(var(--color-purple-700) / 0.1)',
      },
      backgroundImage: {
        'case-overlay':
          'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)',
        'video-overlay':
          'linear-gradient(180deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.78) 96%, #000 100%)',
        'story-gradient-card':
          'linear-gradient(180deg, rgba(67, 83, 255, 0.00) 28.69%, rgba(67, 83, 255, 0.14) 41.75%, rgba(67, 83, 255, 0.60) 77.53%)',
        'story-gradient-hero':
          ' linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(180deg, rgba(0, 0, 0, 0) 48.21%, rgba(0, 0, 0, 0.6) 100%), linear-gradient(180deg, rgba(67, 83, 255, 0) 28.69%, rgba(67, 83, 255, 0.144) 41.75%, rgba(67, 83, 255, 0.6) 77.53%)',
        'card-dark-hover':
          'linear-gradient(77.4deg, rgba(67, 83, 255, 0.1) 0.1%, rgba(67, 83, 255, 0) 74.35%), linear-gradient(0deg, #16151F, #16151F), linear-gradient(0deg, rgba(26, 26, 26, 0), rgba(26, 26, 26, 0))',
        'card-light-hover':
          'linear-gradient(77.4deg, rgba(67, 83, 255, 0.1) 0.1%, rgba(67, 83, 255, 0) 74.35%), linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))',
      },
    },
  },
} satisfies Config
