export type PrefillsBatchOrSingle = Array<PrefillDictionary | string | ResponseType>;

export type ResponseType = string | number;

export type PrefillType = 'DIRECT' | 'BY_TAG' | 'BY_NOTE';

export interface PrefillDictionary {
  [key: string]: ResponseType
}
