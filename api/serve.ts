import fs from 'fs'
import polka from 'polka'

const app = polka()

const indexHTML = fs.readFileSync('build/index.html', 'utf8')

app.get('/*', (req, res) => {
  res.send(indexHTML)
})

export default app
