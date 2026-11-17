import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';

/** Neutral greys (Tailwind zinc) */
const zinc = {
  0: '#ffffff',
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
};

export const MyPreset = definePreset(Aura, {
  semantic: {
    // PkHax brand red
    primary: {
      50: '#fff1f1',
      100: '#ffdfdf',
      200: '#ffc5c5',
      300: '#ff9d9d',
      400: '#ff6464',
      500: '#ff5f5f',
      600: '#ed2121',
      700: '#c81010',
      800: '#a50f0f',
      900: '#881414',
      950: '#450a0a',
    },
    colorScheme: {
      light: {
        surface: zinc,
        // a darker red than 500, so white button text stays readable
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
      },
      dark: {
        surface: zinc,
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});
