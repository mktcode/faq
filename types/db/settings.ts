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
  logo: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  font: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  showGoogleReviews: z.boolean().optional().nullable(),
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
})

export type SettingsForm = z.infer<typeof settingsFormSchema>
