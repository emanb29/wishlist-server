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
export default Exceptions
