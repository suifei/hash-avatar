// <HashAvatar name="flynn" race="cat" size={96} /> for React >= 16.8. Renders the SVG inline, so animation and the hover card effect work.
import { createElement, useMemo } from 'react';
import HA from '../src/hash-avatar.js';

const KEYS = ['gender', 'age', 'race', 'art', 'size', 'salt', 'fingerprint', 'animate', 'qr'];

export function HashAvatar(props) {
  const { name = '', title, style } = props;
  const vals = KEYS.map(k => props[k]);
  const html = useMemo(() => {
    const o = {};
    KEYS.forEach((k, i) => { o[k] = k === 'size' && vals[i] != null ? +vals[i] : vals[i]; });
    return HA.svg(name, o);
  }, [name].concat(vals)); // eslint-disable-line react-hooks/exhaustive-deps
  const rest = {};
  for (const k in props) if (k !== 'name' && k !== 'title' && k !== 'style' && KEYS.indexOf(k) < 0) rest[k] = props[k];
  return createElement('span', Object.assign(rest, {
    role: 'img', 'aria-label': title != null ? title : name, title,
    style: Object.assign({ display: 'inline-block', lineHeight: 0, verticalAlign: 'middle' }, style),
    dangerouslySetInnerHTML: { __html: html },
  }));
}
export default HashAvatar;
