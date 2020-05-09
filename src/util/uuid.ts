import * as uuid from 'uuid'
export type uuid1 = string & { _opaquetype: 'uuidv1' }
export type uuid2 = string & { _opaquetype: 'uuidv2' }
export type uuid3 = string & { _opaquetype: 'uuidv3' }
export type uuid4 = string & { _opaquetype: 'uuidv4' }
export type uuid5 = string & { _opaquetype: 'uuidv5' }
export default uuid
