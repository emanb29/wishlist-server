import { uuid4, anyUUIDRegex } from '../util/uuid'
import { ArrayField, Field, Regexp } from 'sparkson'
import ListItem from './listitem'
import { NullableUrl, NullableString } from '../util/serialization'

export class Wishlist {
  static Item = ListItem
  constructor(
    @Field('id') @Regexp(anyUUIDRegex) public id: uuid4,
    @Field('name') public name: string,
    @Field('shortname') public shortname: string, // The URL shortname of the list
    @Field('description', true, undefined, null)
    public description: NullableString,
    @Field('owner') public owner: string, // a sub string of a user
    @Field('imageUrl', true, undefined, null) public imageUrl: NullableUrl,
    @ArrayField('items', ListItem) public items: Array<ListItem>
  ) {}

  toString() {
    return `Wishlist(${JSON.stringify(this)})`
  }
}
export default Wishlist
