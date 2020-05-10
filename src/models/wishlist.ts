import uuid, { uuid4 } from '../util/uuid'
export default class Wishlist {
  static Item = class {
    id: uuid4
    name: string
    url: URL | null
    imageUrl: URL | null
    reservedBy: string | null
    constructor(id: uuid4, name: string, url: URL | null = null, imageUrl: URL | null = null, reservedBy: string | null = null) {
      this.id = id
      this.name = name
      this.url = url
      this.imageUrl = imageUrl
      this.reservedBy = reservedBy
    }
    toString() {
      return `Item(${JSON.stringify(this)})`
    }
  }

  id: uuid4
  name: string
  owner: string // a sub string of a user
  items: Array<Wishlist.Item>
  constructor(id: uuid4, name: string, owner: string, items: Array<Wishlist.Item>) {
    this.name = name
    this.owner = owner
    this.id = id
    this.items = items
  }

  toString() {
    return `Wishlist(${JSON.stringify(this)})`
  }
}
export namespace Wishlist {
  export type Item = InstanceType<typeof Wishlist.Item>
}
