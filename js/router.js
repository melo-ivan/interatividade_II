import { Templates } from './templates.js';

export class Router {
  constructor({routes = {}, rootEl, templates}) {
    this.routes = routes;
    this.rootEl = rootEl;
    this.templates = templates || new Templates();
    this._onHashChange = this._onHashChange.bind(this);
  }

  init() {
    window.addEventListener('hashchange', this._onHashChange);
    window.addEventListener('load', this._onHashChange);
    // delegate link clicks with data-link
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-link]');
      if (!a) return;
      // let hash-based routing happen automatically
    });
  }

  _onHashChange() {
    const hash = location.hash.replace('#','') || '/';
    const tmplId = this.routes[hash] || this.routes['/'];
    if (!tmplId) {
      this.rootEl.innerHTML = '<p>Rota não encontrada</p>';
      return;
    }
    this.rootEl.innerHTML = this.templates.render(tmplId);
    // after render run onmount hooks
    this._initView(hash);
  }

  _initView(route) {
    // if form route, try to restore draft
    if (route === '/form') {
      const form = document.getElementById('contactForm');
      if (!form) return;
      import('./storage.js').then(mod => {
        const { Storage } = mod;
        const draft = Storage.load('draft');
        if (draft) {
          Object.keys(draft).forEach(k => {
            const el = form.elements.namedItem(k);
            if (el) el.value = draft[k];
          });
        }
      });
    }
  }
}
