import { tags } from './index';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Props = { [key: string]: any };
type StyledComponent = (
  strings: TemplateStringsArray,
  ...args
) => React.FC<Props>;

namespace styled {
  export const button: StyledComponent;
  export const div: StyledComponent;
  export const header: StyledComponent;
  export const img: StyledComponent;
  export const nav: StyledComponent;
}

export default styled;
