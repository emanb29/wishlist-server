import uuid, { uuid4 } from '../util/uuid'
class Wishlist {
  id: uuid4
  name: string
  owner: string // a sub string of a user
  constructor(id: uuid4 = uuid.v4() as uuid4, name: string, owner: string) {
    this.name = name
    this.owner = owner
    this.id = id
  }

  toString() {
    return `Wishlist(${JSON.stringify(this)})`
  }
}
export default Wishlist
