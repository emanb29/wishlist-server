import * as uuid from 'uuid'
export type uuid1 = string & { _opaquetype: 'uuidv1' }
export type uuid3 = string & { _opaquetype: 'uuidv3' }
export type uuid4 = string & { _opaquetype: 'uuidv4' }
export type uuid5 = string & { _opaquetype: 'uuidv5' }
export type anyUUID = uuid1 | uuid3 | uuid4 | uuid5

// adapted from https://stackoverflow.com/a/38191078
export const v1regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
export const v3regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
export const v4regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
export const v5regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
export const anyUUIDRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[1345][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
export const containsAnyUUIDRegex = /[0-9A-F]{8}-[0-9A-F]{4}-[1345][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i
export function parseUUID(uuid: string): uuid1 | uuid3 | uuid4 | uuid5 | null {
  if (v1regex.test(uuid)) return uuid as uuid1
  else if (v3regex.test(uuid)) return uuid as uuid3
  else if (v4regex.test(uuid)) return uuid as uuid4
  else if (v5regex.test(uuid)) return uuid as uuid5
  else return null
}
export default uuid
