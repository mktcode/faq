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
  privacy: z.string().optional().nullable(),
  links: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        icon: z.string(),
      }),
    )
    .optional().nullable(),
  displayedComponents: z.array(z.enum(componentKeys)).optional(),
})

export type SettingsForm = z.infer<typeof settingsFormSchema>
