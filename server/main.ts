import fs from 'fs'
import path from 'path'
import polka from 'polka'
import serveStatic from 'serve-static'

const app = polka()

const serveBuildFolder = serveStatic(path.join(__dirname, '../build'), {})

app.use((req, res, next) => {
  if (req.path === '/') {
    return next()
  }
  return serveBuildFolder(req, res, next)
})

const indexHTML = fs.readFileSync(
  path.join(__dirname, '../build/index.html'),
  'utf8',
)

// TODO: server-render `<head>` tags for Google bots / Discord / Telegram etc..

app.get('/*', (req, res) => {
  res.setHeader('content-type', 'text/html')
  res.end(indexHTML)
})

app.listen(process.env.PORT || 3000)
