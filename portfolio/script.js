// Minimal JS: hamburger, smooth scroll, scrollspy, project filters, modal, reveal on scroll, theme toggle

document.addEventListener('DOMContentLoaded', () => {
  /* --- mobile nav --- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    if (mobileMenu.hasAttribute('hidden')) mobileMenu.removeAttribute('hidden')
    else mobileMenu.setAttribute('hidden', '')
  });

  // Close mobile menu when link clicked
  document.querySelectorAll('[data-link]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      target.scrollIntoView({behavior:'smooth', block:'start'});
      if (!mobileMenu.hasAttribute('hidden')) mobileMenu.setAttribute('hidden','');
    });
  });

  /* --- smooth scroll for nav on desktop --- */
  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  /* --- scrollspy highlight --- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.nav a[href="#${id}"]`);
      if (link) {
        if (entry.isIntersecting) navLinks.forEach(n=>n.classList.remove('active')), link.classList.add('active');
      }
    });
  }, {root:null,rootMargin:'-40% 0px -40% 0px',threshold:0});
  sections.forEach(s => observer.observe(s));

  /* --- reveal on scroll --- */
  const revealEls = document.querySelectorAll('.reveal');
  const reObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold: 0.12});
  revealEls.forEach(el => reObserver.observe(el));

  /* --- project filters + modal --- */
  const chips = document.querySelectorAll('.chip');
  const projects = Array.from(document.querySelectorAll('.project'));
  const projectGrid = document.getElementById('projectGrid');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      projects.forEach(p => {
        if (filter === 'all' || p.dataset.cat === filter) p.style.display = '';
        else p.style.display = 'none';
      });
    });
  });

  // Project modal (lightbox-like)
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function openProject(id) {
    // ideally load dynamic project details; using static placeholder here
    const p = projects.find(x => x.dataset.id === id);
    const title = p.querySelector('h3').innerText;
    const imgSrc = p.querySelector('img').src;
    const desc = p.querySelector('.muted') ? p.querySelector('.muted').innerText : 'Project description.';
    modalContent.innerHTML = `
      <div class="modal-project" style="display:flex;gap:16px;flex-wrap:wrap;">
        <img src="${imgSrc}" alt="${title}" style="max-width:420px;width:100%;border-radius:10px">
        <div style="flex:1">
          <h3>${title}</h3><p class="muted">${desc}</p>
          <p>Detailed description of the project, tech used, challenges solved and links to repo or live demo.</p>
          <p><strong>Stack:</strong> React · D3 · Node · Vercel</p>
          <div style="margin-top:12px"><a class="btn primary" href="#" target="_blank">Live demo</a> <a class="btn ghost" href="#" target="_blank">Source</a></div>
        </div>
      </div>`;
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';
  }

  // attach view buttons
  document.querySelectorAll('.view').forEach(b => {
    b.addEventListener('click', () => openProject(b.dataset.id));
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.setAttribute('hidden','');
  });

  // close modal on outside click
  modal.addEventListener('click', e => {
    if (e.target === modal) { modal.style.display = 'none'; modal.setAttribute('hidden',''); }
  });

  /* --- theme toggle (prefers-color-scheme aware) --- */
  const themeToggle = document.getElementById('themeToggle');
  const userTheme = localStorage.getItem('theme');
  if (userTheme === 'light') changeToLight();
  else if (!userTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) changeToLight();

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    if (document.documentElement.classList.contains('light')) {
      localStorage.setItem('theme','light'); changeToLight();
    } else { localStorage.setItem('theme','dark'); changeToDark(); }
  });

  function changeToLight() {
    document.documentElement.style.setProperty('--bg-1','#f8fbff');
    document.documentElement.style.setProperty('--bg-2','#e7f2ff');
    document.documentElement.style.setProperty('--accent','#4f46e5');
    document.documentElement.style.setProperty('--accent-2','#06b6d4');
    document.documentElement.style.setProperty('color-scheme','light');
  }
  function changeToDark() {
    document.documentElement.style.setProperty('--bg-1','#071024');
    document.documentElement.style.setProperty('--bg-2','#0f1724');
    document.documentElement.style.setProperty('--accent','#7c3aed');
    document.documentElement.style.setProperty('--accent-2','#06b6d4');
    document.documentElement.style.setProperty('color-scheme','dark');
  }

  /* --- lightweight accessibility: focus outlines --- */
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus');
  });

});