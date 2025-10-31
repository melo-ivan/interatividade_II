import { Router } from './router.js';
import { Templates } from './templates.js';
import { Validator } from './validator.js';
import { Storage } from './storage.js';

const appEl = document.getElementById('app');

const router = new Router({
  routes: {
    '/': 'tmpl-home',
    '/form': 'tmpl-form',
    '/about': 'tmpl-about'
  },
  rootEl: appEl,
  templates: new Templates()
});

router.init();

// global handlers (delegation)
document.addEventListener('submit', async (ev) => {
  const form = ev.target;
  if (form && form.id === 'contactForm') {
    ev.preventDefault();
    const validator = new Validator(form);
    const valid = validator.validate();
    const messagesEl = document.getElementById('formMessages');
    messagesEl.innerHTML = '';
    if (!valid) {
      validator.focusFirstInvalid();
      showCentralError('Corrija os campos destacados');
      return;
    }
    // on valid: persist and show success
    const data = Object.fromEntries(new FormData(form));
    Storage.save('submission', data);
    messagesEl.innerHTML = '<p class="hint">Enviado com sucesso. Dados salvos em localStorage (chave: submission).</p>';
    showToast('Formulário enviado.');
    form.reset();
  }
});

// buttons
document.addEventListener('click', (ev) => {
  const t = ev.target;
  if (t && t.id === 'saveDraft') {
    const form = document.getElementById('contactForm');
    if (!form) return showToast('Abra o formulário antes.');
    const data = Object.fromEntries(new FormData(form));
    Storage.save('draft', data);
    showToast('Rascunho salvo.');
  }
  if (t && t.id === 'clearStorage') {
    Storage.clear();
    showToast('Armazenamento limpo.');
  }
});

function showToast(msg, ms = 2400) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = msg;
  document.body.appendChild(node);
  setTimeout(()=> node.remove(), ms);
}

function showCentralError(msg) {
  const existing = document.querySelector('.mensagem-erro');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = 'mensagem-erro';
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => {
    div.classList.add('fadeout');
    setTimeout(() => div.remove(), 1000);
  }, 3000);
}
