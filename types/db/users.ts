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
  stripeCustomerId: string | null
  lastPaidAt: ColumnType<Date | null, Date | null, Date | null>
  settings: string
  createdAt: ColumnType<Date, undefined, undefined>
}
export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

export const availableComponents = [
  {
    key: 'offers',
    title: 'Angebote',
    description: 'Hier können Sie Ihre Angebote mit Bild und Text präsentieren.',
    icon: 'i-heroicons-megaphone',
  },
  {
    key: 'gallery',
    title: 'Galerie',
    description: 'Hier können Sie Bilder und Videos hochladen, um Ihre Produkte oder Dienstleistungen zu präsentieren.',
    icon: 'i-heroicons-photo',
  },
  {
    key: 'form',
    title: 'Kontaktformular',
    description: 'Hier können Sie ein Kontaktformular einfügen, damit Interessenten Sie direkt kontaktieren können.',
    icon: 'i-heroicons-envelope',
  },
  {
    key: 'faq',
    title: 'Häufig gestellte Fragen',
    description: 'Hier können Sie häufig gestellte Fragen beantworten, um Ihren Kunden zu helfen.',
    icon: 'i-heroicons-question-mark-circle',
  },
  {
    key: 'downloads',
    title: 'Downloads',
    description: 'Hier können Sie Dateien zum Download anbieten, z.B. Broschüren oder Preislisten.',
    icon: 'i-heroicons-arrow-down-tray',
  },
] as const

const componentSettingsBaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  visible: z.boolean(),
  order: z.number(),
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
      name: z.string(),
      street: z.string(),
      zip: z.string(),
      city: z.string(),
      phone: z.string(),
      email: z.string(),
      taxId: z.string(),
      isSmallBusiness: z.boolean(),
      logo: z.string(),
    }),
    design: z.object({
      font: z.string(),
      color: z.string(),
      rounded: z.string(),
    }),
    header: z.object({
      title: z.string(),
      description: z.string(),
      video: z.string(),
      image: z.string(),
      imageOverlay: z.object({
        color: z.string(),
        opacity: z.number().min(0).max(100),
      }),
      height: z.enum(['auto', 'half', 'full']),
      titleFontSize: z.number(),
      titleColor: z.string(),
      descriptionFontSize: z.number(),
      descriptionColor: z.string(),
      showShareButton: z.boolean(),
      links: z.array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          icon: z.string(),
        }),
      ),
    }),
    components: z.object({
      offers: componentSettingsBaseSchema.extend({
        items: z.array(z.object({
          title: z.string(),
          description: z.string(),
        })),
      }),
      gallery: componentSettingsBaseSchema.extend({
        type: z.enum(['grid', 'masonry']),
        items: z.array(z.object({
          url: z.string(),
          description: z.string(),
          title: z.string(),
        })),
      }),
      form: componentSettingsBaseSchema.extend({
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
      }),
      faq: componentSettingsBaseSchema,
      downloads: componentSettingsBaseSchema.extend({
        items: z.array(z.object({
          title: z.string(),
          description: z.string(),
          url: z.string().url(),
          type: z.string(),
        })),
      }),
    }),
  }),
  private: z.object({
    assistant: z.object({
      context: z.string().nullable(),
    }),
    domain: z.string().nullable(),
    mailboxes: z.string().array(),
  }),
})

export type SettingsForm = z.infer<typeof settingsFormSchema>
export type ComponentKey = keyof SettingsForm['public']['components']

export const defaultSettings: SettingsForm = {
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
      name: '',
      street: '',
      zip: '',
      city: '',
      phone: '',
      email: '',
      taxId: '',
      isSmallBusiness: true,
      logo: '',
    },
    design: {
      font: 'montserrat',
      color: 'hsl(199, 100%, 48%)',
      rounded: 'md',
    },
    header: {
      title: 'Herzlich Willkommen',
      description: 'Auf Ihrer neuen Website von Solihost.de',
      height: 'full',
      titleColor: 'black',
      titleFontSize: 12,
      descriptionColor: 'black',
      descriptionFontSize: 8,
      video: '',
      image: '',
      imageOverlay: {
        color: 'black',
        opacity: 4,
      },
      showShareButton: true,
      links: [],
    },
    components: {
      offers: {
        visible: true,
        order: 1,
        title: '',
        description: '',
        items: [],
      },
      gallery: {
        type: 'grid',
        visible: true,
        order: 2,
        title: '',
        description: '',
        items: [],
      },
      faq: {
        visible: true,
        order: 3,
        title: 'Häufig gestellte Fragen',
        description: '',
      },
      downloads: {
        visible: true,
        order: 4,
        title: 'Downloads',
        description: '',
        items: [],
      },
      form: {
        visible: true,
        order: 5,
        title: 'Anfrage',
        description: 'Wir freuen uns auf Ihre Nachricht!',
        successMessage: 'Vielen Dank für Ihre Anfrage! Wir werden uns so schnell wie möglich bei Ihnen melden.',
        errorMessage: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
        fields: [],
      },
    },
  },
  private: {
    assistant: {
      context: null,
    },
    domain: null,
    mailboxes: [],
  },
}
