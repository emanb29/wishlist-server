import express from 'express'
import { env } from 'process'
const app = express()

const PORT: number = parseInt(env['PORT'] || '3300')

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
app.get('/', (req, res) => {
  res.send("Got it!")
})

export default app
