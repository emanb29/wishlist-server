import express, { ErrorRequestHandler, json, response } from 'express'
import { unauthorizedHandler } from 'express-openid-connect'
import env from './util/env'
import asyncHandler from 'express-async-handler'
import { Wishlist } from './models/wishlist'
import uuid, { uuid4, parseUUID, containsAnyUUIDRegex } from './util/uuid'
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
  addWishlist,
  updateWishlist,
  updateReservation,
} from './util/datastore'
import Exceptions, { sanitizeExceptions } from './util/exceptions'
import { parse } from 'sparkson'
import bodyParser from 'body-parser'
import { ListItem, Reservation } from './models/listitem'
import registerSerializers, { NullableString } from './util/serialization'

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
    let list: Wishlist
    let savedList: Wishlist
    try {
      list = parse<Wishlist>(Wishlist, req.body)
    } catch {
      throw new createHttpError.BadRequest('Invalid Wishlist')
    }
    try {
      savedList = await addWishlist(list)
    } catch (err) {
      throw new createHttpError.BadRequest(err.message)
    }
    res.status(201)
    res.json(savedList)
    console.info(
      `${user.preferred_username} created the list ${list.shortname}`
    )
  })
)
router.put(
  `/wishlist/:listId(${containsAnyUUIDRegex.source})`,
  authorizeWith(), // authenticate
  bodyParser.json(),
  authorizeWith(userOwnsList), // authorize
  asyncHandler(async (req, res) => {
    const listId = parseUUID(req.params['listId'])
    if (listId === null)
      throw new createHttpError.BadRequest(
        'The provided list ID was not a UUID'
      )
    let list: Wishlist
    let savedList: Wishlist
    try {
      list = parse<Wishlist>(Wishlist, req.body)
    } catch {
      throw new createHttpError.BadRequest('Invalid Wishlist')
    }
    try {
      savedList = await updateWishlist(listId!, list)
    } catch (err) {
      if (err instanceof Exceptions.NoWishlistFound)
        throw new createHttpError.NotFound(err.message)
      else throw err
    }
    res.json(savedList)
  })
)
router.put(
  `/wishlist/:listId(${containsAnyUUIDRegex.source})/:itemId(${containsAnyUUIDRegex.source})/reservation`,
  bodyParser.json(),
  asyncHandler(async (req, res) => {
    const listId = parseUUID(req.params['listId'])
    const itemId = parseUUID(req.params['itemId'])
    if (listId === null)
      throw new createHttpError.BadRequest(
        'The provided list ID was not a UUID'
      )
    if (itemId === null)
      throw new createHttpError.BadRequest(
        'The provided item ID was not a UUID'
      )
    let newReservation: Reservation
    try {
      newReservation = parse(Reservation, req.body)
    } catch {
      throw new createHttpError.BadRequest('Invalid Reservation')
    }
    let savedList = await updateReservation(
      listId,
      (itemId as string) as uuid4,
      newReservation.reservedBy as string | null
    )
    res.json(savedList)
  })
)
router.get(
  `/wishlist/:listId(${containsAnyUUIDRegex.source})`,
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
router.get('/me', authorizeWith(), (req, res) => {
  const user = requestUser(req)!
  res.json(user)
})

if (env['OAUTH_SECRET'] && env['FIRESTORE_COLLECTION'] && env['FRONTEND_URL']) {
  registerSerializers()
  app.use(allowCORSFrom(env['FRONTEND_URL']))
  app.use(auth0Middleware)
  app.use(router)
  app.use(unauthorizedHandler())
  app.use(sanitizeExceptions)
  if (env['NODE_ENV'] && env['NODE_ENV'] === 'development') {
    // GCF does the listen() for us in prod
    app.listen(PORT, () => {
      console.info(`Server is listening on ${PORT}`)
    })
  }
} else {
  console.error('env+.env did not contain required variables.')
}
export const wishlist = app
export default app
