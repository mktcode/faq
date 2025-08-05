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
  stripeCustomerId: string | null
  lastPaidAt: ColumnType<Date | null, Date | null, Date | null>
  settings: string
  createdAt: ColumnType<Date, undefined, undefined>
}
export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

export const componentDetails = [
  {
    key: 'offer',
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
export const componentKeys = ['offer', 'gallery', 'downloads', 'form', 'faq'] as const
export type ComponentKey = (typeof componentKeys)[number]
export const settingsFormSchema = z.object({
  company: z.object({
    name: z.string().optional().nullable(),
    street: z.string().optional().nullable(),
    zip: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    isSmallBusiness: z.boolean().optional(),
  }).optional().nullable(),
  logo: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  font: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  rounded: z.string().optional().nullable(),
  headerImage: z.string().optional().nullable(),
  headerImageOverlay: z.object({
    color: z.string(),
    opacity: z.number().min(0).max(100),
  }).optional().nullable(),
  headerTitleFontSize: z.number().optional().nullable(),
  headerTitleColor: z.string().optional().nullable(),
  headerDescriptionFontSize: z.number().optional().nullable(),
  headerDescriptionColor: z.string().optional().nullable(),
  downloads: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional().nullable(),
      url: z.string().url(),
      type: z.string(),
    }),
  ).optional().nullable(),
  offers: z
    .array(
      z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
      }),
    )
    .optional().nullable(),
  gallery: z
    .array(
      z.object({
        url: z.string(),
        description: z.string().optional().nullable(),
        title: z.string().optional().nullable(),
      }),
    )
    .optional().nullable(),
  form: z.object({
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    successMessage: z.string().optional().nullable(),
    errorMessage: z.string().optional().nullable(),
    fields: z
      .array(
        z.object({
          label: z.string(),
          help: z.string().optional().nullable(),
          name: z.string(),
          type: z.enum(['text', 'email', 'tel', 'date', 'datetime', 'textarea', 'select', 'checkbox']),
          required: z.boolean().optional().default(false),
          options: z.array(z.string()).optional().nullable(),
          multiple: z.boolean().optional().default(false),
        }),
      )
      .optional().nullable(),
  }).optional().nullable(),
  links: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        icon: z.string(),
      }),
    )
    .optional().nullable(),
  showShareButton: z.boolean().optional().nullable(),
  displayedComponents: z.array(z.enum(componentKeys)).optional(),
})

export type SettingsForm = z.infer<typeof settingsFormSchema>
