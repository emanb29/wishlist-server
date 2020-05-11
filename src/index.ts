import express, { ErrorRequestHandler, json } from 'express'
import { unauthorizedHandler } from 'express-openid-connect'
import env from './util/env'
import asyncHandler from 'express-async-handler'
import { Wishlist } from './models/wishlist'
import uuid, { uuid4, parseUUID, anyUUIDRegex } from './util/uuid'
import {
  authorizeWith,
  requestUser,
  auth0Middleware,
  allowCORSFrom,
} from './util/authorization'
import createHttpError from 'http-errors'
import {
  getWishlistById,
  getWishlistByUser,
  getWishlistByShortname,
} from './util/datastore'
import Exceptions from './util/exceptions'
import { parse } from 'sparkson'
import bodyParser from 'body-parser'
import { ListItem } from './models/listitem'
import registerSerializers from './util/serialization'

const PORT: number = parseInt(env['PORT'] || '3300')

const app = express()
const router = express.Router()
router.post(
  '/wishlist',
  authorizeWith(),
  bodyParser.json(),
  asyncHandler(async (req, res) => {
    const user = requestUser(req)!
    let parsed: Wishlist
    try {
      parsed = parse<Wishlist>(Wishlist, req.body)
    } catch {
      throw new createHttpError.BadRequest('Invalid Wishlist')
    }
    res.json(parsed)
    console.info(
      `${user.preferred_username} created the list ${parsed.shortname}`
    )
    throw new createHttpError.NotImplemented('committed nothing')
  })
)
router.get(
  `/wishlist/:listId(${anyUUIDRegex.source})`,
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
router.get(
  '/wishlist/at/:shortnamename',
  asyncHandler(async (req, _) => {
    const wlName = req.params['shortnamename']!
    try {
      await getWishlistByShortname(wlName)
    } catch (err) {
      if (err instanceof Exceptions.NoWishlistFound)
        throw new createHttpError.NotFound(err.message)
      else throw err
    }
    throw new createHttpError.NotImplemented()
  })
)
router.get(
  '/wishlist/by/:sub',
  asyncHandler(async (req, _) => {
    const ownerSub = req.params['sub']!
    try {
      await getWishlistByUser(ownerSub)
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
  res.json(
    new Wishlist(
      uuid.v4() as uuid4,
      'My test list',
      'test',
      'A list of stuff to test with',
      requestUser(req)!.sub,
      null!,
      [
        new ListItem(
          uuid.v4() as uuid4,
          'A thing I want',
          null!,
          new URL('https://google.com/'),
          null!,
          'Jefff'
        ),
      ]
    )
  )
})
// optionally-authenticated route
router.get('/3', (req, res) => {
  res.json(
    new Wishlist(
      uuid.v4() as uuid4,
      'test',
      'test',
      null!,
      requestUser(req)?.sub || 'admin',
      null!,
      []
    )
  )
})
router.get('/authtest', authorizeWith(), (req, res) => {
  let user = requestUser(req)!
  res.json(user)
})

if (env['OAUTH_SECRET'] && env['FIRESTORE_COLLECTION'] && env['FRONTEND_URL']) {
  registerSerializers()
  app.use(allowCORSFrom(env['FRONTEND_URL']))
  app.use(auth0Middleware)
  app.use(router)
  app.use(unauthorizedHandler())
  app.use(sanitizeExceptions)
  app.listen(PORT, () => {
    console.info(`Server is listening on ${PORT}`)
  })
} else {
  console.info('env+.env did not contain required variables.')
}

export default app
