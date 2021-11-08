import React from 'react';
/* eslint-disable-next-line import/extensions,import/no-unresolved */
import tags from './tags';

function parseCss(css) {
  return Object.fromEntries(
    css
      .split(';')
      .filter(x => x)
      .map(s => s.split(':').map(v => v.trim()))
      .map(([k, v]) => [
        k.replace(/-([a-z])/g, (_, p1) => p1.toUpperCase()),
        v,
      ]),
  );
}

function processTemplate(strings, args, props) {
  return strings.slice(1).reduce((acc, v, i) => {
    const arg = args[i];
    return acc + (typeof arg === 'function' ? arg(props) : arg) + v;
  }, strings[0]);
}

const styled = tags.reduce((acc, tag) => {
  return {
    ...acc,
    /* eslint-disable-next-line no-unused-vars */
    [tag]: (strings, ...args) => {
      /* eslint-disable-next-line react/prop-types */
      return props => {
        const css = processTemplate(strings, args, props);
        return React.createElement(
          tag,
          {
            ...props,
            style: parseCss(css),
          },
          /* eslint-disable-next-line react/prop-types, react/destructuring-assignment */
          props.children,
        );
      };
    },
  };
}, {});

export default styled;
