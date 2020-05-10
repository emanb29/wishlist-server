import express from 'express'
import { unauthorizedHandler } from 'express-openid-connect'
import dotenv from 'dotenv'
import { env } from 'process'
import Wishlist from './models/wishlist'
import uuid, { uuid4 } from './util/uuid'
import {
  authorizeWith,
  requestUser,
  auth0Middleware,
} from './util/authorization'

dotenv.config()
const PORT: number = parseInt(env['PORT'] || '3300')

const app = express()
const router = express.Router()
router.get('/', (_, res) => {
  res.send('Got it!')
})
router.get('/2', authorizeWith(), (req, res) => {
  res.send(
    new Wishlist(
      uuid.v4() as uuid4,
      'test',
      null,
      requestUser(req)!.sub,
      null,
      [
        new Wishlist.Item(
          uuid.v4() as uuid4,
          'A thing I want',
          undefined,
          new URL('https://google.com/'),
          undefined,
          'Jefff'
        ),
      ]
    ).toString()
  )
})
router.get('/authtest', authorizeWith(), (req, res) => {
  let user = requestUser(req)!
  res.send(user)
})

if (env['OAUTH_SECRET'] !== undefined) {
  app.use(auth0Middleware)
  app.use(router)
  app.use(unauthorizedHandler())
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
  })
} else {
  console.log('env+.env did not contain necessary variables.')
}

export default app
