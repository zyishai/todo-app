class Router {
  /**
   * @param {Array} routes array of route objects.
   * Each path should start with a '/'.
   */
  constructor(routes) {
    this.routes = routes;
  }

  loadRoute(path, params) {
    const matchedRoute = this.routes.find(
      (route) => route.path.slice(1) === path,
    );

    return matchedRoute.template(params, (path, overridenParams = {}) =>
      this.loadRoute(path, {...params, ...overridenParams}),
    );
  }
}

export {Router};

// *** example usage: ***x
// import {html} from 'lit-html';
// const routes = [
//   {
//     route: '',
//     template: (_, redirect) => {
//       if (loggedIn()) {
//         return redirect('/home');
//       } else {
//         return redirect('/guest');
//       }
//     },
//   },
//   {
//     route: 'guest',
//     template: (credentials) => {
//       if (login(...credentials)) { // { username: string, password: string, persist: boolean }
//         return redirect('/home');
//       } else {
//         throw new Error('login failed.');
//       }
//     },
//   },
//   {
//     route: 'home',
//     template: () => html``,
//   },
// ];
// const router = new Router(routes);
// router.loadRoute(''); // render /guest if not logged in or /home if logged in.
