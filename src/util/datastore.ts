import { Firestore } from '@google-cloud/firestore'
import env from './env'
import { anyUUID, uuid4 } from './uuid'
import Wishlist from '../models/wishlist'
import Exceptions from './exceptions'
import { untype } from './serialization'
export const storage = new Firestore() // data.
export const collection = storage.collection(env['FIRESTORE_COLLECTION']!)

export async function getWishlistById(id: anyUUID): Promise<Wishlist> {
  let docs = (await collection.where('id', '==', id).get()).docs
  if (docs.length === 0) {
    throw new Exceptions.NoWishlistFound(
      `No wishlist exists with the provided ID`
    )
  } else if (docs.length > 1) {
    throw new Exceptions.NonUniqueWishlistId(
      `Multiple wishlists matched the provided ID`
    )
  }
  let [wishlist] = docs
  return wishlist.data() as Wishlist
}
export async function getWishlistByUser(sub: string): Promise<Wishlist> {
  let docs = (await collection.where('owner', '==', sub).get()).docs
  if (docs.length === 0) {
    throw new Exceptions.NoWishlistFound(
      `No wishlist exists by the provided user`
    )
  } else if (docs.length > 1) {
    throw new Exceptions.NonUniqueWishlistId(
      `Multiple wishlists were found matching the provided user`
    )
  }
  let [wishlist] = docs
  return wishlist.data() as Wishlist
}
export async function getWishlistByShortname(name: string): Promise<Wishlist> {
  let docs = (await collection.where('shortname', '==', name).get()).docs
  if (docs.length === 0) {
    throw new Exceptions.NoWishlistFound(
      `No wishlist exists with the provided short name`
    )
  } else if (docs.length > 1) {
    throw new Exceptions.NonUniqueWishlistId(
      `Multiple wishlists were found matching the provided short name`
    )
  }
  let [wishlist] = docs
  return wishlist.data() as Wishlist
}

export async function addWishlist(list: Wishlist): Promise<Wishlist> {
  let noCollisions =
    (await (
      await collection.where('shortname', '==', list.shortname).limit(1).get()
    ).empty) &&
    (await (await collection.where('id', '==', list.id).limit(1).get())
      .empty) &&
    (await (await collection.where('owner', '==', list.owner).limit(1).get())
      .empty)
  if (noCollisions) {
    console.debug(`uploading new wishlist ${list}`)
    return (await (await collection.add(untype(list))).get()).data() as Wishlist
  } else {
    throw new Exceptions.ConflictingWishlistFound(
      'The wishlist provided had either a duplicate shortname, owner, or id'
    )
  }
}
export async function updateWishlist(
  id: anyUUID,
  newList: Wishlist
): Promise<Wishlist> {
  let noCollisions = await (
    await collection
      .where('shortname', '==', newList.shortname) // ensure we aren't overwriting another existing list
      .limit(2)
      .get()
  ).docs.every((doc) => doc.data().owner === newList.owner)
  if (!noCollisions) {
    throw new Exceptions.ConflictingWishlistFound(
      'There is already a wishlist with that shortname'
    )
  }
  let docs = (
    await collection
      .where('owner', '==', newList.owner)
      .where('id', '==', id) // ensure we aren't overwriting someone else's list
      .get()
  ).docs
  if (docs.length === 0) {
    throw new Exceptions.NoWishlistFound(
      `No wishlist exists with the provided ID`
    )
  } else if (docs.length > 1) {
    throw new Exceptions.NonUniqueWishlistId(
      `Multiple wishlists matched the provided ID`
    )
  }
  let [oldList] = docs
  await oldList.ref.set(untype(newList))

  return newList
}
export async function updateReservation(
  listId: anyUUID,
  itemId: uuid4,
  reservedBy: string | null
): Promise<Wishlist> {
  let docs = (await collection.where('id', '==', listId).get()).docs
  if (docs.length === 0) {
    throw new Exceptions.NoWishlistFound(
      `No wishlist exists with the provided ID`
    )
  } else if (docs.length > 1) {
    throw new Exceptions.NonUniqueWishlistId(
      `Multiple wishlists matched the provided ID`
    )
  }
  let wishlist = docs[0].data() as Wishlist
  let itemIdx = wishlist.items.findIndex((li) => li.id === itemId)
  if (itemIdx == -1) {
    throw new Exceptions.NoItemFound(
      `Could not find any item with ID ${itemId} in wishlist ${listId}`
    )
  }
  wishlist.items[itemIdx].reservedBy = reservedBy! // mutation
  return updateWishlist(listId, wishlist)
}
