const taskName = "confirmDomainContacts";

function randomWait(minMs: number, maxMs: number) {
  const waitTime = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
}

async function claimExecution() {
  await randomWait(0, 500);

  const db = await getDatabaseConnection();
  const result = await db
    .updateTable("taskRotation")
    .set({ lastRunAt: new Date() })
    .where("taskName", "=", taskName)
    .where("lastRunAt", "<", new Date(Date.now() - 1 * 60 * 1000))
    .executeTakeFirst();
  
  const updatedRows = Number(result.numUpdatedRows || 0);
  
  return updatedRows > 0;
}

async function getDomainContactConfirmations() {
  // TODO: Implement actual logic to fetch domain contact confirmations
  return [
    { domain: "example.com", contactId: 1 },
  ];
}

export default defineTask({
  meta: {
    name: taskName,
    description: "Manage domains",
  },
  async run() {
    const claimed = await claimExecution();
    if (!claimed) {
      return { result: "Skipped" };
    }

    const db = await getDatabaseConnection();

    const domainsWithoutContactId = await db
      .selectFrom("users")
      .select(["id", "domain"])
      .where("domain", "is not", null)
      .where("domainContactId", "is", null)
      .execute();
    
    if (import.meta.dev) {
      console.log(`Found ${domainsWithoutContactId.length} domains without contact ID.`);
    }

    if (domainsWithoutContactId.length === 0) {
      return { result: "No domains to process" };
    }

    const domainContactConfirmations = await getDomainContactConfirmations();

    for (const domainWithoutContactId of domainsWithoutContactId) {
      const domainContactConfirmation = domainContactConfirmations.find((d) => d.domain === domainWithoutContactId.domain);
      if (domainContactConfirmation) {
        await db
          .updateTable("users")
          .set({ domainContactId: domainContactConfirmation.contactId })
          .where("domain", "=", domainContactConfirmation.domain)
          .execute();
      }
    }

    return { result: "Success" };
  },
});
