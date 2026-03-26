import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            950: '#450a0a'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617'
                },
                content: {
                    background: '{surface.0}', // Cards/Components are white in light
                    borderColor: '{surface.200}',
                    color: '{surface.700}'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617'
                },
                content: {
                    background: '{surface.800}', // Cards/Components are Slate 800 in dark
                    borderColor: '{surface.700}',
                    color: '{surface.0}'
                }
            }
        }
    },
    components: {
        datatable: {
            colorScheme: {
                dark: {
                    root: {
                        borderColor: '{surface.700}'
                    },
                    header: {
                        background: '{surface.800}',
                        borderColor: '{surface.700}'
                    },
                    row: {
                        background: '{surface.800}',
                        stripedBackground: '{surface.900}',
                        color: '{surface.0}'
                    }
                }
            }
        },
        card: {
            colorScheme: {
                dark: {
                    root: {
                        background: '{surface.800}'
                    }
                }
            }
        }
    }
});
