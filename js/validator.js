export class Validator {
  constructor(form) {
    this.form = form;
    this.fields = Array.from(form.elements).filter(el => el.name);
    this.errors = {};
  }

  validate() {
    this.errors = {};
    this.fields.forEach(f => {
      const small = this.form.querySelector(`small.error[data-for="${f.name}"]`);
      if (small) small.textContent = '';
      // required
      if (f.required && !f.value.trim()) {
        this.errors[f.name] = 'Campo obrigatório';
        if (small) small.textContent = this.errors[f.name];
        return;
      }
      // type/email
      if (f.type === 'email' && f.value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!re.test(f.value)) {
          this.errors[f.name] = 'Email inválido';
          if (small) small.textContent = this.errors[f.name];
        }
      }
      // pattern
      if (f.pattern && f.value) {
        const re = new RegExp(f.pattern);
        if (!re.test(f.value)) {
          this.errors[f.name] = 'Formato inválido';
          if (small) small.textContent = this.errors[f.name];
        }
      }
      // min/max for number
      if (f.type === 'number' && f.value) {
        const n = Number(f.value);
        if (f.min && n < Number(f.min)) {
          this.errors[f.name] = `Valor mínimo ${f.min}`;
          if (small) small.textContent = this.errors[f.name];
        }
        if (f.max && n > Number(f.max)) {
          this.errors[f.name] = `Valor máximo ${f.max}`;
          if (small) small.textContent = this.errors[f.name];
        }
      }
      // minlength
      if (f.minLength && f.value) {
        if (f.value.length < f.minLength) {
          this.errors[f.name] = `Mínimo ${f.minLength} caracteres`;
          if (small) small.textContent = this.errors[f.name];
        }
      }
    });
    // show styles
    this._updateFieldStyles();
    return Object.keys(this.errors).length === 0;
  }

  _updateFieldStyles() {
    this.fields.forEach(f => {
      if (this.errors[f.name]) {
        f.setAttribute('aria-invalid','true');
        f.style.borderColor = '#b00020';
      } else {
        f.removeAttribute('aria-invalid');
        f.style.borderColor = '';
      }
    });
  }

  focusFirstInvalid() {
    const firstKey = Object.keys(this.errors)[0];
    if (!firstKey) return;
    const el = this.form.elements.namedItem(firstKey);
    if (el && typeof el.focus === 'function') el.focus();
  }
}
