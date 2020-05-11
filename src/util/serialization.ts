import { registerStringMapper } from 'sparkson'

export function registerSerializers() {
  registerStringMapper(NullableUrl, (val: string) => new URL(val))
  registerStringMapper(NullableString, (val: string) => val)
}
// A very weird artefact of these Nullable types is that if you want to pass them null, you have to assert that it is not null (nulL!)
export class NullableUrl extends URL {
  static type = 'NullableUrl'
}
export class NullableString extends String {
  static type = 'NullableString'
}
export default registerSerializers
