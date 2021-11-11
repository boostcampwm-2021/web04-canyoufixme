import { Viewer } from '@toast-ui/react-editor';
import type { RefObject } from 'react';

export default class FullWidthViewer extends Viewer {
  componentDidMount(this: { rootEl: RefObject<HTMLElement> }) {
    Viewer.prototype.componentDidMount?.call(this);
    const rootElement = this.rootEl.current;
    rootElement?.style.setProperty('width', '100%');
    rootElement?.style.setProperty('background-color', '#2F333C');
  }
}
