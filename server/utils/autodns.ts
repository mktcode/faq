import { DomainRobot, DomainRobotModels } from 'js-domainrobot-sdk'

const autodnsApiUrl = 'https://api.demo.autodns.com/v1'
const autodnsApiUser = 'api@markus-kottlaender.de'

function getDomainRobot() {
  const { autodnsApiKey } = useRuntimeConfig()

  return new DomainRobot({
    url: autodnsApiUrl,
    auth: {
      user: autodnsApiUser,
      password: autodnsApiKey,
      context: 1,
    },
  })
}

async function createDomainContact(contact: {
  firstname: string
  lastname: string
  street: string
  city: string
  postalCode: string
  country: string
}) {
  const query = new DomainRobotModels.Contact({
    type: 'PERSON',
    fname: contact.firstname,
    lname: contact.lastname,
    address: [contact.street],
    city: contact.city,
    pcode: contact.postalCode,
    country: contact.country,
  })

  const domainRobot = getDomainRobot()
  const domainContact = await domainRobot.contact().create(query)
  const domainContactId = domainContact.result.data[0].id
  if (!domainContactId) {
    throw new Error('Failed to create domain contact')
  }

  return domainContactId
}

async function registerDomainWithZone(domain: string, contactId: number) {
  const { lbIp } = useRuntimeConfig().public
  const domainRobot = getDomainRobot()

  await domainRobot.domain().create(new DomainRobotModels.Domain({
    name: domain,
    ownerc: {
      id: contactId,
    },
    zone: {
      origin: domain,
      resourceRecords: [
        {
          type: 'A',
          value: lbIp,
        },
      ],
    },
  }))
}

async function addMissingMailRecords(domain: string, mailDomainId: string, mailVerifyIp: string) {
  const domainRobot = getDomainRobot()

  const records = await domainRobot.zone().info(domain, 'a.ns14.net')
  const zone = records.result.data[0]
  const resourceRecords = zone.resourceRecords || []

  const hasARecord = resourceRecords.some(record => record.type === 'A' && record.name === mailDomainId && record.value === mailVerifyIp)
  const hasMXRecord1 = resourceRecords.some(record => record.type === 'MX' && record.value === 'mx01.qboxmail.com')
  const hasMXRecord2 = resourceRecords.some(record => record.type === 'MX' && record.value === 'mx02.qboxmail.com')

  if (!hasARecord || !hasMXRecord1 || !hasMXRecord2) {
    await domainRobot.zone().update(
      new DomainRobotModels.Zone({
        origin: domain,
        resourceRecords: [
          {
            type: 'A',
            name: mailDomainId,
            value: mailVerifyIp,
          },
          {
            type: 'MX',
            value: 'mx01.qboxmail.com',
            pref: 10,
          },
          {
            type: 'MX',
            value: 'mx02.qboxmail.com',
            pref: 20,
          },
        ],
      }),
      'a.ns14.net',
    )
  }
}

export const autodns = {
  createDomainContact,
  registerDomainWithZone,
  addMissingMailRecords,
}
