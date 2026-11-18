import type { FC, HTMLAttributes } from 'react';
import type { Options } from '../src/hash-avatar';

export interface HashAvatarProps extends Omit<Options, 'size'>, Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** name or email; the avatar is derived from its SHA-256 */
  name: string;
  /** width and height in px. Default 256 */
  size?: number | string;
  /** accessible label; defaults to name */
  title?: string;
}
export declare const HashAvatar: FC<HashAvatarProps>;
export default HashAvatar;
