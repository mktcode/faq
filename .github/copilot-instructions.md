# Copilot Instructions

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) and [Nuxt UI documentation](https://ui.nuxt.com/components)
- **Database**: [MySQL](https://www.mysql.com/) with [Kysely](https://kysely.dev/docs/intro)
- **Email Management**: [Mailcow](https://mailcow.email/)
- **Cloud Hosting**: [Hetzner Cloud](https://www.hetzner.com/cloud)

## Best Practices

- Always use TypeScript! Avoid "any" types.
- Keep code modular and reusable!
- Use representative names for components, functions, and variables for better readability.
- Always look into related and similar files before writing new ones!
- Exports in `utils` and `server/utils` are automatically imported. Do not import them manually!
- You can find the database schema in the `types/db` folder.
- Run `npm run lint:fix` after making changes to ensure code quality.
- VERY IMPORTANT: When asked to implement something, always reason about the problem, read relevant code and start with a detailed implementation plan.
