import createHttpError from "http-errors"
import { ErrorRequestHandler } from "express"

export interface Exception {
  message: string
  __isWishlistException__: null
}
abstract class BaseException implements Exception {
  __isWishlistException__ = null
  message: string
  constructor(message: string) {
    this.message = message
  }
}
export class NoWishlistFound extends BaseException {}
export class NonUniqueWithlistId extends BaseException {}

export const Exceptions = {
  NoWishlistFound,
  NonUniqueWithlistId,
}

export const sanitizeExceptions: ErrorRequestHandler = (err, req, res, next) => {
  if (err && '__isWishlistException__' in err) {
    return next(
      new createHttpError.InternalServerError(
        'An error occured while processing your request'
      )
    )
  } else return next(err)
}
export default Exceptions
