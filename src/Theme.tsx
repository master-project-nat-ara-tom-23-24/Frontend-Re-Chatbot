import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: { heading: '"DM Sans", sans-serif', body: '"DM Sans", sans-serif' },
  semanticTokens: {
    colors: {
      bg: {
        default: 'linear-gradient(180deg,#f8f7f8,#f5f3f7)',
        _dark: 'linear-gradient(180deg,#f8f7f8,#f5f3f7)'
      },
      base: {
        default: 'white',
        _dark: 'blackAlpha.900'
      },
      mid: {
        default: '#d6c9ff73',
        _dark: 'blackAlpha.600'
      }
    }
  },
  layerStyles: {
    card: {
      p: { base: 4, xl: 5 }, bg: 'base', borderWidth: 1, boxShadow: 'lg',
      rounded: '3xl', _hover: { boxShadow: 'hover' }
    },
    file: { fontSize: { base: 'sm', xl: 'md' }, fontFamily: 'Inter, Roboto, sans-serif' },
    container: { p: 4, w: 'full', maxW: 'container.xl' },
    segment: { p: 6, bg: 'base', rounded: '2xl', boxShadow: 'segment' },
    feature: { rounded: '3xl', bg: 'base', borderWidth: 1, boxShadow: 'lg', _hover: { boxShadow: 'hover' } },
    gradient: { rounded: 'lg', bg: 'gradients.red-light', boxShadow: 'card', border: '2px solid transparent' }
  },
  colors: {
    orange: {
      200: '#ffb460'
    },
    gray: {
      10: '#f1f1f1',
      15: '#f3f3f3',
      100: '#f6f9fd',
      150: '#fcfcfc',
      175: '#fafafa',
      200: '#e9edf2',
      250: '#d7d9e2',
      450: '#1F1E1E',
      550: '#1F1E1E'
    },
    yellow: {
      400: '#fdd983'
    },
    green: {
      300: '#51e7b0',
      500: '#3dcb99',
      600: '#21ad7c',
      750: '#019b03'
    },
    purple: {
      75: '#ece8ff',
      100: '#ded8fd',
      200: '#d2c7ff',
      500: '#9576ff',
      600: '#8147ff',
      750: '#3b0fd2'
    },
    blue: {
      50: '#edf6ff',
      100: '#d6ecff',
      300: '#69b8ff',
      400: '#369FFF',
      500: '#369FFF',
      600: '#475eff',
      800: '#003680'
    },
    red: {
      500: '#ff4f22',
      600: '#e62d2d',
      750: '#e62d2d'
    },
    gradients: {
      100: 'linear-gradient(115deg, #eddeff, #d6d7ff)',
      200: 'linear-gradient(145deg, #ffffff, #e7e7ff)',
      400: 'linear-gradient(115deg, #9057ff, #6a33d6)',
      405: 'linear-gradient(140deg, #9057ff, #6a33d6)',
      500: 'linear-gradient(115deg, #923aff, #5e63ff)',
      'purple-light': 'linear-gradient(#fff, #fff) padding-box, linear-gradient(115deg, #923aff, #5e63ff) border-box',
      'purple-dark': 'linear-gradient(#f4f0ff, #f4f0ff) padding-box,linear-gradient(115deg, #923aff, #5e63ff) border-box',
      'green-light': 'linear-gradient(#fff, #fff) padding-box,linear-gradient(120deg, #10dc4e, #41fb7a) border-box',
      'green-dark': 'linear-gradient(120deg, #e2ffeb, #e2ffeb) padding-box,linear-gradient(120deg, #10dc4e, #41fb7a) border-box',
      'red-light': 'linear-gradient(#fff, #fff) padding-box,linear-gradient(120deg, #ffcf22, #f4c864) border-box',
      'red-dark': 'linear-gradient(#ffeded, #ffeded) padding-box,linear-gradient(120deg, #ff4f22, #f4a764) border-box'
    }
  },
  shadows: {
    xs: '0 0 4px 1px #e3e3e3',
    sm: '0px 3px 3px 1px #858f9d2e',
    md: '0px 3px 12px #858f9d2e',
    lg: '0px 2px 6px rgba(19, 18, 66, 0.07)',
    card: '#d7d9e2 0px 1px 2px 0px',
    hover: '#2a303933 0px 2px 16px 0px',
    callout: '#0000000d 5px 0px 15px, #00000008 4px 0px 6px',
    segment: '#0000000a -2px 0px 6px, #0000000a -2px 0px 15px',
    text: '3px 3px white,1px -2px white,-2px 1px white,-1px -1px white,1px 1px white'
  },
  components: {
    Code: { defaultProps: { colorScheme: 'whiteAlpha' }, variants: { subtle: { bg: 'transparent' } } },
    Tag: { defaultProps: { colorScheme: 'blackAlpha', size: { base: 'sm', xl: 'md' } } },
    Button: {
      defaultProps: { colorScheme: 'purple', size: { base: 'sm', xl: 'md' } },
      size: { sm: { minW: 0 } },
      variants: {
        'link': { minW: { sm: 0, xl: 4 }, paddingInline: { sm: 0, xl: 2 } },
        'round': {
          rounded: 'full', py: 6, px: 8, boxShadow: 'md', fontWeight: 700, bg: 'purple.500', color: 'white',
          _hover: { bg: 'purple.600', _disabled: { bg: 'purple.500' } }
        },
        'border': {
          rounded: 'full', py: 6, px: 8, boxShadow: 'md', fontWeight: 700, borderWidth: 1, bg: 'white',
          borderColor: 'purple.500', color: 'purple.500', _hover: { bg: 'purple.50' }
        },
        'gradient-solid': {
          color: 'white', bg: 'gradients.500', px: 3, _hover: { filter: 'brightness(1.2)' },
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms', _disabled: { bg: '' }
        },
        'gradient': ({ colorScheme = 'purple' }) => ({
          bg: `gradients.${colorScheme}-light`, color: colorScheme + '.750', borderColor: 'transparent',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms', borderWidth: 3, rounded: 'lg', boxShadow: 'card',
          _hover: { _disabled: { bg: '' }, bg: `gradients.${colorScheme}-dark` }
        })
      }
    }
  },
  styles: {
    global: {
      'html, body, #root': { w: '100vw', h: '100vh' },
      '::-webkit-scrollbar': { h: 3, w: 3, bg: 'transparent', ':horizontal': { bg: 'transparent' } },
      '::-webkit-scrollbar-corner': { bg: 'transparent' },
      '::-webkit-scrollbar-thumb': { borderRadius: 6, bg: 'transparent' },
      ':hover::-webkit-scrollbar-thumb': { bg: 'mid' },
      'ul, li': { listStyle: 'none', padding: 0, margin: 0 },
      '.filetabs': {
        display: 'flex', paddingInline: 2, paddingTop: 1, bg: 'blackAlpha.50',
        borderBottomWidth: 1, borderColor: 'blackAlpha.200'
      },
      '.rdp': {
        '--rdp-accent-color': 'var(--chakra-colors-purple-75)',
        '.rdp-button': { transition: 'background-color 0.5s ease' },
        '.rdp-day_today': { color: 'var(--chakra-colors-purple-400)' }
      },
      '.cal-published': {
        backgroundPosition: '0 -1em', backgroundRepeat: 'no-repeat', fontWeight: 500,
        backgroundImage: 'radial-gradient(var(--chakra-colors-green-400) 3px, transparent 0)'
      },
      '.cal-due': {
        backgroundPosition: '0 -1em', backgroundRepeat: 'no-repeat', fontWeight: 500,
        backgroundImage: 'radial-gradient(var(--chakra-colors-red-400) 3px, transparent 0)'
      }
    }
  }
})

export default theme