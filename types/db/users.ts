import { z } from 'zod'
import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface UsersTable {
  id: Generated<number>
  name: string
  userName: string
  email: string | null
  emailConfirmationToken: string | null
  published: boolean
  domain: string | null
  domainIsExternal: boolean
  domainContactId: number | null
  domainCode: string | null
  mailboxes: string
  stripeCustomerId: string | null
  stripeCheckoutSessionId: string | null
  stripeSubscriptionId: string | null
  plan: 'S' | 'L' | null
  chatwootSourceId: string | null
  lastPaidAt: ColumnType<Date | null, Date | null, Date | null>
  settings: string
  oneTimePassword: string | null
  oneTimePasswordCreatedAt: ColumnType<Date | null, Date | null, Date | null>
  createdAt: ColumnType<Date, undefined, undefined>
}
export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

const componentSettingsBaseSchema = z.object({
  id: z.number(),
  key: z.string(),
  title: z.string(),
  description: z.string(),
  visible: z.boolean(),
  order: z.number(),
})

const offeringsComponentSchema = componentSettingsBaseSchema.extend({
  key: z.literal('offerings'),
  layout: z.enum(['grid', 'list', 'carousel']),
  items: z.array(z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
  })),
})
export type OfferingComponentSchema = z.infer<typeof offeringsComponentSchema>

const galleryComponentSchema = componentSettingsBaseSchema.extend({
  key: z.literal('gallery'),
  type: z.enum(['grid', 'masonry']),
  items: z.array(z.object({
    url: z.string(),
    description: z.string(),
    title: z.string(),
  })),
})
export type GalleryComponentSchema = z.infer<typeof galleryComponentSchema>

const formComponentSchema = componentSettingsBaseSchema.extend({
  key: z.literal('form'),
  successMessage: z.string(),
  errorMessage: z.string(),
  fields: z.array(z.object({
    label: z.string(),
    help: z.string(),
    name: z.string(),
    type: z.enum(['text', 'email', 'tel', 'date', 'datetime', 'textarea', 'select', 'checkbox']),
    required: z.boolean(),
    options: z.array(z.object({
      label: z.string(),
    })),
    multiple: z.boolean(),
  })),
})
export type FormComponentSchema = z.infer<typeof formComponentSchema>

const faqComponentSchema = componentSettingsBaseSchema.extend({
  key: z.literal('faq'),
})
export type FaqComponentSchema = z.infer<typeof faqComponentSchema>

const downloadsComponentSchema = componentSettingsBaseSchema.extend({
  key: z.literal('downloads'),
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    type: z.string(),
  })),
})
export type DownloadsComponentSchema = z.infer<typeof downloadsComponentSchema>

const componentUnionSchema = z.union([
  offeringsComponentSchema,
  galleryComponentSchema,
  formComponentSchema,
  faqComponentSchema,
  downloadsComponentSchema,
])
export type ComponentUnionSchema = z.infer<typeof componentUnionSchema>

export const colorSchema = z.object({
  h: z.number(),
  s: z.number(),
  l: z.number(),
})

export const settingsFormSchema = z.object({
  public: z.object({
    css: z.string(),
    meta: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.string(),
      ogimage: z.string(),
      favicon: z.string(),
    }),
    company: z.object({
      firstname: z.string(),
      lastname: z.string(),
      name: z.string(),
      street: z.string(),
      zip: z.string(),
      city: z.string(),
      phone: z.string(),
      email: z.string(),
      taxId: z.string(),
      taxIdType: z.enum(['ustid', 'wid']),
      isSmallBusiness: z.boolean(),
      logo: z.string(),
    }),
    design: z.object({
      font: z.string(),
      color: colorSchema,
      rounded: z.string(),
    }),
    header: z.object({
      title: z.string(),
      description: z.string(),
      video: z.string(),
      image: z.string(),
      imageOverlay: z.object({
        color: colorSchema,
        opacity: z.number().min(0).max(100),
      }),
      height: z.enum(['auto', 'half', 'full', 'boxed']),
      titleFontSize: z.number(),
      titleColor: colorSchema,
      descriptionFontSize: z.number(),
      descriptionColor: colorSchema,
      showShareButton: z.boolean(),
      links: z.array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          icon: z.string(),
        }),
      ),
    }),
    pages: z.array(z.object({
      id: z.number(),
      path: z.string(),
      title: z.string(),
      description: z.string(),
      components: z.array(componentUnionSchema),
    })),
  }),
  private: z.object({
    assistant: z.object({
      context: z.string(),
    }),
    domain: z.string().nullable(),
    mailboxes: z.string().array(),
  }),
})

export type SettingsForm = z.infer<typeof settingsFormSchema>

type AvailableComponent = {
  key: ComponentUnionSchema['key']
  title: string
  description: string
  icon: string
  defaults: ComponentUnionSchema
}

export const availableComponents: AvailableComponent[] = [
  {
    key: 'offerings',
    title: 'Angebote',
    description: 'Hier können Sie Ihre Angebote mit Bild und Text präsentieren.',
    icon: 'i-heroicons-megaphone',
    defaults: {
      id: 1,
      key: 'offerings',
      title: 'Angebote',
      description: 'Hier können Sie Ihre Angebote mit Bild und Text präsentieren.',
      visible: true,
      order: 1,
      layout: 'list',
      items: [],
    },
  },
  {
    key: 'gallery',
    title: 'Galerie',
    description: 'Hier können Sie Bilder und Videos hochladen, um Ihre Produkte oder Dienstleistungen zu präsentieren.',
    icon: 'i-heroicons-photo',
    defaults: {
      id: 1,
      key: 'gallery',
      title: 'Galerie',
      description: 'Hier können Sie Bilder und Videos hochladen, um Ihre Produkte oder Dienstleistungen zu präsentieren.',
      visible: true,
      order: 1,
      type: 'grid',
      items: [],
    },
  },
  {
    key: 'form',
    title: 'Kontaktformular',
    description: 'Hier können Sie ein Kontaktformular einfügen, damit Interessenten Sie direkt kontaktieren können.',
    icon: 'i-heroicons-envelope',
    defaults: {
      id: 1,
      key: 'form',
      title: 'Kontaktformular',
      description: 'Hier können Sie ein Kontaktformular einfügen, damit Interessenten Sie direkt kontaktieren können.',
      visible: true,
      order: 1,
      successMessage: 'Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.',
      errorMessage: 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.',
      fields: [],
    },
  },
  {
    key: 'faq',
    title: 'Häufig gestellte Fragen',
    description: 'Hier können Sie häufig gestellte Fragen beantworten, um Ihren Kunden zu helfen.',
    icon: 'i-heroicons-question-mark-circle',
    defaults: {
      id: 1,
      key: 'faq',
      title: 'Häufig gestellte Fragen',
      description: 'Hier können Sie häufig gestellte Fragen beantworten, um Ihren Kunden zu helfen.',
      visible: true,
      order: 1,
    },
  },
  {
    key: 'downloads',
    title: 'Downloads',
    description: 'Hier können Sie Dateien zum Download anbieten, z.B. Broschüren oder Preislisten.',
    icon: 'i-heroicons-arrow-down-tray',
    defaults: {
      id: 1,
      key: 'downloads',
      title: 'Downloads',
      description: 'Hier können Sie Dateien zum Download anbieten, z.B. Broschüren oder Preislisten.',
      visible: true,
      order: 1,
      items: [],
    },
  },
] as const

export const defaultSettings = (): SettingsForm => ({
  public: {
    css: '',
    meta: {
      title: '',
      description: '',
      keywords: '',
      ogimage: '',
      favicon: '',
    },
    company: {
      firstname: '',
      lastname: '',
      name: '',
      street: '',
      zip: '',
      city: '',
      phone: '',
      email: '',
      taxId: '',
      taxIdType: 'ustid',
      isSmallBusiness: true,
      logo: '',
    },
    design: {
      font: 'montserrat',
      color: {
        h: 199,
        s: 100,
        l: 48,
      },
      rounded: 'md',
    },
    header: {
      title: 'Herzlich Willkommen',
      description: 'Auf Ihrer neuen Website von Solohost.de',
      height: 'full',
      titleColor: {
        h: 0,
        s: 0,
        l: 0,
      },
      titleFontSize: 12,
      descriptionColor: {
        h: 0,
        s: 0,
        l: 0,
      },
      descriptionFontSize: 8,
      video: '',
      image: '',
      imageOverlay: {
        color: {
          h: 0,
          s: 0,
          l: 0,
        },
        opacity: 4,
      },
      showShareButton: true,
      links: [],
    },
    pages: [
      {
        id: 1,
        path: '/',
        title: 'Startseite',
        description: 'Die Startseite Ihrer Website',
        components: [
          {
            id: 1,
            key: 'offerings',
            title: 'Angebote',
            description: 'Hier können Sie Ihre Angebote mit Bild und Text präsentieren.',
            visible: true,
            order: 1,
            layout: 'list',
            items: [
              {
                id: 1,
                title: 'Mein erstes Angebot',
                description: 'Beschreibung meines ersten Angebots',
              }
            ],
          },
        ],
      },
    ],
  },
  private: {
    assistant: {
      context: '',
    },
    domain: null,
    mailboxes: [],
  },
})
