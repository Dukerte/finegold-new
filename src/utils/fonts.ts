// Font family constants for easy usage
export const FONTS = {
  // Exo2 Font Family
  EXO2: {
    THIN: 'font-exo2-thin',
    LIGHT: 'font-exo2-light',
    REGULAR: 'font-exo2-regular',
    MEDIUM: 'font-exo2-medium',
    SEMIBOLD: 'font-exo2-semibold',
    BOLD: 'font-exo2-bold',
    EXTRABOLD: 'font-exo2-extrabold',
    BLACK: 'font-exo2-black',
  },

  // Inter Font Family
  INTER: {
    REGULAR: 'font-inter-regular',
    BOLD: 'font-inter-bold',
  },

  // Inter Font Family (18pt)
  INTER_18PT: {
    REGULAR: 'font-inter-18pt-regular',
    BOLD: 'font-inter-18pt-bold',
  },

  // Inter Font Family (24pt)
  INTER_24PT: {
    REGULAR: 'font-inter-24pt-regular',
    BOLD: 'font-inter-24pt-bold',
  },

  // Inter Font Family (28pt)
  INTER_28PT: {
    REGULAR: 'font-inter-28pt-regular',
    BOLD: 'font-inter-28pt-bold',
  },
} as const;

// Typography presets for common use cases
export const TYPOGRAPHY = {
  // Headings
  H1: `${FONTS.EXO2.BOLD} text-4xl md:text-5xl lg:text-6xl`,
  H2: `${FONTS.EXO2.SEMIBOLD} text-3xl md:text-4xl lg:text-5xl`,
  H3: `${FONTS.EXO2.MEDIUM} text-2xl md:text-3xl lg:text-4xl`,
  H4: `${FONTS.EXO2.REGULAR} text-xl md:text-2xl lg:text-3xl`,
  H5: `${FONTS.EXO2.REGULAR} text-lg md:text-xl lg:text-2xl`,
  H6: `${FONTS.EXO2.REGULAR} text-base md:text-lg lg:text-xl`,

  // Body text
  BODY_LARGE: `${FONTS.INTER_18PT.REGULAR} text-lg leading-relaxed`,
  BODY: `${FONTS.INTER_18PT.REGULAR} text-base leading-relaxed`,
  BODY_SMALL: `${FONTS.INTER_18PT.REGULAR} text-sm leading-relaxed`,

  // Special text
  DISPLAY: `${FONTS.EXO2.BLACK} text-5xl md:text-6xl lg:text-7xl`,
  HERO: `${FONTS.EXO2.EXTRABOLD} text-4xl md:text-6xl lg:text-8xl`,
  CAPTION: `${FONTS.INTER_18PT.REGULAR} text-xs leading-tight`,
  BUTTON: `${FONTS.EXO2.SEMIBOLD} text-sm md:text-base`,
} as const;

// Helper function to combine font classes
export const combineFontClasses = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};
