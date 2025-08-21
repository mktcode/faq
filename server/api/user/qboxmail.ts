export default defineEventHandler(async (event) => {
  try {
    const createResult = await createQboxmailDomain('emmaherbst.de')

    return { createResult }
  }
  catch (error) {
    console.error('Error creating Qboxmail domain:', error)
  }
})
