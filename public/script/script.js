const canvas = document.getElementById('backgroundCanvas')
const ctx = canvas.getContext('2d')
const fontSize = 16
const jsSnippets = ['const','let','function','if','else','return','await','async','true','false','null','typeof', 'class', 'new', 'this']
const drops = []
let rainSpeed = 1
const MAX_RAIN_SPEED = 2

function resizeCanvasAndSetup() {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(rect.height * dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const columns = Math.max(1, Math.floor(rect.width / fontSize))
  drops.length = columns
  for (let i = 0; i < columns; i++) if (drops[i] === undefined) drops[i] = 1
}

function drawFrame() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
  ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1))
  ctx.fillStyle = '#0F0';
  ctx.font = `${fontSize}px monospace`
  for (let i = 0; i < drops.length; i++) {
    const text = jsSnippets[Math.floor(Math.random() * jsSnippets.length)]
    ctx.fillText(text, i * fontSize, drops[i] * fontSize)
    if (drops[i] * fontSize > (canvas.height / (window.devicePixelRatio || 1)) && Math.random() > 0.985) drops[i] = 0
    drops[i] += rainSpeed
  }
  if (!document.hidden) requestAnimationFrame(drawFrame)
}

window.addEventListener('resize', () => resizeCanvasAndSetup())
document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(drawFrame) })

function initScrollAnimations() {
  const elementsToAnimate = document.querySelectorAll('.about-content, .aboute')
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop
  let scrollDir = 'down'
  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset || document.documentElement.scrollTop
    scrollDir = currentY < lastScrollY ? 'up' : 'down'
    lastScrollY = currentY
  }, { passive: true })
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('fade-in')
      else if (scrollDir === 'up') entry.target.classList.remove('fade-in')
    })
  }, { threshold: [0, 0.1] })
  elementsToAnimate.forEach(element => observer.observe(element))
}

function initControls() {
  const slider = document.getElementById('rainSpeed')
  if (!slider) return
  const display = document.getElementById('rainSpeedValue')
  const readAndClamp = (v) => {
    const raw = parseFloat(v) || 0
    const clamped = Math.min(raw, MAX_RAIN_SPEED)
    return clamped
  }
  rainSpeed = readAndClamp(slider.value) || 1
  if (display) display.textContent = rainSpeed.toFixed(2)
  slider.addEventListener('input', (e) => {
    const clamped = readAndClamp(e.target.value)
    rainSpeed = clamped
    if (display) display.textContent = rainSpeed.toFixed(2)
    if (parseFloat(e.target.value) > MAX_RAIN_SPEED) e.target.value = MAX_RAIN_SPEED
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { resizeCanvasAndSetup(); initScrollAnimations(); initControls(); requestAnimationFrame(drawFrame) })
else { resizeCanvasAndSetup(); initScrollAnimations(); initControls(); requestAnimationFrame(drawFrame) }

document.addEventListener('contextmenu', function(e) {
  e.preventDefault(); 
  
  const customMenu = document.getElementById('custom-menu');
  
  customMenu.style.top = `${e.pageY}px`;
  customMenu.style.left = `${e.pageX}px`;
  
  customMenu.style.display = 'block';
});

document.addEventListener('click', function(e) {
  const customMenu = document.getElementById('custom-menu');
  if (e.button !== 2) {
    customMenu.style.display = 'none';
  }
});
