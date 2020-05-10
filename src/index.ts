import express, { ErrorRequestHandler } from 'express'
import { unauthorizedHandler } from 'express-openid-connect'
import env from './util/env'
import asyncHandler from 'express-async-handler'
import Wishlist from './models/wishlist'
import uuid, { uuid4, parseUUID } from './util/uuid'
import {
  authorizeWith,
  requestUser,
  auth0Middleware,
} from './util/authorization'
import createHttpError from 'http-errors'
import { getWishlistById } from './util/datastore'
import Exceptions from './util/exceptions'

const PORT: number = parseInt(env['PORT'] || '3300')

const app = express()
const router = express.Router()
router.get(
  '/wishlist/:listId',
  asyncHandler(async (req, _) => {
    const listId = parseUUID(req.params['listId'])
    if (listId === null)
      throw new createHttpError.BadRequest(
        'The provided list ID was not a UUID'
      )
    try {
      await getWishlistById(listId!)
    } catch (err) {
      if (err instanceof Exceptions.NoWishlistFound)
        throw new createHttpError.NotFound(err.message)
      else throw err
    }
    throw new createHttpError.NotImplemented()
  })
)
const sanitizeExceptions: ErrorRequestHandler = (err, req, res, next) => {
  if (err && '__isWishlistException__' in err) {
    return next(
      new createHttpError.InternalServerError(
        'An error occured while processing your request'
      )
    )
  } else return next(err)
}
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
  app.use(sanitizeExceptions)
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
  })
} else {
  console.log('env+.env did not contain required variables.')
}

export default app
