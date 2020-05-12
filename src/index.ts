import express, { ErrorRequestHandler, json, response } from 'express'
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
  Authorizer,
} from './util/authorization'
import createHttpError from 'http-errors'
import {
  getWishlistById,
  getWishlistByUser,
  getWishlistByShortname,
  makeWishlist,
} from './util/datastore'
import Exceptions, { sanitizeExceptions } from './util/exceptions'
import { parse } from 'sparkson'
import bodyParser from 'body-parser'
import { ListItem } from './models/listitem'
import registerSerializers from './util/serialization'

const PORT: number = parseInt(env['PORT'] || '3300')

const userOwnsList: Authorizer = (user, req) =>
  req.body && req.body.owner && req.body.owner === user.sub

const app = express()
const router = express.Router()
router.post(
  '/wishlist',
  authorizeWith(), // authenticate
  bodyParser.json(),
  authorizeWith(userOwnsList), // authorize
  asyncHandler(async (req, res) => {
    const user = requestUser(req)!
    let parsed: Wishlist
    let roundtripped: Wishlist
    try {
      parsed = parse<Wishlist>(Wishlist, req.body)
    } catch {
      throw new createHttpError.BadRequest('Invalid Wishlist')
    }
    try {
      roundtripped = await makeWishlist(parsed)
    } catch (err) {
      throw new createHttpError.BadRequest(err.message)
    }
    res.status(201)
    res.json(roundtripped)
    console.info(
      `${user.preferred_username} created the list ${parsed.shortname}`
    )
  })
)
router.get(
  `/wishlist/:listId(${anyUUIDRegex.source})`,
  asyncHandler(async (req, res) => {
    const listId = parseUUID(req.params['listId'])
    let wishlist: Wishlist
    if (listId === null)
      throw new createHttpError.BadRequest(
        'The provided list ID was not a UUID'
      )
    try {
      wishlist = await getWishlistById(listId!)
    } catch (err) {
      if (err instanceof Exceptions.NoWishlistFound)
        throw new createHttpError.NotFound(err.message)
      else throw err
    }
    res.json(wishlist)
  })
)
router.get(
  '/wishlist/at/:shortname',
  asyncHandler(async (req, res) => {
    const wlName = req.params['shortname']!
    let wishlist: Wishlist
    try {
      wishlist = await getWishlistByShortname(wlName)
    } catch (err) {
      if (err instanceof Exceptions.NoWishlistFound)
        throw new createHttpError.NotFound(err.message)
      else throw err
    }
    res.json(wishlist)
  })
)
router.get(
  '/wishlist/by/:sub',
  asyncHandler(async (req, res) => {
    const ownerSub = req.params['sub']!
    let wishlist: Wishlist
    try {
      wishlist = await getWishlistByUser(ownerSub)
    } catch (err) {
      if (err instanceof Exceptions.NoWishlistFound)
        throw new createHttpError.NotFound(err.message)
      else throw err
    }
    res.json(wishlist)
  })
)
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
        new ListItem(
          uuid.v4() as uuid4,
          'Another thing I want',
          'This one has a description',
          new URL('https://yahoo.com/'),
          null!,
          'Jefff2'
        ),
        new ListItem(
          uuid.v4() as uuid4,
          'Third thing',
          'also described here',
          new URL('https://bing.com/'),
          null!,
          'Jefff3'
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
