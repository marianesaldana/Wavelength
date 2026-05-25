// ══════════════════════════════════════════════════════════════════
// WAVELENGTH — Lógica principal del juego
// Requiere: cards.js (DEFAULT_CARDS, CATEGORIES, CARD_COLORS)
// ══════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════
// I18N (ES / EN)
// ══════════════════════════════════════════
let CURRENT_LANG = localStorage.getItem('wlang') || 'es';

const LOCALES = {
  es: {
    'landing.subtitle': 'El juego de mesa',
    'landing.tagline':  '¿Estás en la misma frecuencia? Lee la mente de tu equipo a través del espectro.',
    'btn.play':         '🎮 Jugar',
    'btn.how':          '📖 Cómo Jugar',
    'btn.options':      '🎨 Opciones',
    'authors':          'Wolfgang Warsch · Alex Hague · Justin Vickers',
    'how.title':        '🎮 Cómo Jugar',
    'how.par1':         'Dos equipos compiten leyendo la mente del Psíquico. El Psíquico ve el objetivo secreto en el dial y da una pista conceptual entre dos opuestos. El equipo mueve la aguja para acertar.',
    'how.fases':        'Fases de cada ronda',
    'phase.psychic':    '🔮 FASE PSÍQUICA',
    'phase.team':       '💬 FASE DE EQUIPO',
    'phase.lr':         '↔️ IZQ / DER',
    'phase.scoring':    '🎯 PUNTUACIÓN',
    'setup.title':      '🎲 Configurar Partida',
    'setup.mode':       'Modo de juego',
    'setup.teams':      'Equipos',
    'setup.start':      '🚀 Iniciar',
    'setup.back':       '← Volver',
    'spectrum.center':  'Caliente',
    'spectrum.right':   'Frío',
    'dial.hint.drag':   '← Arrastra la aguja roja →',
  },
  en: {
    'landing.subtitle': 'The party game',
    'landing.tagline':  'Are you on the same wavelength? Read your team\'s mind across the spectrum.',
    'btn.play':         '🎮 Play',
    'btn.how':          '📖 How to Play',
    'btn.options':      '🎨 Options',
    'authors':          'Wolfgang Warsch · Alex Hague · Justin Vickers',
    'how.title':        '🎮 How to Play',
    'how.par1':         'Two teams compete to read the Psychic\'s mind. The Psychic sees the secret target on the dial and gives a clue between two opposites. The team moves the needle to guess.',
    'how.fases':        'Round phases',
    'phase.psychic':    '🔮 PSYCHIC PHASE',
    'phase.team':       '💬 TEAM PHASE',
    'phase.lr':         '↔️ LEFT / RIGHT',
    'phase.scoring':    '🎯 SCORING',
    'setup.title':      '🎲 Match Setup',
    'setup.mode':       'Game mode',
    'setup.teams':      'Teams',
    'setup.start':      '🚀 Start',
    'setup.back':       '← Back',
    'spectrum.center':  'Hot',
    'spectrum.right':   'Cold',
    'dial.hint.drag':   '← Drag the red needle →',
  },
};

function t(key, ...args) {
  const s = (LOCALES[CURRENT_LANG] && LOCALES[CURRENT_LANG][key]) || (LOCALES.es[key] || key);
  return args.length ? s.replace(/{(\d+)}/g, (m, n) => args[n] || '') : s;
}

function applyLang(lang) {
  CURRENT_LANG = lang;
  localStorage.setItem('wlang', lang);
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;
  updatePhaseTag();
}

// ══════════════════════════════════════════
// TEMAS
// ══════════════════════════════════════════
const THEMES = [
  // 🌌 Cosmos — noche cósmica · dial azul-perla · aguja dorada · anillo teal
  { id: 'cosmos', name: '🌌 Cosmos',
    sw: 'linear-gradient(135deg,#0a0e27 0%,#1a2456 55%,#38d4c7 100%)',
    bg1: '#0a0e27', bg2: '#1a2456',
    a1:  '#38d4c7', a2:  '#ffd166',
    sc:  ['#5eead4', '#0f766e'],
    face:   ['#e8edf5', '#9eb0d4'],
    needle: ['#7d5a00', '#d4a017', '#ffe082'],
    ring:   'rgba(56, 212, 199, .85)',
    pt:  'star',   m:  '#6b8cae' },

  // 🌠 Aurora — verde menta iridiscente · dial verde-perla · anillo rosa polar
  { id: 'aurora', name: '🌠 Aurora',
    sw: 'linear-gradient(135deg,#050a14 0%,#065f46 55%,#6ee7b7 100%)',
    bg1: '#050a14', bg2: '#0c1f2a',
    a1:  '#6ee7b7', a2:  '#f0abfc',
    sc:  ['#6ee7b7', '#065f46'],
    face:   ['#d8f3e3', '#7ec19c'],
    needle: ['#064e3b', '#10b981', '#a7f3d0'],
    ring:   'rgba(240, 171, 252, .85)',
    pt:  'aurora', m:  '#6b9b85' },

  // 🌊 Océano — abismo profundo · dial cyan-perla · aguja oro de tesoro
  { id: 'ocean',  name: '🌊 Océano',
    sw: 'linear-gradient(135deg,#001220 0%,#023e7d 60%,#00d4ff 100%)',
    bg1: '#001220', bg2: '#023e7d',
    a1:  '#00d4ff', a2:  '#ffd60a',
    sc:  ['#06b6d4', '#0c4a6e'],
    face:   ['#dbeafe', '#7dd3fc'],
    needle: ['#854d0e', '#eab308', '#fef08a'],
    ring:   'rgba(0, 212, 255, .9)',
    pt:  'bubble', m:  '#4d7ba0' },

  // 🌋 Volcán — magma y obsidiana · dial naranja-crema · aguja lava
  { id: 'volcan', name: '🌋 Volcán',
    sw: 'linear-gradient(135deg,#1a0500 0%,#7c2d12 55%,#fb923c 100%)',
    bg1: '#1a0500', bg2: '#4a0c0c',
    a1:  '#fb923c', a2:  '#fcd34d',
    sc:  ['#f97316', '#7c2d12'],
    face:   ['#fef3c7', '#fdba74'],
    needle: ['#7c2d12', '#ea580c', '#fed7aa'],
    ring:   'rgba(252, 211, 77, .95)',
    pt:  'ember',  m:  '#b8623c' },

  // ❄️ Nieve — noche invernal · dial hielo-azul · aguja zafiro
  { id: 'snow',   name: '❄️ Nieve',
    sw: 'linear-gradient(135deg,#0c1b2e 0%,#1e3a5f 55%,#93c5fd 100%)',
    bg1: '#0c1b2e', bg2: '#1e3a5f',
    a1:  '#93c5fd', a2:  '#e0e7ff',
    sc:  ['#cbd5e1', '#475569'],
    face:   ['#f0f9ff', '#bae6fd'],
    needle: ['#1e3a8a', '#3b82f6', '#dbeafe'],
    ring:   'rgba(147, 197, 253, .9)',
    pt:  'snow',   m:  '#6b8aaa' },

  // 🌸 Floral — ciruela y cerezo · dial sakura · aguja rosa-fucsia
  { id: 'floral', name: '🌸 Floral',
    sw: 'linear-gradient(135deg,#1a0626 0%,#831843 55%,#ff85b3 100%)',
    bg1: '#1a0626', bg2: '#4a0e3d',
    a1:  '#ff85b3', a2:  '#fcd34d',
    sc:  ['#ff85b3', '#831843'],
    face:   ['#fce7f3', '#f9a8d4'],
    needle: ['#831843', '#db2777', '#fbcfe8'],
    ring:   'rgba(252, 211, 77, .85)',
    pt:  'petal',  m:  '#c479a0' },

  // 🌿 Bosque — pino profundo · dial musgo-crema · aguja ámbar de savia
  { id: 'forest', name: '🌿 Bosque',
    sw: 'linear-gradient(135deg,#051208 0%,#14532d 55%,#4ade80 100%)',
    bg1: '#051208', bg2: '#0e2818',
    a1:  '#4ade80', a2:  '#f59e0b',
    sc:  ['#22c55e', '#14532d'],
    face:   ['#ecfccb', '#a3b18a'],
    needle: ['#713f12', '#d97706', '#fde68a'],
    ring:   'rgba(74, 222, 128, .9)',
    pt:  'leaf',   m:  '#4a7560' },

  // 🔮 Galaxia — nebular · dial lavanda · aguja magenta · nubes nebulares + estrellas
  { id: 'galaxy', name: '🔮 Galaxia',
    sw: 'linear-gradient(135deg,#0a0420 0%,#3b0764 55%,#c084fc 100%)',
    bg1: '#0a0420', bg2: '#2e0a5e',
    a1:  '#c084fc', a2:  '#fb7185',
    sc:  ['#a855f7', '#3b0764'],
    face:   ['#f3e8ff', '#c4b5fd'],
    needle: ['#831843', '#e11d48', '#fecdd3'],
    ring:   'rgba(251, 113, 133, .9)',
    pt:  'galaxy', m:  '#8770b8' },

  // 🌅 Atardecer — crepúsculo púrpura · dial peach · aguja coral
  { id: 'sunset', name: '🌅 Atardecer',
    sw: 'linear-gradient(135deg,#1a0a2e 0%,#7a2e3b 55%,#ff7e5f 100%)',
    bg1: '#1a0a2e', bg2: '#5e1b6e',
    a1:  '#ff7e5f', a2:  '#feb47b',
    sc:  ['#ff7e5f', '#7a2e3b'],
    face:   ['#ffedd5', '#fdba74'],
    needle: ['#7c2d12', '#ea580c', '#fed7aa'],
    ring:   'rgba(254, 180, 123, .95)',
    pt:  'ember',  m:  '#b8709a' },

  // 🌃 Neón — cyberpunk · dial NEGRO sci-fi · aguja cyan eléctrico · anillo magenta
  { id: 'neon',   name: '🌃 Neón',
    sw: 'linear-gradient(135deg,#050010 0%,#1a0033 50%,#ff2bd6 100%)',
    bg1: '#050010', bg2: '#1a0033',
    a1:  '#ff2bd6', a2:  '#00f0ff',
    sc:  ['#ff2bd6', '#7a0052'],
    face:   ['#1a0033', '#000000'],
    needle: ['#006670', '#00f0ff', '#ccfbff'],
    ring:   'rgba(255, 43, 214, 1)',
    pt:  'nebula', m:  '#9970b0' },

  // ☕ Mocha — café tostado · dial crema cálida · aguja caramelo
  { id: 'mocha',  name: '☕ Mocha',
    sw: 'linear-gradient(135deg,#1c1410 0%,#3d2817 55%,#d4a373 100%)',
    bg1: '#1c1410', bg2: '#3d2817',
    a1:  '#d4a373', a2:  '#fefae0',
    sc:  ['#bc6c25', '#582f0e'],
    face:   ['#fefae0', '#d4a373'],
    needle: ['#451a03', '#9a3412', '#fdba74'],
    ring:   'rgba(254, 250, 224, .9)',
    pt:  'ember',  m:  '#a58c6f' },

  // 🦋 Mariposa — iridiscente · dial perla violeta · aguja teal jade
  { id: 'mariposa', name: '🦋 Mariposa',
    sw: 'linear-gradient(135deg,#060218 0%,#1e1b4b 50%,#7c3aed 100%)',
    bg1: '#060218', bg2: '#1a0c44',
    a1:  '#5eead4', a2:  '#c084fc',
    sc:  ['#7c3aed', '#1e1b4b'],
    face:   ['#e9d5ff', '#a78bfa'],
    needle: ['#0f766e', '#14b8a6', '#ccfbf1'],
    ring:   'rgba(192, 132, 252, .9)',
    pt:  'nebula', m:  '#8a7cb0' },
];
let currentTheme = THEMES[0];

function applyTheme(theme) {
  currentTheme = theme;
  const r = document.documentElement.style;

  // Acentos generales
  r.setProperty('--bg1', theme.bg1);
  r.setProperty('--bg2', theme.bg2);
  r.setProperty('--accent',  theme.a1);
  r.setProperty('--accent2', theme.a2);
  r.setProperty('--muted',   theme.m);
  document.body.style.background = theme.bg1;

  // Cara del dial — gradiente theme-driven
  if (theme.face) {
    r.setProperty('--face-1', theme.face[0]);
    r.setProperty('--face-2', theme.face[1]);
  }

  // Aguja — 3 tonos theme-driven (oscuro → medio → claro)
  if (theme.needle) {
    const [n1, n2, n3] = theme.needle;
    r.setProperty('--needle-1', n1);
    r.setProperty('--needle-2', n2);
    r.setProperty('--needle-3', n3);
    r.setProperty('--needle-bright', n3);
    r.setProperty('--needle-edge',   n2);
  }

  // Anillo decorativo del dial
  if (theme.ring) r.setProperty('--dial-ring', theme.ring);

  // Pantalla azul del dial
  const s1 = document.getElementById('sg1');
  const s2 = document.getElementById('sg2');
  if (s1) {
    s1.setAttribute('stop-color', theme.sc[0]);
    s2.setAttribute('stop-color', theme.sc[1]);
  }

  initBg(theme);
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('at', b.dataset.tid === theme.id));
  showNotif(`Tema "${theme.name}"`);
}

function buildThemeGrid() {
  const g = document.getElementById('themes-grid');
  g.innerHTML = '';
  THEMES.forEach(theme => {
    const b = document.createElement('button');
    b.className = 'theme-btn' + (theme.id === currentTheme.id ? ' at' : '');
    b.dataset.tid = theme.id;
    b.innerHTML = `<div class="t-swatch" style="background:${theme.sw}"></div>${theme.name}`;
    b.onclick = () => applyTheme(theme);
    g.appendChild(b);
  });
}

// ══════════════════════════════════════════
// CANVAS DE FONDO
// ══════════════════════════════════════════
let bgAnimId = null;

function initBg(theme) {
  const cv = document.getElementById('bg-canvas');
  const ctx = cv.getContext('2d');
  if (bgAnimId) cancelAnimationFrame(bgAnimId);
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;

  const k = theme.pt;
  const N = 140;
  const pts = Array.from({ length: N }, () => ({
    x: Math.random() * cv.width,
    y: Math.random() * cv.height,
    r: Math.random() * 1.8 + 0.4,
    a: Math.random(),
    da: (Math.random() - .5) * .013,
    vx: (Math.random() - .5) * .18,
    vy: k === 'snow'   ?  Math.random() * .5 + .15
       : k === 'ember' ? -Math.random() * .6 - .2
       : k === 'bubble'? -(Math.random() * .55 + .25)  // las burbujas SUBEN
       : (Math.random() - .5) * .14,
    sz: Math.random() * 3 + 1,
    h:  Math.random() * 60,
    pulse: Math.random() * Math.PI * 2,
  }));
  // Burbujas: deriva horizontal muy reducida, solo oscilan al subir
  if (k === 'bubble') pts.forEach(p => (p.vx *= 0.25));

  // 🔮 Galaxia: estrellas multicolor + estrellas "feature" con destello cruzado
  if (k === 'galaxy') {
    // Paleta tipo astrofotografía: blanco dominante + frío azul + cálido oro + rosa nebular
    const STAR_PALETTE = [
      [255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
      [207, 217, 255], [207, 217, 255],
      [255, 229, 204], [255, 229, 204],
      [255, 180, 230],
      [160, 196, 255],
    ];
    pts.forEach(p => {
      p.starColor    = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
      p.isFeature    = Math.random() < 0.07; // ~7 % son estrellas hero con spikes
      p.twinkleSpeed = 0.012 + Math.random() * 0.045;
      // Movimiento casi nulo — la galaxia es estática salvo la parallax sutil
      p.vx *= 0.15;
      p.vy = (Math.random() - .5) * 0.05;
    });
  }

  // Nubes nebulares persistentes (solo Galaxia) — derivan muy lentamente
  const nebulae = k === 'galaxy'
    ? [
        { col: '192,132,252', x: 0.18, y: 0.25, r: 280 }, // lila
        { col: '251,113,133', x: 0.75, y: 0.30, r: 240 }, // rosa magenta
        { col: '124, 58,237', x: 0.40, y: 0.70, r: 320 }, // violeta profundo
        { col: ' 94,234,212', x: 0.85, y: 0.78, r: 200 }, // turquesa contrastante
      ].map(n => ({
        ...n,
        x: cv.width  * n.x,
        y: cv.height * n.y,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.0007 + Math.random() * 0.0008,
      }))
    : [];

  const aT = { v: 0 };

  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);

    // Capa 1: gradiente lineal base bg1 → bg2
    const g = ctx.createLinearGradient(0, 0, cv.width * .4, cv.height);
    g.addColorStop(0, theme.bg1);
    g.addColorStop(1, theme.bg2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cv.width, cv.height);

    // Capa 2: acento radial con el color principal del tema
    // — crea una "atmósfera" coloreada en la zona superior
    const rg = ctx.createRadialGradient(
      cv.width * .5, cv.height * .18, 0,
      cv.width * .5, cv.height * .18, cv.width * .55
    );
    rg.addColorStop(0, theme.a1 + '2e');   // ~18% opacidad
    rg.addColorStop(0.55, theme.a1 + '0a'); // muy sutil
    rg.addColorStop(1, 'transparent');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, cv.width, cv.height);

    // Capa 3: acento radial secundario en la esquina inferior
    const rg2 = ctx.createRadialGradient(
      cv.width * .85, cv.height * .9, 0,
      cv.width * .85, cv.height * .9, cv.width * .45
    );
    rg2.addColorStop(0, theme.a2 + '24');  // ~14% opacidad
    rg2.addColorStop(1, 'transparent');
    ctx.fillStyle = rg2;
    ctx.fillRect(0, 0, cv.width, cv.height);

    // 🔮 Nubes nebulares (solo Galaxia) — capas de color que derivan suavemente
    if (k === 'galaxy') {
      nebulae.forEach(n => {
        n.drift += n.driftSpeed;
        const dx = Math.sin(n.drift) * 35;
        const dy = Math.cos(n.drift * 0.7) * 28;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const rg = ctx.createRadialGradient(
          n.x + dx, n.y + dy, 0,
          n.x + dx, n.y + dy, n.r
        );
        rg.addColorStop(0,    `rgba(${n.col}, 0.22)`);
        rg.addColorStop(0.35, `rgba(${n.col}, 0.10)`);
        rg.addColorStop(0.7,  `rgba(${n.col}, 0.03)`);
        rg.addColorStop(1,    'transparent');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.restore();
      });
    }

    // 🌊 Rayos de sol submarinos (solo Océano)
    if (k === 'bubble') {
      aT.v += 0.0035;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 5; i++) {
        const baseX = cv.width * (0.08 + i * 0.21);
        const sway  = Math.sin(aT.v * 1.4 + i * 1.3) * 38;
        const x0 = baseX + sway;
        const top = -10;
        const bot = cv.height * 0.85;
        const grad = ctx.createLinearGradient(x0, top, x0 + 60, bot);
        grad.addColorStop(0,   'rgba(150,220,255,0.13)');
        grad.addColorStop(0.4, 'rgba(150,220,255,0.05)');
        grad.addColorStop(1,   'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x0 - 28, top);
        ctx.lineTo(x0 + 28, top);
        ctx.lineTo(x0 + 150, bot);
        ctx.lineTo(x0 + 80,  bot);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    if (k === 'aurora') {
      aT.v += .007;
      for (let b = 0; b < 5; b++) {
        ctx.save();
        ctx.globalAlpha = .08 + Math.sin(aT.v + b) * .04;
        const ag = ctx.createLinearGradient(0, cv.height * .15, 0, cv.height * .7);
        const cols = ['#55ffcc', '#88ff66', '#ff88cc', '#66aaff', '#ffcc55'];
        ag.addColorStop(0, 'transparent');
        ag.addColorStop(.5, cols[b]);
        ag.addColorStop(1, 'transparent');
        ctx.fillStyle = ag;
        ctx.beginPath();
        const yo = cv.height * .3 + Math.sin(aT.v * .8 + b * 1.3) * 60;
        ctx.ellipse(cv.width * (.15 + b * .18), yo, cv.width * .32, 70 + Math.sin(aT.v + b) * 25, Math.sin(aT.v * .28 + b) * .4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    pts.forEach(p => {
      p.a += p.da;
      if (p.a < .04 || p.a > 1) p.da *= -1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -15) p.x = cv.width + 15;
      if (p.x > cv.width + 15) p.x = -15;
      if (p.y < -15) p.y = cv.height + 15;
      if (p.y > cv.height + 15) p.y = -15;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.abs(p.a));

      if (k === 'star' || k === 'cosmos') {
        p.pulse += .02;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + Math.sin(p.pulse) * .3), 0, Math.PI * 2);
        ctx.fill();
      } else if (k === 'bubble') {
        // Oscilación horizontal sinusoidal — burbuja real subiendo
        p.pulse += 0.028;
        const wobble = Math.sin(p.pulse) * 1.2;
        const cx = p.x + wobble;

        // ~1 de cada 6 burbujas es grande (variación visual marina)
        const isBig = (Math.floor(p.h) % 6 === 0);
        const r = isBig ? p.sz * 2.4 + 4 : p.sz * 1.3 + 1.4;

        // Anillo exterior de la burbuja
        ctx.strokeStyle = 'rgba(180, 230, 255, .6)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(cx, p.y, r, 0, Math.PI * 2);
        ctx.stroke();

        // Relleno interior muy sutil — sensación de cristal con aire
        ctx.fillStyle = 'rgba(200, 235, 255, .07)';
        ctx.beginPath();
        ctx.arc(cx, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Reflejo de luz arriba-izquierda
        ctx.fillStyle = 'rgba(255, 255, 255, .8)';
        ctx.beginPath();
        ctx.arc(cx - r * .38, p.y - r * .38, r * .22, 0, Math.PI * 2);
        ctx.fill();

        // Brillo secundario diminuto (solo burbujas grandes)
        if (isBig) {
          ctx.fillStyle = 'rgba(255, 255, 255, .55)';
          ctx.beginPath();
          ctx.arc(cx + r * .35, p.y + r * .25, r * .12, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (k === 'ember') {
        p.vy = -Math.abs(p.vy);
        ctx.fillStyle = '#ff8822';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fill();
      } else if (k === 'snow') {
        ctx.fillStyle = 'rgba(255,255,255,.88)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + .5, 0, Math.PI * 2);
        ctx.fill();
      } else if (k === 'petal') {
        ctx.fillStyle = 'hsla(315,78%,68%,.52)';
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a * 3.5);
        ctx.scale(1, .5);
        ctx.beginPath();
        ctx.arc(0, 0, p.sz + 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (k === 'leaf') {
        ctx.fillStyle = 'hsla(110,55%,32%,.42)';
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a * 2.5);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.sz + 1.2, p.r + .6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (k === 'nebula') {
        p.pulse += .015;
        ctx.fillStyle = 'rgba(170,85,255,' + (.4 + Math.sin(p.pulse) * .2) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1.5 + Math.sin(p.pulse) * .5), 0, Math.PI * 2);
        ctx.fill();
      } else if (k === 'galaxy') {
        // Twinkle propio (anula el alpha global para tener control fino)
        p.pulse += p.twinkleSpeed;
        const tw    = 0.5 + Math.sin(p.pulse) * 0.5;
        const alpha = 0.4 + tw * 0.6;
        const [cr, cg, cb] = p.starColor;
        ctx.globalAlpha = 1;

        if (p.isFeature) {
          // Estrella brillante con halo + destello cruzado tipo Hubble
          const r = p.r * 1.5 + 1.3;

          // Halo difuso
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${(alpha * 0.18).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo brillante
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();

          // Diffraction spikes (cruz horizontal + vertical)
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(alpha * 0.6).toFixed(3)})`;
          ctx.lineWidth = 0.9;
          const sl = r * 5.5;
          ctx.beginPath();
          ctx.moveTo(p.x - sl, p.y); ctx.lineTo(p.x + sl, p.y);
          ctx.moveTo(p.x, p.y - sl); ctx.lineTo(p.x, p.y + sl);
          ctx.stroke();
        } else {
          // Estrella normal con titileo
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (0.55 + tw * 0.55), 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    bgAnimId = requestAnimationFrame(draw);
  }
  draw();
}

window.addEventListener('resize', () => {
  const c = document.getElementById('bg-canvas');
  c.width  = innerWidth;
  c.height = innerHeight;
});

// ══════════════════════════════════════════
// GEOMETRÍA DEL DIAL SVG
// ══════════════════════════════════════════
const CX = 280;
const CY = 295;
const R  = 252;
// ZW = ancho angular TOTAL de cada zona (las 5 zonas son iguales).
// HZW = mitad de ese ancho. Centros: 0, ±ZW, ±2·ZW.
// Distribución (todas con ancho ZW):
//   z2l: -2·ZW±HZW · z3l: -ZW±HZW · z4: 0±HZW · z3r: +ZW±HZW · z2r: +2·ZW±HZW
const ZW  = 14;
const HZW = ZW / 2;

function polar(deg, r) {
  const rad = (deg - 90) * Math.PI / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function wedge(a1, a2, rr) {
  rr = rr || R;
  const [x1, y1] = polar(a1, rr);
  const [x2, y2] = polar(a2, rr);
  const la = (a2 - a1) > 180 ? 1 : 0;
  return `M${CX} ${CY} L${x1.toFixed(2)} ${y1.toFixed(2)} A${rr} ${rr} 0 ${la} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function buildZones() {
  // Cinco cuñas IGUALES — todas con ancho ZW grados
  document.getElementById('z2l').setAttribute('d', wedge(-2 * ZW - HZW, -2 * ZW + HZW));
  document.getElementById('z3l').setAttribute('d', wedge(    -ZW - HZW,     -ZW + HZW));
  document.getElementById('z4') .setAttribute('d', wedge(         -HZW,           HZW));
  document.getElementById('z3r').setAttribute('d', wedge(     ZW - HZW,      ZW + HZW));
  document.getElementById('z2r').setAttribute('d', wedge( 2 * ZW - HZW,  2 * ZW + HZW));

  // Líneas divisorias entre zonas
  function divLine(id, deg) {
    const [x, y] = polar(deg, R);
    const el = document.getElementById(id);
    el.setAttribute('x1', CX); el.setAttribute('y1', CY);
    el.setAttribute('x2', x.toFixed(2)); el.setAttribute('y2', y.toFixed(2));
  }
  divLine('div-2l3l', -2 * ZW + HZW);
  divLine('div-3l4',      -ZW + HZW);
  divLine('div-4-3r',      ZW - HZW);
  divLine('div-3r2r',  2 * ZW - HZW);

  // Etiquetas numéricas al centro de cada zona, a 60% del radio
  function setLabel(id, deg, txt) {
    const [lx, ly] = polar(deg, R * .60);
    const e = document.getElementById(id);
    e.setAttribute('x', lx.toFixed(1));
    e.setAttribute('y', (ly + 6).toFixed(1));
    e.textContent = txt;
  }
  setLabel('lb2l', -2 * ZW, '2');
  setLabel('lb3l',     -ZW, '3');
  setLabel('lb4',        0, '4');
  setLabel('lb3r',      ZW, '3');
  setLabel('lb2r',  2 * ZW, '2');

  // Mini dial (misma geometría)
  document.getElementById('mz2l').setAttribute('d', wedge(-2 * ZW - HZW, -2 * ZW + HZW));
  document.getElementById('mz3l').setAttribute('d', wedge(    -ZW - HZW,     -ZW + HZW));
  document.getElementById('mz4') .setAttribute('d', wedge(         -HZW,           HZW));
  document.getElementById('mz3r').setAttribute('d', wedge(     ZW - HZW,      ZW + HZW));
  document.getElementById('mz2r').setAttribute('d', wedge( 2 * ZW - HZW,  2 * ZW + HZW));
}

function buildRimTicks() {
  const g = document.getElementById('rim-ticks');
  g.innerHTML = '';
  for (let a = -84; a <= 84; a += 5) {
    const [x1, y1] = polar(a, R + 2);
    const [x2, y2] = polar(a, R + 14);
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', x1.toFixed(1)); l.setAttribute('y1', y1.toFixed(1));
    l.setAttribute('x2', x2.toFixed(1)); l.setAttribute('y2', y2.toFixed(1));
    l.setAttribute('stroke-width', a % 10 === 0 ? '2.2' : '1.2');
    g.appendChild(l);
  }
}

function buildWaveGuide() {
  const g = document.getElementById('wave-guide');
  g.innerHTML = '';
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let d = '';
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const arcDeg = -85 + t * 170;
    const waveOffset = Math.sin(t * Math.PI * 8) * 7;
    const [x, y] = polar(arcDeg, R - 8 + waveOffset);
    d += (i === 0 ? `M${x.toFixed(2)} ${y.toFixed(2)}` : ` L${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  pathEl.setAttribute('d', d);
  pathEl.setAttribute('fill', 'none');
  pathEl.setAttribute('stroke', 'rgba(200,168,76,0.45)');
  pathEl.setAttribute('stroke-width', '2.5');
  pathEl.setAttribute('stroke-linecap', 'round');
  g.appendChild(pathEl);
}

function buildScreenStars() {
  const g = document.getElementById('screen-stars');
  g.innerHTML = '';
  for (let i = 0; i < 55; i++) {
    const [sx, sy] = polar(Math.random() * 170 - 85, 25 + Math.random() * 200);
    if (sy > CY) continue;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', sx.toFixed(1));
    c.setAttribute('cy', sy.toFixed(1));
    c.setAttribute('r', (Math.random() * 1.7 + .4).toFixed(1));
    c.setAttribute('opacity', (Math.random() * .82 + .18).toFixed(2));
    g.appendChild(c);
  }
}

function setZoneRotation(angle) {
  document.getElementById('target-zones').setAttribute('transform', `rotate(${angle},${CX},${CY})`);
}

function setMiniZones(angle) {
  document.getElementById('mz-grp').setAttribute('transform', `rotate(${angle},${CX},${CY})`);
  document.getElementById('mini-needle').style.transform = `rotate(${angle}deg)`;
}

function showZones(highlightBullseye) {
  const z = document.getElementById('target-zones');
  z.classList.add('shown');
  z.classList.toggle('bullseye-hit', !!highlightBullseye);
}

function hideZones() {
  const z = document.getElementById('target-zones');
  z.classList.remove('shown', 'bullseye-hit');
}

function revealScreen() {
  const s = document.getElementById('blue-screen');
  s.style.transition = 'transform .95s cubic-bezier(.77,0,.18,1), opacity .88s ease';
  s.style.transformOrigin = `${CX}px ${CY}px`;
  s.style.transform = 'rotate(-192deg)';
  s.style.opacity = '0';
}

function resetScreen() {
  const s = document.getElementById('blue-screen');
  s.style.transition = 'none';
  s.style.transform = '';
  s.style.opacity = '';
  setTimeout(() => (s.style.transition = ''), 60);
}

// ══════════════════════════════════════════
// AGUJA — drag
// ══════════════════════════════════════════
let needleAngle = 0;
let dragging = false;
let dialEnabled = false;

function setNeedle(deg) {
  needleAngle = deg;
  document.getElementById('needle-group').style.transform = `rotate(${deg}deg)`;
}

function enableDial(on) {
  dialEnabled = on;
  const ng = document.getElementById('needle-group');
  const dz = document.getElementById('drag-zone');
  ng.style.cursor = on ? 'grab' : 'default';
  dz.style.cursor = on ? 'grab' : 'default';
  dz.style.pointerEvents = on ? 'all' : 'none';
  document.getElementById('dial-hint').textContent = on ? t('dial.hint.drag') : '';
}

(function initDrag() {
  const svg = document.getElementById('dial-svg');

  function angle(e) {
    const rc = svg.getBoundingClientRect();
    const sx = 560 / rc.width;
    const sy = 310 / rc.height;
    let cx, cy;
    if (e.touches) {
      cx = (e.touches[0].clientX - rc.left) * sx;
      cy = (e.touches[0].clientY - rc.top)  * sy;
    } else {
      cx = (e.clientX - rc.left) * sx;
      cy = (e.clientY - rc.top)  * sy;
    }
    const a = Math.atan2(cx - CX, -(cy - CY)) * 180 / Math.PI;
    return Math.max(-84, Math.min(84, a));
  }

  function start(e) {
    if (!dialEnabled) return;
    dragging = true;
    svg.style.cursor = 'grabbing';
    e.preventDefault();
  }
  function move(e) {
    if (!dragging || !dialEnabled) return;
    setNeedle(angle(e));
    e.preventDefault();
  }
  function end() {
    if (!dragging) return;
    dragging = false;
    svg.style.cursor = '';
  }

  const ng = document.getElementById('needle-group');
  const dz = document.getElementById('drag-zone');
  ng.addEventListener('mousedown',  start);
  ng.addEventListener('touchstart', start, { passive: false });
  dz.addEventListener('mousedown',  start);
  dz.addEventListener('touchstart', start, { passive: false });
  svg.addEventListener('mousemove', move);
  svg.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('mouseup',  end);
  window.addEventListener('touchend', end);
})();

// ══════════════════════════════════════════
// CARTAS — uso
// ══════════════════════════════════════════
let customCards = [];
let activeCat = 'all';
let leftColorSel  = '#6c5ce7';
let rightColorSel = '#fd9644';

function allCards() { return [...DEFAULT_CARDS, ...customCards]; }
function filteredCards() {
  const all = allCards();
  return activeCat === 'all' ? all : all.filter(c => c.cat === activeCat);
}
function randCard() {
  const pool = allCards();
  const c = pool[Math.floor(Math.random() * pool.length)];
  if (Math.random() < .5) return c;
  return { l: c.r, r: c.l, cat: c.cat, cl: c.cr, cr: c.cl };
}

function buildCatFilter() {
  const f = document.getElementById('cat-filter');
  f.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const ch = document.createElement('div');
    ch.className = 'cat-chip' + (cat.id === activeCat ? ' active' : '');
    ch.textContent = cat.label;
    ch.onclick = () => { activeCat = cat.id; buildCatFilter(); buildCardGrid(); };
    f.appendChild(ch);
  });
}

function buildCardGrid() {
  const g = document.getElementById('card-grid');
  g.innerHTML = '';
  filteredCards().forEach(c => {
    const tile = document.createElement('div');
    tile.className = 'card-tile';
    tile.innerHTML = `
      <div class="card-tile-inner">
        <div class="card-tile-half" style="background:${c.cl || '#4834d4'};font-size:.62rem">${c.l}</div>
        <div class="card-tile-dot"></div>
        <div class="card-tile-half" style="background:${c.cr || '#e55039'};font-size:.62rem">${c.r}</div>
      </div>`;
    g.appendChild(tile);
  });
  if (!filteredCards().length) {
    g.innerHTML = '<div style="font-size:.78rem;color:var(--muted);padding:.5rem;grid-column:1/-1">Sin cartas.</div>';
  }
}

function buildColorPickers() {
  function build(cid, init, cb) {
    const c = document.getElementById(cid);
    c.innerHTML = '';
    CARD_COLORS.forEach(col => {
      const d = document.createElement('div');
      d.className = 'color-pick' + (col === init ? ' sel' : '');
      d.style.background = col;
      d.onclick = () => {
        c.querySelectorAll('.color-pick').forEach(x => x.classList.remove('sel'));
        d.classList.add('sel');
        cb(col);
      };
      c.appendChild(d);
    });
  }
  build('acc-colors-left',  leftColorSel,  c => (leftColorSel  = c));
  build('acc-colors-right', rightColorSel, c => (rightColorSel = c));
}

function addCustomCard() {
  const l = document.getElementById('acc-left').value.trim();
  const r = document.getElementById('acc-right').value.trim();
  if (!l || !r) { showNotif('Completa ambos conceptos'); return; }
  customCards.push({ l, r, cat: document.getElementById('acc-cat').value, cl: leftColorSel, cr: rightColorSel });
  document.getElementById('acc-left').value  = '';
  document.getElementById('acc-right').value = '';
  buildCardGrid();
  showNotif(`✅ Carta "${l} ↔ ${r}" añadida`);
}

// ══════════════════════════════════════════
// ESTADO
// ══════════════════════════════════════════
const TEAM_COLORS = ['#2ec4b6', '#e76f51', '#f4d35e', '#a855f7', '#a8dadc', '#ff85d6'];

const G = {
  mode:    'competitive',
  winMode: 'points',
  teams: [
    { name: 'Cerebro Izquierdo', color: '#2ec4b6', players: [''], score: 0 },
    { name: 'Cerebro Derecho',   color: '#e76f51', players: [''], score: 0 },
  ],
  coopPlayers: ['Jugador 1', 'Jugador 2'],
  ptsLimit: 10,
  rdsLimit: 10,
  round: 1,
  activeTeam: 0,
  psychicIdx: 0,
  coopPsychicIdx: 0,
  phase: 'psychic',
  card: null,
  targetAngle: 0,
  clue: '',
  lrChoice: null,
  coopDeck: [],
  coopBonus: 0,
  coopScore: 0,
};

// ══════════════════════════════════════════
// NAVEGACIÓN
// ══════════════════════════════════════════
function goView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function goSetup() { renderSetup(); goView('view-setup'); }

function showOverlay(id) { document.getElementById(id).classList.add('active', 'blur-bg'); }
function hideOverlay(id) { document.getElementById(id).classList.remove('active', 'blur-bg'); }

function switchHowTab(id, el) {
  document.querySelectorAll('.how-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.how-pane').forEach(p => p.classList.toggle('active', p.id === id));
  if (el) el.classList.add('active');
}

function switchSpTab(id, el) {
  document.querySelectorAll('.sp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sp-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (el) el.classList.add('active');
}

// ══════════════════════════════════════════
// SETUP
// ══════════════════════════════════════════
function selMode(m) {
  G.mode = m;
  document.getElementById('mt-comp').classList.toggle('selected', m === 'competitive');
  document.getElementById('mt-coop').classList.toggle('selected', m === 'coop');
  document.getElementById('comp-setup').style.display = m === 'competitive' ? '' : 'none';
  document.getElementById('coop-setup').style.display = m === 'coop' ? '' : 'none';
}

function selWinMode(wm) {
  G.winMode = wm;
  document.getElementById('wm-pts').classList.toggle('selected', wm === 'points');
  document.getElementById('wm-rds').classList.toggle('selected', wm === 'rounds');
  document.getElementById('pts-config').style.display = wm === 'points' ? '' : 'none';
  document.getElementById('rds-config').style.display = wm === 'rounds' ? '' : 'none';
}

function renderSetup() { renderTeams(); renderCoopPs(); }

function renderTeams() {
  const r = document.getElementById('teams-row');
  r.innerHTML = '';
  G.teams.forEach((tm, ti) => {
    const b = document.createElement('div');
    b.className = 'team-box';
    b.innerHTML = `
      <input class="ti" value="${tm.name}" placeholder="Nombre equipo" oninput="G.teams[${ti}].name=this.value">
      <span class="lbl" style="margin-top:.3rem;font-size:.6rem">Color</span>
      <div class="cdots">
        ${TEAM_COLORS.map(c => `<div class="cdot${tm.color === c ? ' sel' : ''}" style="background:${c}" onclick="setTC(${ti},'${c}',this)"></div>`).join('')}
      </div>
      <span class="lbl" style="font-size:.6rem">Jugadores</span>
      <div class="plist" id="pl${ti}"></div>
      <button class="btn btn-ghost btn-sm" style="margin-top:.32rem;width:100%" onclick="addP(${ti})">+ Jugador</button>`;
    r.appendChild(b);
    renderPL(ti);
  });
}

function renderPL(ti) {
  const l = document.getElementById('pl' + ti);
  l.innerHTML = '';
  G.teams[ti].players.forEach((p, pi) => {
    const d = document.createElement('div');
    d.className = 'pi';
    d.innerHTML = `
      <span style="font-size:.72rem;color:var(--muted)">🧠</span>
      <input value="${p}" placeholder="Nombre" oninput="G.teams[${ti}].players[${pi}]=this.value">
      ${G.teams[ti].players.length > 1 ? `<button class="rbtn" onclick="rmP(${ti},${pi})">✕</button>` : ''}`;
    l.appendChild(d);
  });
}

function addP(ti) { G.teams[ti].players.push(''); renderPL(ti); }
function rmP(ti, pi) { G.teams[ti].players.splice(pi, 1); renderPL(ti); }
function setTC(ti, c, el) {
  G.teams[ti].color = c;
  el.closest('.team-box').querySelectorAll('.cdot').forEach(d => d.classList.remove('sel'));
  el.classList.add('sel');
}

function renderCoopPs() {
  const c = document.getElementById('coop-players');
  c.innerHTML = '';
  G.coopPlayers.forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'pi';
    d.innerHTML = `
      <span style="font-size:.72rem;color:var(--muted)">🧠</span>
      <input value="${p}" placeholder="Nombre" oninput="G.coopPlayers[${i}]=this.value">
      ${G.coopPlayers.length > 2 ? `<button class="rbtn" onclick="rmCP(${i})">✕</button>` : ''}`;
    c.appendChild(d);
  });
}

function addCoopP() {
  if (G.coopPlayers.length >= 8) return;
  G.coopPlayers.push(`Jugador ${G.coopPlayers.length + 1}`);
  renderCoopPs();
}
function rmCP(i) { G.coopPlayers.splice(i, 1); renderCoopPs(); }

// ══════════════════════════════════════════
// JUEGO
// ══════════════════════════════════════════
function startGame() {
  G.ptsLimit = parseInt(document.getElementById('pts-range').value);
  G.rdsLimit = parseInt(document.getElementById('rds-range')?.value || 10);

  if (G.mode === 'competitive') {
    G.teams.forEach(t => (t.score = 0));
    // Empate inicial roto a favor del segundo equipo (regla del juego)
    G.teams[1].score = 1;
    G.activeTeam = 0;
    G.psychicIdx = 0;
  } else {
    G.coopScore = 0;
    G.coopPsychicIdx = 0;
    G.coopDeck = Array.from({ length: 7 }, (_, i) => i);
    G.coopBonus = 0;
  }
  G.round = 1;
  setNeedle(0);
  goView('view-game');
  renderScoreboard();
  startRound();
}

function startRound() {
  G.card = randCard();
  // Ángulo objetivo aleatorio entre -84 y +84
  G.targetAngle = Math.round(Math.random() * 168 - 84);
  G.clue = '';
  G.lrChoice = null;

  setNeedle(0);
  resetScreen();
  hideZones();

  document.getElementById('rbadge').textContent = `R${G.round}`;
  document.getElementById('sl-text').textContent = G.card.l;
  document.getElementById('sr-text').textContent = G.card.r;
  document.getElementById('sc-left-wrap').style.background  = `linear-gradient(135deg,${G.card.cl || '#6c5ce7'},${(G.card.cl || '#4834d4')}cc)`;
  document.getElementById('sc-right-wrap').style.background = `linear-gradient(135deg,${G.card.cr || '#fd9644'},${(G.card.cr || '#e55039')}cc)`;
  document.getElementById('spectrum-strip').style.display = 'flex';

  // Limpiar leyenda anterior si existe
  const leg = document.getElementById('score-legend');
  if (leg) leg.remove();

  G.phase = 'psychic';
  updatePhaseTag();
  renderPhase();
}

function updatePhaseTag() {
  const m = {
    psychic: t('phase.psychic'),
    team:    t('phase.team'),
    lr:      t('phase.lr'),
    scoring: t('phase.scoring'),
  };
  document.getElementById('phase-tag').textContent = m[G.phase] || '';
}

// ══════════════════════════════════════════
// FASES
// ══════════════════════════════════════════
function renderPhase() {
  const pc = document.getElementById('pp-content');
  const pa = document.getElementById('pp-actions');
  pc.innerHTML = '';
  pa.innerHTML = '';
  if      (G.phase === 'psychic') phPsychic();
  else if (G.phase === 'team')    phTeam();
  else if (G.phase === 'lr')      phLR();
  else if (G.phase === 'scoring') phScoring();
}

function getPsychic() {
  if (G.mode === 'coop') return G.coopPlayers[G.coopPsychicIdx] || 'Psíquico';
  return G.teams[G.activeTeam].players[G.psychicIdx] || 'Psíquico';
}
function getPsychicName() { return getPsychic(); }
function getTeam() { return G.teams[G.activeTeam]; }

function phPsychic() {
  const team = G.mode === 'coop' ? null : getTeam();
  document.getElementById('pp-title').textContent = '🔮 Fase Psíquica';
  document.getElementById('pp-desc').textContent  = 'El Psíquico ve el objetivo secreto y da una pista.';
  enableDial(false);
  document.getElementById('pp-content').innerHTML = `
    <div style="display:inline-flex;align-items:center;gap:.45rem;
                background:linear-gradient(135deg,${team ? team.color : '#6c5ce7'},${team ? team.color + '99' : '#a29bfe'});
                border-radius:28px;padding:.38rem .95rem;font-weight:700;font-size:.85rem">
      🧠 ${getPsychic()}
    </div>`;
  document.getElementById('pp-actions').innerHTML = `
    <button class="btn btn-gold btn-lg" onclick="openPsychicPass()">🔒 Pasar al Psíquico</button>`;
}

function openPsychicPass() {
  document.getElementById('pass-name').textContent  = getPsychicName();
  document.getElementById('pass-title').textContent = `Turno de ${getPsychicName()}`;
  showOverlay('overlay-psychic-pass');
}

function revealToPsychic() {
  hideOverlay('overlay-psychic-pass');
  setMiniZones(G.targetAngle);
  document.getElementById('mini-sl').textContent = G.card.l;
  document.getElementById('mini-sr').textContent = G.card.r;
  const msl = document.getElementById('mini-sc-l');
  const msr = document.getElementById('mini-sc-r');
  if (msl) msl.style.background = `linear-gradient(135deg,${G.card.cl || '#6c5ce7'},${(G.card.cl || '#4834d4') + 'cc'})`;
  if (msr) msr.style.background = `linear-gradient(135deg,${G.card.cr || '#fd9644'},${(G.card.cr || '#e55039') + 'cc'})`;
  document.getElementById('psych-clue-input').value = '';
  G.clue = '';
  showOverlay('overlay-psychic-sees');
}

function submitClue() {
  const inp = document.getElementById('psych-clue-input');
  if (!inp || !inp.value.trim()) { showNotif('Escribe una pista primero'); return; }
  G.clue = inp.value.trim();
  hideOverlay('overlay-psychic-sees');
  hideZones();
  setNeedle(0);
  G.phase = 'team';
  updatePhaseTag();
  renderPhase();
}

function phTeam() {
  const team = G.mode === 'coop' ? null : getTeam();
  document.getElementById('pp-title').textContent = '💬 Fase de Equipo';
  document.getElementById('pp-desc').textContent  = `${team ? team.name : 'El equipo'} debate y mueve la aguja.`;
  enableDial(true);
  document.getElementById('pp-content').innerHTML = `<div class="clue-big">"${G.clue}"</div>`;
  document.getElementById('pp-actions').innerHTML = `
    <button class="btn btn-primary btn-lg" onclick="submitDial()">Confirmar Posición ✓</button>`;
}

function submitDial() {
  G.phase = 'lr';
  updatePhaseTag();
  enableDial(false);
  renderPhase();
}

function phLR() {
  const other = G.mode === 'coop' ? null : G.teams[1 - G.activeTeam];
  document.getElementById('pp-title').textContent = '↔️ Izquierda o Derecha';
  document.getElementById('pp-desc').textContent  = `${other ? other.name : 'Todos (menos psíquico)'}: ¿El objetivo está a la izquierda o derecha?`;
  document.getElementById('pp-content').innerHTML = `
    <div class="clue-big" style="font-size:clamp(1.1rem,3.8vw,1.6rem)">"${G.clue}"</div>
    <div class="lr-row">
      <button class="lr-btn lrl" id="lr-l"
              style="background:linear-gradient(135deg,${G.card.cl || '#6c5ce7'},${(G.card.cl || '#4834d4') + 'cc'})"
              onclick="pickLR('left')">← ${G.card.l}</button>
      <button class="lr-btn lrr" id="lr-r"
              style="background:linear-gradient(135deg,${G.card.cr || '#fd9644'},${(G.card.cr || '#e55039') + 'cc'})"
              onclick="pickLR('right')">${G.card.r} →</button>
    </div>`;
  document.getElementById('pp-actions').innerHTML = `
    <button class="btn btn-primary btn-lg" id="lr-confirm" onclick="confirmLR()" style="display:none">Confirmar →</button>`;
  if (G.mode === 'coop') setTimeout(() => { G.lrChoice = null; doReveal(); }, 80);
}

function pickLR(s) {
  G.lrChoice = s;
  document.getElementById('lr-l').classList.toggle('chosen', s === 'left');
  document.getElementById('lr-r').classList.toggle('chosen', s === 'right');
  document.getElementById('lr-confirm').style.display = 'inline-flex';
}

function confirmLR() {
  if (!G.lrChoice) { showNotif('Elige un lado'); return; }
  doReveal();
}

function doReveal() {
  G.phase = 'scoring';
  updatePhaseTag();
  // Rotar zonas a la posición objetivo, mostrarlas, animar pantalla
  setZoneRotation(G.targetAngle);
  const dp = calcDP();
  showZones(dp === 4);
  revealScreen();
  // Mostrar leyenda de puntos debajo del dial como en el tablero
  showScoreLegend();
  setTimeout(renderPhase, 220);
}

function showScoreLegend() {
  // Quitar leyenda previa si la hay
  const prev = document.getElementById('score-legend');
  if (prev) prev.remove();

  const wrap = document.querySelector('.dial-wrap');
  const leg = document.createElement('div');
  leg.id = 'score-legend';
  leg.className = 'score-legend';
  leg.innerHTML = `
    <div class="leg"><span class="swatch" style="background:var(--zone-4)"></span>Centro · 4 pts</div>
    <div class="leg"><span class="swatch" style="background:var(--zone-3)"></span>Zona · 3 pts</div>
    <div class="leg"><span class="swatch" style="background:var(--zone-2)"></span>Borde · 2 pts</div>
    <div class="leg"><span class="swatch" style="background:rgba(255,255,255,.65)"></span>↔️ · 1 pt</div>`;
  wrap.appendChild(leg);
}

function phScoring() {
  const dp  = calcDP();
  const lrp = calcLRP(dp);
  const team  = G.mode === 'competitive' ? getTeam() : null;
  const other = G.mode === 'competitive' ? G.teams[1 - G.activeTeam] : null;

  if (G.mode === 'competitive') {
    G.teams[G.activeTeam].score += dp;
    if (dp < 4) G.teams[1 - G.activeTeam].score += lrp;
  } else {
    G.coopScore += dp;
    if (dp === 3) G.coopBonus++;
  }

  setTimeout(renderScoreboard, 260);

  document.getElementById('pp-title').innerHTML =
    `<span class="pts-big">${dp > 0 ? '+' + dp : '0 pts'}</span>`;
  document.getElementById('pp-desc').textContent = dpLabel(dp);
  document.getElementById('pp-content').innerHTML = `
    <div class="sbreak">
      ${team ? `<div class="sitem"><div class="sl">${team.name}</div><div class="sv" style="color:${team.color}">+${dp}</div></div>` : ''}
      ${dp < 4 && G.mode === 'competitive' ? `<div class="sitem"><div class="sl">${other.name} ↔️</div><div class="sv" style="color:${other.color}">+${lrp}</div></div>` : ''}
      ${G.mode === 'coop' ? `<div class="sitem"><div class="sl">Total Coop</div><div class="sv" style="color:var(--accent)">${G.coopScore}</div></div>` : ''}
    </div>`;
  document.getElementById('pp-actions').innerHTML = `
    <button class="btn btn-primary btn-lg" onclick="applyScoring()">Siguiente →</button>`;
}

function dpLabel(p) {
  return p === 4 ? '🎯 ¡Centro perfecto!'
       : p === 3 ? '👍 Zona roja — ¡casi!'
       : p === 2 ? '🙂 Zona naranja'
       :           '😅 Fuera del objetivo';
}

// Cálculo basado en los mismos rangos angulares que la geometría:
//   |d| ≤ HZW         → 4 (zona central)
//   |d| ≤ HZW +   ZW  → 3 (zona lateral interior)
//   |d| ≤ HZW + 2·ZW  → 2 (zona exterior)
function calcDP() {
  const d = Math.abs(needleAngle - G.targetAngle);
  return d <= HZW              ? 4
       : d <= HZW +     ZW     ? 3
       : d <= HZW + 2 * ZW     ? 2
       :                         0;
}

function calcLRP(dp) {
  if (dp === 4 || !G.lrChoice) return 0;
  const il = G.targetAngle < needleAngle;
  return ((il && G.lrChoice === 'left') || (!il && G.lrChoice === 'right')) ? 1 : 0;
}

function applyScoring() {
  if (G.mode === 'competitive') {
    const s0 = G.teams[0].score;
    const s1 = G.teams[1].score;
    if (G.winMode === 'points' && (s0 >= G.ptsLimit || s1 >= G.ptsLimit)) { doWin(); return; }
    if (G.winMode === 'rounds' && G.round >= G.rdsLimit)                  { doWin(); return; }

    // Regla de Recuperación (Catch-Up): si el equipo activo va perdiendo
    // y acertó al centro (4 pts), repite turno con otro psíquico
    const dp = calcDP();
    const losing = G.teams[G.activeTeam].score < G.teams[1 - G.activeTeam].score;
    if (dp === 4 && losing) {
      showNotif('🔥 ¡Regla de Recuperación!');
      G.psychicIdx = (G.psychicIdx + 1) % G.teams[G.activeTeam].players.length;
    } else {
      G.activeTeam = 1 - G.activeTeam;
      G.psychicIdx = (G.psychicIdx + 1) % G.teams[G.activeTeam].players.length;
    }
    G.round++;
    resetScreen();
    hideZones();
    renderScoreboard();
    startRound();
  } else {
    if (G.coopDeck.length > 0) {
      G.coopDeck.pop();
      if (G.coopBonus > 0) { G.coopDeck.push(999); G.coopBonus--; }
    }
    if (G.coopDeck.length === 0) { doCoopEnd(); return; }
    G.coopPsychicIdx = (G.coopPsychicIdx + 1) % G.coopPlayers.length;
    G.round++;
    resetScreen();
    hideZones();
    startRound();
  }
}

// ══════════════════════════════════════════
// MARCADOR + VICTORIA
// ══════════════════════════════════════════
function renderScoreboard() {
  const sb = document.getElementById('scoreboard');
  if (G.mode === 'competitive') {
    sb.innerHTML = G.teams.map((t, i) => `
      <div class="steam${i === G.activeTeam ? ' act' : ''}"
           style="${i === G.activeTeam ? `border-color:${t.color};box-shadow:0 0 16px ${t.color}44` : ''}">
        <div class="stl">EQUIPO</div>
        <div class="ssc" style="color:${t.color}">${t.score}</div>
        <div class="snm">${t.name}</div>
      </div>`).join(`<div style="font-size:1rem;color:#334;align-self:center;padding:0 .2rem">vs</div>`);
  } else {
    sb.innerHTML = `
      <div class="steam act">
        <div class="stl">COOP</div>
        <div class="ssc" style="color:var(--accent)">${G.coopScore}</div>
        <div class="snm">meta 16+</div>
      </div>`;
  }
}

function doWin() {
  const [w, l] = G.teams[0].score >= G.teams[1].score
    ? [G.teams[0], G.teams[1]]
    : [G.teams[1], G.teams[0]];
  document.getElementById('win-emoji').textContent = '🏆';
  document.getElementById('win-title').textContent = '¡Victoria!';
  document.getElementById('win-team').innerHTML =
    `<span style="color:${w.color}">${w.name}</span> gana la partida`;
  document.getElementById('fscores').innerHTML = G.teams.map(t =>
    `<div class="fsbox${t === w ? ' winner' : ''}">
       <div class="fss" style="color:${t.color}">${t.score}</div>
       <div class="fsn">${t.name}</div>
     </div>`).join('');
  goView('view-win');
  confetti();
}

function doCoopEnd() {
  const s = G.coopScore;
  const rts = [
    [ 0,  3, '😬', '¿Enchufado?'],
    [ 4,  6, '😐', 'Reinicia'],
    [ 7,  9, '😅', 'Sopla el cartucho'],
    [10, 12, '🙂', 'No está mal'],
    [13, 15, '😮', '¡Tan cerca!'],
    [16, 18, '🎉', '¡Ganasteis!'],
    [19, 21, '🌟', 'En la misma onda'],
    [22, 24, '🧠', 'Cerebro de galaxia'],
    [25, 999, '🤯', '¡Mente Colmena!'],
  ];
  const [, , em, rt] = rts.find(([lo, hi]) => s >= lo && s <= hi) || rts[rts.length - 1];
  document.getElementById('win-emoji').textContent = em;
  document.getElementById('win-title').textContent = `${s} puntos`;
  document.getElementById('win-team').textContent  = rt;
  document.getElementById('fscores').innerHTML = `
    <div class="fsbox${s >= 16 ? ' winner' : ''}">
      <div class="fss" style="color:var(--accent)">${s}</div>
      <div class="fsn">Cooperativo</div>
    </div>`;
  goView('view-win');
  if (s >= 16) confetti();
}

function confetti() {
  const w = document.getElementById('confetti-wrap');
  w.innerHTML = '';
  const css = document.createElement('style');
  css.textContent = '@keyframes cf{to{transform:translateY(105vh) rotate(720deg);opacity:0}}';
  document.head.appendChild(css);
  ['#2ec4b6', '#e76f51', '#f4d35e', '#a8dadc', '#ff85d6', '#a855f7'].forEach(col => {
    for (let i = 0; i < 15; i++) {
      const e = document.createElement('div');
      e.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:-20px;
        width:${5 + Math.random() * 8}px;height:${7 + Math.random() * 10}px;
        background:${col};border-radius:2px;
        animation:cf ${2 + Math.random() * 3}s ${Math.random() * 2}s ease-in forwards;
        transform:rotate(${Math.random() * 360}deg)`;
      w.appendChild(e);
    }
  });
}

// ══════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════
function openSettings() {
  buildThemeGrid();
  buildCatFilter();
  buildCardGrid();
  buildColorPickers();
  document.getElementById('sp').classList.add('open');
  document.getElementById('so').classList.add('open');
}
function closeSettings() {
  document.getElementById('sp').classList.remove('open');
  document.getElementById('so').classList.remove('open');
}

function confirmMenu() {
  if (confirm('¿Volver al menú? Se perderá el progreso.')) goView('view-landing');
}

function showNotif(m) {
  const n = document.getElementById('notif');
  n.textContent = m;
  n.classList.add('show');
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 2600);
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  buildZones();
  buildRimTicks();
  buildWaveGuide();
  buildScreenStars();
  buildThemeGrid();
  renderSetup();
  initBg(currentTheme);

  // Idioma
  const sel = document.getElementById('lang-select');
  if (sel) {
    sel.value = CURRENT_LANG;
    sel.addEventListener('change', () => applyLang(sel.value));
  }
  applyLang(CURRENT_LANG);

  // Toggle timer
  const togTimer = document.getElementById('tog-timer');
  if (togTimer) {
    togTimer.addEventListener('change', function () {
      document.getElementById('timer-set').style.display = this.checked ? '' : 'none';
    });
  }
});
