import {expect} from 'chai';
import {html} from 'lit-html';
import {Router} from '../src/js/dom/router';

test('calling loadRoute should return the template', () => {
  const router = new Router([
    {
      path: '/',
      template: () => html`<h1>intro</h1>`,
    },
  ]);

  expect(router.loadRoute('')).to.deep.equal(html`<h1>intro</h1>`);
});
test('calling redirected route should redirect successfully', () => {
  const router = new Router([
    {
      path: '/redirect',
      template: (_, redirect) => redirect('proxied'),
    },
    {
      path: '/proxied',
      template: () => html`<h1>proxied</h1>`,
    },
  ]);

  expect(router.loadRoute('redirect')).to.deep.equal(html`<h1>proxied</h1>`);
});
test('calling loadRoute with params should pass the params to the template', () => {
  const router = new Router([
    {
      path: '/',
      template: (params) => html`<h1>${params.title}</h1>`,
    },
  ]);

  expect(router.loadRoute('', {title: 'test'})).to.deep.equal(
    ((title) => html`<h1>${title}</h1>`)('test'),
  );
});
test('calling loadRoute with params and redirect should pass the params to the redirect function', () => {
  const router = new Router([
    {
      path: '/redirect',
      template: (params, redirect) => redirect('proxied'),
    },
    {
      path: '/proxied',
      template: (params) => html`<h1>${params.title}</h1>`,
    },
  ]);

  expect(router.loadRoute('redirect', {title: 'test'})).to.deep.equal(
    ((title) => html`<h1>${title}</h1>`)('test'),
  );
});
test('redirecting with new params should override the original params', () => {
  const router = new Router([
    {
      path: '/redirect',
      template: (params, redirect) =>
        redirect('proxied', {title: 'redirected'}),
    },
    {
      path: '/proxied',
      template: (params) => html`<h1>${params.title}</h1>`,
    },
  ]);

  expect(router.loadRoute('redirect', {title: 'test'})).to.deep.equal(
    ((title) => html`<h1>${title}</h1>`)('redirected'),
  );
});
