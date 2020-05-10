import { uuid4 } from '../util/uuid'
class Wishlist {
  static Item = class {
    id: uuid4
    name: string
    description: string | null
    url: URL | null
    imageUrl: URL | null
    reservedBy: string | null
    constructor(
      id: uuid4,
      name: string,
      description: string | null,
      url: URL | null,
      imageUrl: URL | null,
      reservedBy: string | null
    ) {
      this.id = id
      this.name = name
      this.description = description
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
  description: string | null
  owner: string // a sub string of a user
  imageUrl: URL | null
  items: Array<Wishlist.Item>
  constructor(
    id: uuid4,
    name: string,
    description: string | null,
    owner: string,
    imageUrl: URL | null,
    items: Array<Wishlist.Item>
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.owner = owner
    this.imageUrl = imageUrl
    this.items = items
  }

  toString() {
    return `Wishlist(${JSON.stringify(this)})`
  }
}
namespace Wishlist {
  export type Item = InstanceType<typeof Wishlist.Item>
}
export default Wishlist
