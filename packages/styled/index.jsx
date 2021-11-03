import React from 'react';

export const tags = [
  'a',
  'abbr',
  'address',
  'article',
  'aside',
  'audio',
  'b',
  'bdo',
  'bdi',
  'blockquote',
  'br',
  'button',
  'canvas',
  'cite',
  'code',
  'command',
  'data',
  'datalist',
  'del',
  'details',
  'dfn',
  'div',
  'dl',
  'em',
  'embed',
  'fieldset',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'main',
  'map',
  'mark',
  'math',
  'menu',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'output',
  'p',
  'picture',
  'pre',
  'progress',
  'q',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'svg',
  'table',
  'template',
  'textarea',
  'time',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
];

const styled = tags.reduce((acc, tag) => {
  return {
    ...acc,
    /* eslint-disable-next-line no-unused-vars */
    [tag]: (strings, ...args) => {
      /* eslint-disable-next-line react/prop-types */
      return props => {
        return React.createElement(
          tag,
          {
            ...props,
            style: Object.fromEntries(
              strings
                .join('')
                .split(';')
                .filter(x => x)
                .map(s => s.split(':').map(v => v.trim()))
                .map(([k, v]) => [
                  k.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase()),
                  v,
                ]),
            ),
          },
          /* eslint-disable-next-line react/prop-types, react/destructuring-assignment */
          props.children,
        );
      };
    },
  };
}, {});

export default styled;
