import type { Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

export interface SettingsTable {
  id: Generated<number>
  userId: number
  settings: string
}

export type Settings = Selectable<SettingsTable>
export type NewSettings = Insertable<SettingsTable>
export type SettingsUpdate = Updateable<SettingsTable>

export const settingsFormSchema = z.object({
  company: z.object({
    name: z.string().optional().nullable(),
    street: z.string().optional().nullable(),
    zip: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
  }).optional().nullable(),
  logo: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  preferredContactMethod: z.enum(['email', 'phone', 'none']).optional().nullable(),
  font: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  rounded: z.string().optional().nullable(),
  showGoogleReviews: z.boolean().optional().nullable(),
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
})

export type SettingsForm = z.infer<typeof settingsFormSchema>
