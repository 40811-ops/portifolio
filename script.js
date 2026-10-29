(() => {
  'use strict';

  /* ===== CONFIGURAÇÃO — preencha com seus dados reais =====
     email:        seu e-mail (ativa o link de contato e o envio pelo app de e-mail)
     formEndpoint: URL de um serviço de formulários (ex.: Formspree) para envio direto
     github / linkedin: endereços completos dos seus perfis */
  const CONFIG = { email: '', formEndpoint: '', github: '', linkedin: '' };

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* ===== Tema claro/escuro ===== */
  const themeBtn = document.getElementById('theme-toggle');
  function setTheme(t) {
    root.dataset.theme = t;
    themeBtn.setAttribute('aria-label', t === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro');
    document.querySelector('meta[name="theme-color"]').content = t === 'light' ? '#F5F5F0' : '#171717';
  }
  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
  themeBtn.addEventListener('click', () => {
    const t = root.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(t);
    try { localStorage.setItem('tema', t); } catch (e) { /* armazenamento indisponível */ }
  });

  /* ===== Animação principal: o código vira projetos =====
     Itens: 3 molduras, 22 linhas de código e 6 símbolos. Cada etapa (início, sobre,
     projetos, contato) define a posição de todos; o scroll interpola entre elas. */
  const canvas = document.getElementById('code-canvas');
  const LENS = [.5,.8,.35,.65,.9,.45,.7,.3,.6,.85,.4,.75,.55,.25,.8,.5,.65,.35,.9,.45,.7,.3];
  const IND  = [0,1,1,2,2,1,2,2,1,0,0,1,1,2,2,1,0,0,1,1,0,0];
  const ACC  = new Set([3, 9, 15, 20]);
  const GLY  = ['{ }', '</>', '( )', '[ ]', '=>', ';'];
  const N = LENS.length;

  const items = [];
  const add = (cls, type, text) => {
    const el = document.createElement('i');
    el.className = cls;
    if (text) el.textContent = text;
    canvas.appendChild(el);
    items.push({ el, type });
  };
  for (let i = 0; i < 3; i++) add('cv-frame', 'frame');
  for (let k = 0; k < N; k++) add('cv-bar' + (ACC.has(k) ? ' acc' : ''), 'bar');
  GLY.forEach(g => add('cv-glyph', 'glyph', g));

  const HIDE = { x: 0, y: 0, w: 1, h: 1, r: 0, o: 0 };
  let L = [];

  function build() {
    const vw = innerWidth, vh = innerHeight, m = vw < 900;
    const rows = m ? 12 : N;
    const S = [[], [], [], []];
    const put = (st, x, y, w, h, r, o) => S[st].push({ x, y, w, h, r, o });
    const bar = (st, k, x, y, w, o, r = 0) => k < rows ? put(st, x, y, w, 6, r, o) : put(st, x, y, 1, 6, 0, 0);

    // Etapa 0 — início: linhas de código soltas, levemente desalinhadas
    const R = m ? { x: vw*.1, y: vh*.7, w: vw*.8, h: vh*.17 } : { x: vw*.56, y: vh*.2, w: vw*.38, h: vh*.6 };
    const step = R.h / rows;
    const box = (st, b, o0, o1, o2) => [o0, o1, o2].forEach(o => put(st, b.x, b.y, b.w, b.h, 0, o));
    box(0, { x: R.x - 16, y: R.y - 34, w: R.w + 32, h: R.h + 52 }, 1, 0, 0);
    for (let k = 0; k < N; k++) {
      const jx = (((k * 53) % 17) - 8) / 8 * R.w * .05, jr = (((k * 29) % 9) - 4) * .9;
      bar(0, k, R.x + IND[k] * R.w * .07 + jx, R.y + (k + .5) * step, LENS[k] * R.w * (1 - IND[k] * .07), .9, jr);
    }
    const GP = [[.3,-.12],[.78,-.1],[.92,.45],[.05,1.02],[.6,1.04],[.45,.5]];
    GP.forEach(([fx, fy]) => put(0, R.x + fx * R.w, R.y + fy * R.h, 1, 1, 0, m ? 0 : .85));

    // Etapa 1 — sobre mim: as linhas se organizam em uma escada (conhecimento crescendo)
    const C = m ? { x: vw - 34, y: vh * .2, w: 22, h: vh * .5 } : { x: vw * .8, y: vh * .22, w: vw * .14, h: vh * .56 };
    const cs = C.h / rows;
    box(1, { x: C.x - 14, y: C.y - 34, w: C.w + 28, h: C.h + 52 }, m ? 0 : .6, 0, 0);
    for (let k = 0; k < N; k++) bar(1, k, C.x, C.y + (k + .5) * cs, C.w * (.25 + .75 * (k % rows) / (rows - 1)), .55);
    GP.forEach((_, g) => put(1, C.x - 30, C.y + g * C.h / 5, 1, 1, 0, m ? 0 : .5));

    // Etapa 2 — projetos: as linhas se agrupam em três cartões
    if (m) {
      box(2, { x: 0, y: 0, w: 1, h: 1 }, 0, 0, 0);
      for (let k = 0; k < N; k++) bar(2, k, vw - 34, vh * .2 + Math.floor(k / 4) * vh * .17 + (k % 4) * 10, k % 4 ? 16 : 22, .55);
      GP.forEach(() => put(2, 0, 0, 1, 1, 0, 0));
    } else {
      const cw = vw * .14, ch = vh * .22, cx = vw * .8, y0 = vh * .16, gap = vh * .035;
      [0, 1, 2].forEach(g => put(2, cx, y0 + g * (ch + gap), cw, ch, 0, .75));
      for (let k = 0; k < N; k++) {
        const g = Math.min(2, Math.floor(k / 7)), j = k - 7 * g;
        const cy = y0 + g * (ch + gap);
        bar(2, k, cx + 12, cy + 30 + j * (ch - 46) / 8, (cw - 24) * (j === 0 ? .5 : LENS[k] * .6 + .4), .8);
      }
      GP.forEach((_, g) => g < 3 ? put(2, cx + cw - 38, y0 + g * (ch + gap) + 6, 1, 1, 0, .8) : put(2, cx, y0, 1, 1, 0, 0));
    }

    // Etapa 3 — contato: terminal organizado, com as linhas laranja em destaque
    const T = { x: vw * .56, y: vh * .28, w: vw * .38, h: vh * .44 };
    const ts = (T.h - 20) / rows;
    box(3, { x: T.x - 16, y: T.y - 34, w: T.w + 32, h: T.h + 52 }, m ? 0 : 1, 0, 0);
    for (let k = 0; k < N; k++) {
      if (m) bar(3, k, vw - 34, vh * .2 + (k + .5) * cs, 22, ACC.has(k) ? 1 : .55);
      else bar(3, k, T.x + 6 + IND[k] * 16, T.y + 10 + (k + .5) * ts, LENS[k] * (T.w - 70), ACC.has(k) ? 1 : .85);
    }
    GP.forEach((_, g) => put(3, T.x + g * T.w / 6, T.y + T.h + 26, 1, 1, 0, m ? 0 : .85));

    // A ordem de inserção em cada etapa é a mesma de `items`: 3 molduras, 22 linhas, 6 símbolos
    L = S;
  }

  const ease = t => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;

  function apply(s) {
    const f = Math.min(2, Math.floor(s)), t = ease(s - f);
    const A = L[f], B = L[f + 1];
    for (let i = 0; i < items.length; i++) {
      const a = A[i], b = B[i], { el, type } = items[i];
      const x = lerp(a.x, b.x, t), y = lerp(a.y, b.y, t), o = lerp(a.o, b.o, t);
      el.style.opacity = o.toFixed(3);
      if (type === 'frame') {
        el.style.width = lerp(a.w, b.w, t).toFixed(1) + 'px';
        el.style.height = lerp(a.h, b.h, t).toFixed(1) + 'px';
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      } else if (type === 'bar') {
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${lerp(a.r, b.r, t).toFixed(2)}deg) scaleX(${(lerp(a.w, b.w, t) / 100).toFixed(3)})`;
      } else {
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      }
    }
  }

  /* ===== Progresso do scroll e navegação ===== */
  const sections = ['inicio', 'sobre', 'projetos', 'contato'].map(id => document.getElementById(id));
  const navLinks = [...document.querySelectorAll('.nav a')];
  let tops = [], target = 0, cur = 0, raf = 0, active = -1;

  const measure = () => { tops = sections.map(s => s.offsetTop + s.offsetHeight / 2); }; // centros das seções

  function readScroll() {
    const y = scrollY + innerHeight * .5;
    let i = 0;
    while (i < 3 && y >= tops[i + 1]) i++;
    target = i === 3 ? 3 : Math.max(0, i + (y - tops[i]) / (tops[i + 1] - tops[i]));
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) target = 3;
    const idx = Math.min(3, Math.round(target));
    if (idx !== active) {
      active = idx;
      navLinks.forEach((a, n) => n === idx ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
    }
  }

  function frame() {
    cur += (target - cur) * .14;
    if (Math.abs(target - cur) < .001) cur = target;
    apply(cur);
    raf = cur === target ? 0 : requestAnimationFrame(frame);
  }

  function update() {
    readScroll();
    if (reduced.matches) { cur = Math.round(target); apply(cur); return; }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  let resizeTimer = 0;
  function relayout() {
    measure(); build(); readScroll();
    cur = reduced.matches ? Math.round(target) : target;
    apply(cur);
  }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(relayout, 120); });
  addEventListener('load', relayout);
  reduced.addEventListener('change', relayout);
  if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); readScroll(); }).observe(document.querySelector('main'));
  relayout();

  /* ===== Contatos reais (só viram link se estiverem em CONFIG) ===== */
  document.querySelectorAll('[data-contact]').forEach(li => {
    const key = li.dataset.contact, value = CONFIG[key];
    if (!value) return;
    const a = document.createElement('a');
    a.href = key === 'email' ? 'mailto:' + value : value;
    a.textContent = value.replace(/^https?:\/\/(www\.)?/, '');
    if (key !== 'email') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    li.querySelector('em').replaceWith(a);
  });

  /* ===== Formulário com validação ===== */
  const form = document.getElementById('form');
  const status = document.getElementById('status');
  const rules = {
    nome: v => v.trim().length >= 2 || 'Informe seu nome (mínimo de 2 letras).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Informe um e-mail válido, como nome@exemplo.com.',
    mensagem: v => v.trim().length >= 10 || 'Escreva uma mensagem com pelo menos 10 caracteres.'
  };
  const setStatus = (text, tipo) => { status.textContent = text; status.dataset.tipo = tipo || ''; };

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    let first = null;
    for (const name of Object.keys(rules)) {
      const input = form.elements[name], res = rules[name](input.value);
      const err = document.getElementById('erro-' + name);
      if (res !== true) { err.textContent = res; input.setAttribute('aria-invalid', 'true'); first = first || input; }
      else { err.textContent = ''; input.removeAttribute('aria-invalid'); }
    }
    if (first) { first.focus(); setStatus('Corrija os campos indicados e tente de novo.', 'erro'); return; }

    const data = { nome: form.nome.value.trim(), email: form.email.value.trim(), mensagem: form.mensagem.value.trim() };
    if (CONFIG.formEndpoint) {
      try {
        const r = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        setStatus('Mensagem enviada. Obrigado pelo contato!', 'ok');
        form.reset();
      } catch (e) {
        setStatus('Não foi possível enviar agora. Tente novamente em instantes.', 'erro');
      }
      return;
    }
    if (CONFIG.email) {
      const subject = encodeURIComponent('Contato pelo portfólio — ' + data.nome);
      const body = encodeURIComponent(data.mensagem + '\n\n' + data.nome + ' (' + data.email + ')');
      location.href = 'mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body;
      setStatus('Abrindo seu app de e-mail com a mensagem pronta. O envio termina por lá.', 'ok');
      return;
    }
    setStatus('Os campos estão corretos, mas a mensagem não foi enviada: este site ainda não tem e-mail nem serviço de formulário configurado.', 'erro');
  });

  /* ===== Entrada suave dos elementos (só ativa se tudo acima rodou) ===== */
  const reveal = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .15 });
    root.classList.add('anim');
    reveal.forEach(n => io.observe(n));
  }
})();
