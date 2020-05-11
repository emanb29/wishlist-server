import { Field, Regexp } from 'sparkson'
import { uuid4, anyUUIDRegex } from '../util/uuid'
import { NullableUrl, NullableString } from '../util/serialization'

export class ListItem {
  constructor(
    @Field('id') @Regexp(anyUUIDRegex) public id: uuid4,
    @Field('name') public name: string,
    @Field('description', true, undefined, null)
    public description: NullableString,
    @Field('url', true, undefined, null) public url: NullableUrl,
    @Field('imageUrl', true, undefined, null) public imageUrl: NullableUrl,
    @Field('reservedBy', true, undefined, null)
    public reservedBy: NullableString
  ) {}

  toString() {
    return `Item(${JSON.stringify(this)})`
  }
}
export default ListItem
