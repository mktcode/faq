import dns from 'dns/promises'

export async function checkDomainA(domain: string) {
  const { public: { lbIp } } = useRuntimeConfig()

  try {
    const addresses = await dns.resolve4(domain)
    return addresses.includes(lbIp)
  }
  catch (err) {
    return false
  }
}

export async function checkDomainMx(domain: string, mailhost: string) {
  try {
    const mxRecords = await dns.resolveMx(domain)

    const mxRecord = mxRecords.find(record => record.exchange === mailhost)
    if (mxRecord) {
      return true
    }
    else {
      return false
    }
  }
  catch (err) {
    return false
  }
}
