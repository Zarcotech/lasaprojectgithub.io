const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let fontSize = 16;
let snippets = ['const', 'let', 'function', 'if', 'else', 'return', 'await', 'async', 'true', 'false', 'null', 'typeof', 'class', 'new', 'this'];
let drops = [];
let rafId = null;
let lastFrameTime = 0;
let FPS = 16; 

const themes = {
  'JavaScript': {
    snippets: ['const', 'let', 'function', 'if', 'else', 'return', 'await', 'async', 'class', 'new', 'this', '=>', 'console.log'],
    textColor: '#F0DB4F',
    bgAlpha: 0.08,
    fontSize: 16,
    fps: 0.8
  },
  'Python': {
    snippets: ['def', 'import', 'print', 'self', 'None', 'True', 'False', 'class', 'lambda', 'return', 'async', 'await'],
    textColor: '#453bffff',
    bgAlpha: 0.08,
    fontSize: 16,
    fps: 0.8
  },
  'C++': {
    snippets: ['int', 'float', 'double', 'std::', 'include', 'cout', 'cin', 'class', 'template', 'return', 'new', 'delete'],
    textColor: '#5599ff',
    bgAlpha: 0.08,
    fontSize: 16,
    fps: 0.8
  },
  'HTML': {
    snippets: ['<div>', '<a>', '<p>', '<img>', '<h1>', '<span>', '<script>', '<link>', '<header>', '<footer>'],
    textColor: '#FF5733',
    bgAlpha: 0.08,
    fontSize: 14,
    fps: 0.8
  },
  'CSS': {
    snippets: ['color', 'background', 'display', 'flex', 'grid', 'margin', 'padding', 'border', '@media', ':root'],
    textColor: '#663399',
    bgAlpha: 0.08,
    fontSize: 14,
    fps: 0.8
  },
  'Bash': {
    snippets: ['echo', 'ls', 'cd', 'mkdir', 'rm', 'touch', 'sudo', 'apt-get', 'chmod', 'chown'],
    textColor: '#4EAA25',
    bgAlpha: 0.08,
    fontSize: 16,
    fps: 0.8
  },
  'Java': {
    snippets: ['public', 'static', 'void', 'class', 'new', 'import', 'return', 'if', 'else', 'this'],
    textColor: '#b07219',
    bgAlpha: 0.08,
    fontSize: 16,
    fps: 0.8
  },
  'Rust': {
    snippets: ['fn', 'let', 'mut', 'struct', 'enum', 'impl', 'trait', 'use', 'pub', 'return'],
    textColor: '#5599ff',
    bgAlpha: 0.08,
    fontSize: 16,
    fps: 0.8
  }
};

let currentTheme = localStorage.getItem('currentTheme') || 'JavaScript';

function loadSavedThemes() {
  try {
    const raw = localStorage.getItem('savedThemes');
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.keys(saved).forEach(k => { themes[k] = saved[k]; });
  } catch (e) {
    console.warn('Failed loading saved themes', e);
  }
}

function applyTheme(name) {
  stopAnimation();
  currentTheme = name;
  const t = themes[name] || themes['JavaScript'];
  
  snippets = (t.snippets || []).slice();
  fontSize = t.fontSize || 16;
  FPS = (t.fps || 0.8) * 20;

  localStorage.setItem('currentTheme', currentTheme);
  
  const sel = document.getElementById('themeSelect');
  if (sel) sel.value = name;

  const slider = document.getElementById('rainSpeed');
  const display = document.getElementById('rainSpeedValue');
  if (slider) slider.value = (t.fps || 0.8);
  if (display) display.textContent = (t.fps || 0.8).toFixed(2);

  resizeCanvasAndSetup();
  
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
  startAnimation();
}

function resizeCanvasAndSetup() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
  const columnWidth = Math.max(6, Math.round(fontSize * 0.45));
  const columns = Math.ceil(rect.width / columnWidth) + 10;
  
  drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * -150);
  }
}

function drawFrame(timestamp) {
  const elapsed = timestamp - lastFrameTime;
  if (elapsed > 1000 / FPS) {
    lastFrameTime = timestamp;
    const theme = themes[currentTheme] || themes['JavaScript'];
    const dpr = window.devicePixelRatio || 1;
    const viewWidth = canvas.width / dpr;
    const viewHeight = canvas.height / dpr;

    ctx.fillStyle = `rgba(0, 0, 0, ${theme.bgAlpha || 0.08})`;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    ctx.fillStyle = theme.textColor || '#FFFFFF';
    ctx.font = `${fontSize}px monospace`;
    const columnWidth = Math.max(6, Math.round(fontSize * 0.45));

    for (let i = 0; i < drops.length; i++) {
      const text = snippets[Math.floor(Math.random() * snippets.length)];
      ctx.fillText(text, i * columnWidth, drops[i] * fontSize);
      
      if (drops[i] * fontSize > viewHeight && Math.random() > 0.992) {
        drops[i] = 0;
      }
      drops[i] += 1;
    }
  }
  rafId = requestAnimationFrame(drawFrame);
}

function stopAnimation() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
}

function startAnimation() {
  if (!rafId) rafId = requestAnimationFrame(drawFrame);
}

window.addEventListener('resize', () => resizeCanvasAndSetup());

function initScrollAnimations() {
  const elementsToAnimate = document.querySelectorAll('.about-content, .aboute');
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let scrollDir = 'down';

  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset || document.documentElement.scrollTop;
    scrollDir = currentY < lastScrollY ? 'up' : 'down';
    lastScrollY = currentY;
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      } else if (scrollDir === 'up') {
        entry.target.classList.remove('fade-in');
      }
    });
  }, { threshold: [0, 0.1] });

  elementsToAnimate.forEach(el => observer.observe(el));
}

function initControls() {
  const slider = document.getElementById('rainSpeed');
  if (slider) {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      FPS = val * 20;
      const display = document.getElementById('rainSpeedValue');
      if (display) display.textContent = val.toFixed(2);
    });
  }
  
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }
  refreshThemeDropdown();
}

function sendNew() {
  const nameEl = document.getElementById('themeName');
  const snipEl = document.getElementById('newSnippets');
  const colorEl = document.getElementById('textColor');
  const alphaEl = document.getElementById('bgAlpha');
  const sizeEl = document.getElementById('fontSize');
  const speedEl = document.getElementById('rainSpeedInput');

  const themeName = (nameEl && nameEl.value.trim()) || `Custom-${Date.now()}`;
  
  let alphaVal = alphaEl ? parseFloat(alphaEl.value) : 0.08;
  if (alphaVal > 0.3) alphaVal = 0.08; 

  const newTheme = {
    snippets: (snipEl && snipEl.value) ? snipEl.value.split(',').map(s => s.trim()).filter(Boolean) : themes['JavaScript'].snippets.slice(),
    textColor: (colorEl && colorEl.value) || '#FFFFFF',
    bgAlpha: alphaVal,
    fontSize: sizeEl ? parseInt(sizeEl.value) : 16,
    fps: speedEl ? parseFloat(speedEl.value) : 0.8
  };


  themes[themeName] = newTheme;
  const saved = JSON.parse(localStorage.getItem('savedThemes') || '{}');
  saved[themeName] = newTheme;
  localStorage.setItem('savedThemes', JSON.stringify(saved));

  refreshThemeDropdown();
  applyTheme(themeName);
}

function refreshThemeDropdown() {
  const sel = document.getElementById('themeSelect');
  if (!sel) return;
  
  const currentVal = currentTheme;
  sel.innerHTML = '';
  Object.keys(themes).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = k;
    sel.appendChild(opt);
  });
  sel.value = currentVal;
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedThemes();
  initControls();
  initScrollAnimations();
  applyTheme(currentTheme);
});

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const menu = document.getElementById('custom-menu');
  if (menu) {
    menu.style.top = `${e.pageY}px`;
    menu.style.left = `${e.pageX}px`;
    menu.style.display = 'block';
  }
});

document.addEventListener('click', () => {
  const menu = document.getElementById('custom-menu');
  if (menu) menu.style.display = 'none';
});

const clearBtn = document.getElementById('clearThemes');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('savedThemes');
    location.reload();
  });
}