import express, { RequestHandler, NextFunction } from 'express'
import { UserinfoResponse } from 'openid-client'
import {
  auth,
  ConfigParams as A0Config,
  OpenidRequest,
} from 'express-openid-connect'
import createHttpError from 'http-errors'
import env from './env'
import cors from 'cors'
import jwt from 'jsonwebtoken'

export function allowCORSFrom(domain: string): RequestHandler {
  return cors({
    origin: (origin, callback) => {
      callback(null, domain === origin)
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
}

// type-safing imports
const getUserClaimsUnsafe = require('express-openid-connect/lib/hooks/getUser')
const getUserClaims = getUserClaimsUnsafe as (
  req: OpenidRequest,
  config: A0Config
) => UserinfoResponse | undefined

// done type-safing imports

export interface Authorizer {
  (user: UserinfoResponse, request: OpenidRequest): boolean
}
export function authorizeWith(authz: Authorizer | null = null): RequestHandler {
  const authorizer: Authorizer = authz || ((_1, _2) => true)
  return (rawReq: express.Request, _: express.Response, next: NextFunction) => {
    let req = rawReq as OpenidRequest
    if (req === null) {
      return next(
        new createHttpError.Unauthorized(
          'Authentication is required for this resource.'
        )
      )
    }
    let userUnsafe = (req.openid as any).user
    if (!userUnsafe || !(userUnsafe as UserinfoResponse)) {
      return next(
        new createHttpError.Unauthorized(
          'Authentication is required for this resource.'
        )
      )
    }
    let user = userUnsafe as UserinfoResponse
    if (!authorizer(user, req)) {
      return next(
        new createHttpError.Forbidden(
          'You are not authorized for this resource.'
        )
      )
    } else {
      return next()
    }
  }
}

export function requestUser(req: express.Request): UserinfoResponse | null {
  try {
    return ((req as OpenidRequest).openid as any).user as UserinfoResponse
  } catch {
    return null
  }
}

function guessPreferredUsername(user: {
  preferred_username?: string
  nickname?: string
  given_name?: string
  name?: string
  email?: string
}): string | undefined {
  return (
    user.preferred_username ||
    user.nickname ||
    user.given_name ||
    user.name ||
    user.email
  )
}

export const auth0Middleware = auth({
  required: false,
  errorOnRequiredAuth: false,
  auth0Logout: true,
  appSession: {
    secret: env['OAUTH_SECRET'],
    cookieHttpOnly: true,
    cookieSameSite: "None",
    cookieSecure: env.NODE_ENV !== "development",
  },
  getUser(req: OpenidRequest, config: A0Config): UserinfoResponse | undefined {
    let maybeUser = getUserClaims(req, config)
    if (maybeUser) {
      let user = maybeUser as UserinfoResponse
      if (user) {
        // Actually manipulate the user data
        user.preferred_username = guessPreferredUsername(user)
        return user
      } else return user
    } else return undefined
  },
  baseURL: env['API_URL'], // TODO
  clientID: 'leqCRd11z1BGFUIYzTX71d8L6wbPjzJ4',
  issuerBaseURL: 'https://wishlist-app.auth0.com',
  handleCallback(req, res, next) {
    // TODO validate that something before this actually verifies the jwt
    try {
      const username = guessPreferredUsername(
        jwt.decode(req.openidTokens.id_token!) as any
      )
      res.cookie('authenticated', username)
      res.redirect(env['FRONTEND_URL']!)
    } catch (err) {
      console.warn(`Unexpected error trying to decode a login: ${err}`)
      return next()
    }
  },
})
