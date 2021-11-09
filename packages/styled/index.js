import React from 'react';
import tags from './tags';

function snakeToCamel(snake) {
  return snake.replace(/-([a-z])/g, (_, p1) => p1.toUpperCase());
}

/**
 * @arg {string} css
 * @return {{ [k: string]: string }}
 */
function parseCss(css) {
  return Object.fromEntries(
    css
      .split(';')
      .filter(x => x)
      .map(s => s.split(':').map(v => v.trim()))
      .map(([styleName, styleValue]) => [snakeToCamel(styleName), styleValue]),
  );
}

function processTemplate(strings, args, props) {
  return strings.slice(1).reduce((acc, v, i) => {
    const arg = args[i];
    return acc + (typeof arg === 'function' ? arg(props) : arg) + v;
  }, strings[0]);
}

const createStyledComponent =
  tag =>
  (strings, ...args) => {
    return props => {
      const css = processTemplate(strings, args, props);
      return React.createElement(tag, {
        ...props,
        style: {
          ...parseCss(css),
          /* eslint-disable-next-line react/prop-types, react/destructuring-assignment */
          ...props.style,
        },
      });
    };
  };

const extend = Base => createStyledComponent(Base);

const styled = tags.reduce((acc, tag) => {
  acc[tag] = createStyledComponent(tag);
  return acc;
}, extend);

export default styled;
