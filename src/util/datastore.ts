import { Firestore } from '@google-cloud/firestore'
import env from './env'
import { anyUUID } from './uuid'
import Wishlist from '../models/wishlist'
import Exceptions from './exceptions'
export const storage = new Firestore() // data.
export const collection = storage.collection(env['FIRESTORE_COLLECTION']!)

export async function getWishlistById(id: anyUUID): Promise<Wishlist> {
  console.debug('in getwishlistbyid')
  let docs = (await collection.where('id', '==', id).get()).docs
  if (docs.length === 0) {
    throw new Exceptions.NoWishlistFound(
      `No wishlist exists with the provided ID`
    )
  } else if (docs.length > 1) {
    throw new Exceptions.NonUniqueWithlistId(
      `Multiple wishlists matched the provided ID`
    )
  }
  let [wishlist] = docs
  console.log(`list was ${wishlist.data()}`)
  return wishlist.data() as Wishlist
}
// export async function getWishlistByUser(sub: string): Promise<Wishlist> {

// }
