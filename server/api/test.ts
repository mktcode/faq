export default defineEventHandler(async (event) => {
  try {
    await autodns.findDomainContact('kontakt@emmaherbst.de')
  } catch (error) {
    return error
  }
})
