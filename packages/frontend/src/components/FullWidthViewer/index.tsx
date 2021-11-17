import { Viewer } from '@toast-ui/react-editor';
import styles from './styles.module.css';
import type { RefObject } from 'react';

export default class FullWidthViewer extends Viewer {
  componentDidMount(this: { rootEl: RefObject<HTMLElement> }) {
    Viewer.prototype.componentDidMount?.call(this);
    const rootElement = this.rootEl.current;
    rootElement?.classList.add(styles.fullWidthViewer);
  }
}
