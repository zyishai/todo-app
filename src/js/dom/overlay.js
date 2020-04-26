import { DomUtils } from './utils';

export class Overlay {
    static getOverlay() {
        return DomUtils._getDOMElement('.overlay');
    }
    static show() {
        this.getOverlay().classList.add('active');
    }
    static hide() {
        this.getOverlay().classList.remove('active');
    }
}