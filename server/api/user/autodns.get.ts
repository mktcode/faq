export default defineEventHandler(async (event) => {
  try {
    const createResult = await createDomainContact({
      email: 'kontakt@emmaherbst.de',
      firstname: 'Emma',
      lastname: 'Herbst',
      street: 'Musterstraße 1',
      city: 'Musterstadt',
      postalCode: '12345',
      country: 'DE',
    })
    const findResult = await findDomainContact('kontakt@emmaherbst.de')

    return { createResult, findResult }
  }
  catch (error) {
    console.error('Error finding domain contact:', error)
  }
})
