// Type definitions for @suifei/hash-avatar
export type Gender = 'male' | 'female' | 'neutral';
export type Age = 'baby' | 'teen' | 'youth' | 'middle' | 'old';
export type Race =
  | 'asian'
  | 'white'
  | 'black'
  | 'brown'
  | 'southasian'
  | 'seasian'
  | 'mideast'
  | 'latino'
  | 'indigenous'
  | 'pacific'
  | 'auto'
  | 'elf'
  | 'orc'
  | 'vampire'
  | 'zombie'
  | 'oni'
  | 'demon'
  | 'angel'
  | 'cyborg'
  | 'goblin'
  | 'troll'
  | 'mermaid'
  | 'fairy'
  | 'tengu'
  | 'jinn'
  | 'mummy'
  | 'android'
  | 'hologram'
  | 'cat'
  | 'dog'
  | 'fox'
  | 'kitsune'
  | 'panda'
  | 'rabbit'
  | 'bear'
  | 'owl'
  | 'penguin'
  | 'frog'
  | 'monkey'
  | 'dragon'
  | 'robot'
  | 'ai'
  | 'alien'
  | 'ghost'
  | 'skeleton'
  | 'slime'
  | 'mouse'
  | 'ox'
  | 'tiger'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'rooster'
  | 'pig'
  | 'lion'
  | 'wolf'
  | 'koala'
  | 'deer'
  | 'elephant'
  | 'raccoon'
  | 'redpanda'
  | 'hamster'
  | 'sheep'
  | 'duck'
  | 'parrot'
  | 'chick'
  | 'giraffe'
  | 'zebra'
  | 'leopard'
  | 'capybara'
  | 'hedgehog'
  | 'octopus'
  | 'bee'
  | 'qilin'
  | 'phoenix'
  | 'unicorn'
  | 'nian'
  | 'tanuki'
  | 'yeti'
  | 'werewolf'
  | 'golem'
  | 'insectoid'
  | 'mushroom'
  | 'pumpkin'
  | 'snowman'
  | 'cactus'
  | 'star'
  | 'any';
export type Art = 'flat' | 'pixel' | 'ink' | 'comic' | 'sketch' | 'neon' | 'pop' | 'mood' | 'watercolor' | 'glitch';

export interface Options {
  /** default 'neutral' */
  gender?: Gender;
  /** default 'youth' */
  age?: Age;
  /** default 'auto' (human, any palette); 'any' lets the hash pick a species */
  race?: Race;
  /** default 'flat' */
  art?: Art;
  /** width and height in px; the viewBox is always 256. Default 256 */
  size?: number;
  /** secret salt; use one on the server when showing avatars of emails publicly */
  salt?: string;
  /** draw the 128-bit fingerprint ring. Default true */
  fingerprint?: boolean;
  /** hash-driven animation. Default true */
  animate?: boolean;
  /** put the avatar in the middle of a QR code that encodes this text (up to 1273 bytes) */
  qr?: string;
}

export function svg(input: string, options?: Options): string;
export function hash(input: string, salt?: string): { input: string; bytes: Uint8Array; hex: string };
export function normalize(input: string): string;
export function sha256(bytes: Uint8Array | ArrayLike<number>): Uint8Array;
export function qrMatrix(text: string, minVersion?: number): number[][];
export const GENDERS: Gender[];
export const AGES: Age[];
export const RACES: Race[];
export const ARTS: Art[];
export const GROUPS: { human: Race[]; fantasy: Race[]; animal: Race[]; scifi: Race[] };
export const version: 'v1';

declare const HashAvatar: {
  svg: typeof svg; hash: typeof hash; normalize: typeof normalize; sha256: typeof sha256; qrMatrix: typeof qrMatrix;
  GENDERS: typeof GENDERS; AGES: typeof AGES; RACES: typeof RACES; ARTS: typeof ARTS; GROUPS: typeof GROUPS; version: typeof version;
};
export default HashAvatar;
