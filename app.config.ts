const variantsRounded = {
  none: {
    base: 'rounded-none',
  },
  md: {
    base: 'rounded-md',
  },
  xl: {
    base: 'rounded-xl',
  },
}

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'zinc',
      website: 'sky',
    },
    button: {
      variants: {
        size: {
          xxl: {
            base: 'px-5 py-3 text-xl',
            icon: 'w-6 h-6',
          },
        },
        rounded: variantsRounded,
      },
      defaultVariants: {
        size: 'xl',
        rounded: 'md',
      },
    },
    navigationMenu: {
      slots: {
        linkLabel: 'hidden md:inline',
      },
    },
    carousel: {
      variants: {
        active: {
          true: {
            dot: '!bg-(--color-primary-500)',
          },
        },
      },
    },
    input: {
      slots: {
        base: '!bg-gray-100 !ring-0 focus:!bg-gray-50',
      },
      variants: {
        size: {
          xxl: {
            base: 'px-4 py-3 text-lg',
          },
        },
        rounded: variantsRounded,
      },
      defaultVariants: {
        size: 'xl',
        rounded: 'md',
      },
    },
    select: {
      slots: {
        base: '!bg-gray-100 !ring-0 focus:!bg-gray-50',
      },
      variants: {
        size: {
          xxl: {
            base: 'px-4 py-3 text-lg',
            item: 'px-4 py-3 text-lg',
          },
        },
        rounded: variantsRounded,
      },
      defaultVariants: {
        size: 'xl',
        rounded: 'md',
      },
    },
    textarea: {
      slots: {
        base: '!bg-gray-100 !ring-0 focus:!bg-gray-50 resize-none',
      },
      variants: {
        size: {
          xxl: {
            base: 'px-4 py-3 text-lg',
          },
        },
        rounded: variantsRounded,
      },
      defaultVariants: {
        size: 'xl',
        rounded: 'md',
      },
    },
  },
})
