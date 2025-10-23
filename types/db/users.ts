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
  settings: number
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
export type ComponentSettingsBaseSchema = z.infer<typeof componentSettingsBaseSchema>

const htmlComponentSchema = componentSettingsBaseSchema.extend({
  key: z.literal('html'),
  html: z.string(),
  css: z.string(),
  js: z.string(),
})
export type HtmlComponentSchema = z.infer<typeof htmlComponentSchema>

export const colorSchema = z.object({
  h: z.number(),
  s: z.number(),
  l: z.number(),
})

export const settingsFormSchema = z.object({
  public: z.object({
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
      lastMod: z.string(),
    }),
    design: z.object({
      font: z.string(),
      fontSize: z.enum(['md', 'lg', 'xl', '2xl']),
      color: colorSchema,
      rounded: z.string(),
      css: z.string(),
      js: z.string(),
    }),
    pages: z.array(z.object({
      id: z.number(),
      path: z.string(),
      title: z.string(),
      description: z.string(),
      components: z.array(htmlComponentSchema),
      lastMod: z.string(),
    })),
  }),
  private: z.object({
    assistant: z.object({
      context: z.string(),
    }),
  }),
})

export type SettingsForm = z.infer<typeof settingsFormSchema>

export const defaultSettings = (): SettingsForm => ({
  public: {
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
      lastMod: new Date().toISOString(),
    },
    design: {
      font: 'montserrat',
      fontSize: 'lg',
      color: {
        h: 199,
        s: 100,
        l: 48,
      },
      rounded: 'md',
      css: '',
      js: '',
    },
    pages: [
      {
        id: 0,
        path: '/',
        title: 'Startseite',
        description: 'Die Startseite Ihrer Website',
        components: [
          {
            id: 0,
            key: 'html',
            title: 'Herzlich Willkommen',
            description: 'Auf Ihrer neuen Website von Solohost.de',
            visible: true,
            order: 1,
            html: '<p>Dies ist Ihre neue Website, die Sie ganz einfach selbst bearbeiten können. Melden Sie sich dazu im Solohost-Kundenbereich an und klicken Sie auf "Website bearbeiten".</p>',
            css: '',
            js: '',
          },
        ],
        lastMod: new Date().toISOString(),
      },
    ],
  },
  private: {
    assistant: {
      context: '',
    },
  },
})
