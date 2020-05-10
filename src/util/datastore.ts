import { Firestore, DocumentData } from '@google-cloud/firestore'
import env from './env'
import { uuid4 } from './uuid'
import Wishlist from '../models/wishlist'
import createHttpError from 'http-errors'
export const storage = new Firestore() // data.
export const collection = storage.collection(env['FIRESTORE_COLLECTION']!)

export async function getWishlistById(id: uuid4): Promise<Wishlist> {
  let docs = (await collection.where('id', '==', id).get()).docs
  if (docs.length === 0) {
    throw new createHttpError.NotFound(
      `No wishlist exists with the provided ID`
    )
  } else if (docs.length > 1) {
    throw new createHttpError.InternalServerError(
      `Multiple wishlists matched the provided ID`
    )
  }
  let [wishlist] = docs
  console.log(`list was ${wishlist.data()}`)
  return wishlist.data() as Wishlist
}
