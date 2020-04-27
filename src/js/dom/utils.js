import { html } from 'lit-html';

export class DomUtils {
    static _getDOMElement(selector) {
        return document.querySelector(selector);
   }
   static _getAllDOMElements(selector) {
       return document.querySelectorAll(selector);
   }
   static _createDOMElement(fn){
       return (...args) => html`${fn(html, ...args)}`;
   }
   static _addEventListener(element, event, fn, opts){
       return element.addEventListener(event, fn, opts);
   }
}