import { z } from 'zod'
import type { WebsiteSettings } from '~/types/db'

const inputSchema = z.object({
  company: z.object({
    name: z.string(),
    street: z.string(),
    zip: z.string(),
    city: z.string(),
    phone: z.string(),
    description: z.string(),
  }),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { company } = await readValidatedBody(event, body => inputSchema.parse(body))
  const db = await getDatabaseConnection()

  const existingCompany = await db
    .selectFrom('companies')
    .selectAll()
    .where('userId', '=', user.id)
    .executeTakeFirst()

  if (!existingCompany) {
    await db
      .insertInto('companies')
      .values({
        userId: user.id,
        name: company.name,
        street: company.street,
        zip: company.zip,
        city: company.city,
        phone: company.phone,
        description: company.description,
        isSmallBusiness: true,
      })
      .execute()
  }

  const existingWebsite = await db
    .selectFrom('websites')
    .selectAll()
    .where('userId', '=', user.id)
    .executeTakeFirst()

  if (!existingWebsite) {
    const texts = await generateWebsiteTexts(company)
    const websiteSettings: WebsiteSettings = {
      header: {
        enabled: true,
        title: company.name,
        subtitle: texts.headerDescription,
      },
      aboutUs: {
        enabled: true,
        title: texts.aboutTitle,
        text: texts.aboutDescription,
      },
      gallery: {
        enabled: true,
        images: [
          'https://picsum.photos/id/50/1000/1000',
        ],
      },
      contactForm: {
        enabled: true,
        title: 'Kontakt',
        name: company.name,
        street: company.street,
        zip: company.zip,
        city: company.city,
        phone: company.phone,
      },
    }

    await db
      .insertInto('websites')
      .values({
        userId: user.id,
        title: company.name,
        description: company.description,
        isOnline: false,
        primaryColor: 'sky',
        font: 'sans',
        settings: JSON.stringify(websiteSettings),
      })
      .execute()
  }
})
