import express, { RequestHandler, NextFunction, Router } from 'express'
import createErrorUnsafe, { NamedConstructors } from 'http-errors'
const createError = createErrorUnsafe as NamedConstructors
import { UserinfoResponse } from 'openid-client'
const getUserClaimsUnsafe = require('express-openid-connect/lib/hooks/getUser')
const getUserClaims = getUserClaimsUnsafe as (
  req: OpenidRequest,
  config: A0Config
) => UserinfoResponse | undefined
import dotenv from 'dotenv'
import { env } from 'process'
import Wishlist from './models/wishlist'
import {
  auth,
  ConfigParams as A0Config,
  requiresAuth,
  OpenidRequest,
  unauthorizedHandler,
} from 'express-openid-connect'
import uuid, { uuid4 } from './util/uuid'

dotenv.config()
const PORT: number = parseInt(env['PORT'] || '3300')

const app = express()

interface Authorizer {
  (user: UserinfoResponse): boolean
}
function authorizeWith(authz: Authorizer | null = null): RequestHandler {
  const authorizer = authz || ((_) => true)
  return (
    rawReq: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    let req = rawReq as OpenidRequest
    if (req === null) {
      return next(
        new createError.Unauthorized(
          'Authentication is required for this resource.'
        )
      )
    }
    let userUnsafe = (req.openid as any).user
    if (!userUnsafe || !(userUnsafe as UserinfoResponse)) {
      return next(
        new createError.Unauthorized(
          'Authentication is required for this resource.'
        )
      )
    }
    let user = userUnsafe as UserinfoResponse
    if (!authorizer(user)) {
      return next(
        new createError.Forbidden('You are not authorized for this resource.')
      )
    } else {
      return next()
    }
  }
}
function requestUser(req: express.Request): UserinfoResponse | null {
  try {
    return ((req as OpenidRequest).openid as any).user as UserinfoResponse
  } catch {
    return null
  }
}
const router = express.Router()
router.get('/', (_, res) => {
  res.send('Got it!')
})
router.get('/2', authorizeWith(), (req, res) => {
  res.send(new Wishlist(undefined, 'test', requestUser(req)!.sub).toString())
})
router.get('/authtest', authorizeWith(), (req, res) => {
  let user = requestUser(req)!
  res.send(user)
})

if (env['OAUTH_SECRET'] !== undefined) {
  const authMiddleware = auth({
    required: false,
    errorOnRequiredAuth: false,
    auth0Logout: true,
    appSession: {
      secret: env['OAUTH_SECRET'],
    },
    getUser(
      req: OpenidRequest,
      config: A0Config
    ): UserinfoResponse | undefined {
      let maybeUser = getUserClaims(req, config)
      if (maybeUser) {
        let user = maybeUser as UserinfoResponse
        if (user) {
          // Actually manipulate the user data
          user.preferred_username =
            user.preferred_username ||
            user.nickname ||
            user.given_name ||
            user.name ||
            user.email
          return user
        } else return user
      } else return undefined
    },
    baseURL: 'http://localhost:3300',
    clientID: 'leqCRd11z1BGFUIYzTX71d8L6wbPjzJ4',
    issuerBaseURL: 'https://wishlist-app.auth0.com',
  })

  app.use(authMiddleware)
  app.use(router)
  app.use(unauthorizedHandler())
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
  })
} else {
  console.log('env+.env did not contain necessary variables.')
}

export default app
