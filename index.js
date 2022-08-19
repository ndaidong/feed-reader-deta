const express = require('express')
const cors = require('cors')

const { read } = require('feed-reader/dist/cjs/feed-reader.js')

const app = express()

app.use(cors())

const isValidUrl = (url = '') => {
  try {
    const ourl = new URL(url)
    return ourl !== null && ['https:', 'http:'].includes(ourl.protocol)
  } catch (err) {
    return false
  }
}

app.get('/', async (req, res) => {
  const { query = {}, originalUrl } = req
  const { url = '' } = query

  if (!url || !isValidUrl(url)) {
    console.log(`Deny a bad request: ${originalUrl}`)
    return res.status(400).json({
      error: 1,
      message: 'Required parameter `URL` is missing or invalid',
      data: null
    })
  }

  const result = {
    error: 1,
    message: `Could not read feed from "${url}"`,
    data: null
  }

  try {
    console.log(`Read feed from ${url}`)
    const feed = await read(url)
    result.error = 0
    result.message = 'Feed data has been read successfuly'
    result.data = feed
  } catch (err) {
    result.message = err.message || String(err) || 'Something went wrong'
    console.log(`Feed reading failed: ${result.message}`)
  }

  return res.json(result)
})

module.exports = app
