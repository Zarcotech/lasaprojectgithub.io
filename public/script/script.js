const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

const fontSize = 16;

function resizeCanvasAndSetup() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const columns = Math.floor(rect.width / fontSize) || 1;
  drops.length = columns;
  for (let i = 0; i < columns; i++) {
    if (drops[i] === undefined) drops[i] = 1;
  }
}

const jsSnippets = [
  "const", "let", "function", "if", "else", "return",
  "await", "async", "true", "false", "null", "typeof"
];


const drops = [];
resizeCanvasAndSetup();

function draw() {

  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

  ctx.fillStyle = '#0F0';
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = jsSnippets[Math.floor(Math.random() * jsSnippets.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > (canvas.height / (window.devicePixelRatio || 1)) && Math.random() > 0.985) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

window.addEventListener('resize', () => {
  resizeCanvasAndSetup();
});

setInterval(draw, 150);

document.addEventListener('DOMContentLoaded', () => {

});
