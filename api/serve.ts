import fs from 'fs'
import path from 'path'
import polka from 'polka'

const app = polka()

const indexHTML = fs.readFileSync(
  path.join(__dirname, '../build/index.html'),
  'utf8',
)

app.get('/*', (req, res) => {
  res.send(indexHTML)
})

export default app
