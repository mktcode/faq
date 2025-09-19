# Copilot Instructions

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) and [Nuxt UI documentation](https://ui.nuxt.com/components)
- **Database**: [MySQL](https://www.mysql.com/) with [Kysely](https://kysely.dev/docs/intro)
- **Email Management**: [Mailbox.org API](https://mailbox.org/)
- **Cloud Hosting**: [Hetzner Cloud](https://www.hetzner.com/cloud)

## Best Practices

- Always use TypeScript! Avoid "any" types.
- Keep code modular and reusable!
- Use representative names for components, functions, and variables for better readability.
- Exports in `utils` and `server/utils` are automatically imported. Do not import them manually!
- You can find the database schema in `types/db` and `db/migrations/0_init.ts`.