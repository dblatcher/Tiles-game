import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()


function fetchContentsFromFile(url) {

  return new Promise((resolve, reject) => {
    fs.readFile(url, (err, buffer) => {
      let contents = buffer ? buffer.toString() : ''
      resolve({ err, contents })
    })
  })
}

export default async function handler(req, res) {
  const {
    query: { params },
  } = req
  const type = params[0]
  const name = params[1]

  const url = path.join(serverRuntimeConfig.PROJECT_ROOT, `./content/${type}/${name}.json`)
  let results = await fetchContentsFromFile(url)
  let status = results.err ? 404 : 200
  res.status(status).send(results.contents || '{}')
}