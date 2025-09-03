import { DomainRobot, DomainRobotModels } from 'js-domainrobot-sdk'

const autodnsApiUrl = 'https://api.demo.autodns.com/v1'
const autodnsApiUser = '2025_08_28_KOTTLAENDER_JH'

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
  orgName: string
  firstname: string
  lastname: string
  street: string
  city: string
  postalCode: string
  country: string
  email: string
  phone: string
}) {
  const query = new DomainRobotModels.Contact({
    type: 'ORG',
    organization: contact.orgName,
    fname: contact.firstname,
    lname: contact.lastname,
    address: [contact.street],
    city: contact.city,
    pcode: contact.postalCode,
    country: contact.country,
    email: contact.email,
    phone: contact.phone,
  })

  const domainRobot = getDomainRobot()
  try {
    const domainContact = await domainRobot.contact().create(query)
    const domainContactId = domainContact.result.data[0].id
    if (!domainContactId) {
      throw new Error('Failed to create domain contact')
    }
  
    return { domainContactId, error: null }
  } catch (error) {
    return { domainContactId: null, error }
  }
}

async function registerDomainWithZone(domain: string, contactId: number) {
  const { lbIp } = useRuntimeConfig().public
  const domainRobot = getDomainRobot()

  try {
    const result = await domainRobot.domain().create(new DomainRobotModels.Domain({
      name: domain,
      nameServers: [
        new DomainRobotModels.NameServer({
          name: "a.demo.autodns.com"
        }),
        new DomainRobotModels.NameServer({
          name: "b.demo.autodns.com"
        })
      ],
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
          {
            type: 'A',
            value: lbIp,
            name: 'www',
          },
        ],
      },
    }))

    console.log(JSON.stringify(result, null, 2))

    return { error: null }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

async function domainInfo(domain: string) {
  const domainRobot = getDomainRobot()

  try {
    const info = await domainRobot.domain().info(domain)
    return { info, error: null }
  } catch (error) {
    console.error(error)
    return { info: null, error }
  }
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
  domainInfo,
  addMissingMailRecords,
}
