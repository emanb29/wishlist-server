class Wishlist {
  name: string
  // owner: uuid
  constructor(name: string) {
    this.name = name
  }

  toString() {
    return `Wishlist(${JSON.stringify(this)})`
  }
}
export default Wishlist
