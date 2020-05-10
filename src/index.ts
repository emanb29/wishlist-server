import express from 'express'
import { unauthorizedHandler } from 'express-openid-connect'
import env from './util/env'
import asyncHandler from 'express-async-handler'
import Wishlist from './models/wishlist'
import uuid, { uuid4 } from './util/uuid'
import {
  authorizeWith,
  requestUser,
  auth0Middleware,
} from './util/authorization'
import createHttpError from 'http-errors'
import { getWishlistById } from './util/datastore'

const PORT: number = parseInt(env['PORT'] || '3300')

const app = express()
const router = express.Router()
router.get(
  '/wishlist/:listId',
  asyncHandler(async (req, res) => {
    await getWishlistById(req.params['listId'] as uuid4)
    throw new createHttpError.NotImplemented()
  })
)
// trivial route
router.get('/', (_, res) => {
  res.send('Got it!')
})
// authenticated route
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
          null,
          new URL('https://google.com/'),
          null,
          'Jefff'
        ),
      ]
    ).toString()
  )
})
// optionally-authenticated route
router.get('/3', (req, res) => {
  res.send(
    new Wishlist(
      uuid.v4() as uuid4,
      'test',
      null,
      requestUser(req)?.sub || 'admin',
      null,
      []
    ).toString()
  )
})
router.get('/authtest', authorizeWith(), (req, res) => {
  let user = requestUser(req)!
  res.send(user)
})

if (env['OAUTH_SECRET'] !== undefined || env['FIRESTORE_COLLECTION']) {
  app.use(auth0Middleware)
  app.use(router)
  app.use(unauthorizedHandler())
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
  })
} else {
  console.log('env+.env did not contain required variables.')
}

export default app
