export class Templates {
  constructor() {
    // cache
    this.cache = {};
  }

  render(tmplId) {
    if (!this.cache[tmplId]) {
      const t = document.getElementById(tmplId);
      if (!t) return `<div>Template ${tmplId} não encontrado</div>`;
      this.cache[tmplId] = t.innerHTML;
    }
    return this.cache[tmplId];
  }
}
