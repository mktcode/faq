export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/x-ndjson; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, no-transform')
  event.node.res.flushHeaders?.()

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
  const ndjson = (async function* () {
    yield JSON.stringify({ t: 'start', at: Date.now() }) + '\n'
    await sleep(1000)
    yield JSON.stringify({ t: 't+1s' }) + '\n'
    await sleep(1000)
    yield JSON.stringify({ t: 't+2s' }) + '\n'
    await sleep(1000)
    yield JSON.stringify({ t: 'done' }) + '\n'
  })()

  return sendIterable(event, ndjson)
})
