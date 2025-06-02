export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'zinc',
      website: 'sky',
    },
    button: {
      defaultVariants: {
        size: 'xl',
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
      },
      defaultVariants: {
        size: 'xl',
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
      },
      defaultVariants: {
        size: 'xl',
      },
    },
    textarea: {
      slots: {
        base: '!bg-gray-100 !ring-0 focus:!bg-gray-50 resize-none',
      },
    },
  },
})
