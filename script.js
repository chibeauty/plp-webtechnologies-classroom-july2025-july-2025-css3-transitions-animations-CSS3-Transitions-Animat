// Global state (demonstrates global scope)
let isAnimationPaused = false;

// Factory demonstrating local scope via closure
function createCounter(start = 0) {
  let count = start; // local to closure
  return function increment(by = 1) {
    count += by;
    return count; // returns new value
  };
}

// Utility: query helper with typed guard
function getElement(selector) {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}

// Utility: log to output panel
function log(message) {
  const logEl = getElement('#fn-log');
  const item = document.createElement('div');
  item.textContent = String(message);
  logEl.prepend(item);
}

// Calculate a stagger array given count and base delay
function calculateStagger(count, baseMs) {
  const delays = Array.from({ length: count }, (_, index) => baseMs * index);
  return delays;
}

// Format ms to s string
function formatMs(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

// Reusable class toggler with optional timeout auto-remove
function toggleClass(element, className, force) {
  if (typeof force === 'boolean') {
    element.classList.toggle(className, force);
  } else {
    element.classList.toggle(className);
  }
  return element.classList.contains(className);
}

// Trigger a reflow to restart a CSS animation class
function restartAnimation(element, animationClass) {
  element.classList.remove(animationClass);
  // Force reflow
  void element.offsetWidth; // access layout property
  element.classList.add(animationClass);
}

// Modal controls
function openModal() {
  const modal = getElement('#modal');
  modal.setAttribute('aria-hidden', 'false');
  toggleClass(modal, 'is-open', true);
}
function closeModal() {
  const modal = getElement('#modal');
  modal.setAttribute('aria-hidden', 'true');
  toggleClass(modal, 'is-open', false);
}

// Pause/resume all animations by setting inline style (reusable)
function setAnimationsPaused(paused) {
  document.documentElement.style.setProperty('animation-play-state', paused ? 'paused' : 'running');
  isAnimationPaused = paused;
  return isAnimationPaused;
}

// Randomize demo element color via CSS variable injection
function setDemoRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  document.documentElement.style.setProperty('--rand', hue.toString());
  const demo = getElement('.demo');
  demo.style.filter = `hue-rotate(${hue}deg)`;
  return hue;
}

// Wire up DOM once ready
document.addEventListener('DOMContentLoaded', () => {
  const counter = createCounter(0);

  // Toggle animations globally
  getElement('#btn-toggle-anim').addEventListener('click', () => {
    const nowPaused = setAnimationsPaused(!isAnimationPaused);
    getElement('#btn-toggle-anim').textContent = nowPaused ? 'Resume Animations' : 'Pause Animations';
    log(`Animations ${nowPaused ? 'paused' : 'running'}`);
  });

  // Pulse hero glow: restart animation class for re-trigger
  getElement('#btn-pulse-hero').addEventListener('click', () => {
    const heroGlow = getElement('.hero__glow');
    restartAnimation(heroGlow, 'pulse');
    log('Hero glow pulsed');
  });

  // Calculate stagger
  getElement('#btn-calc-stagger').addEventListener('click', () => {
    const delays = calculateStagger(5, 120);
    log('Stagger: ' + delays.map(formatMs).join(', '));
  });

  // Randomize demo color
  getElement('#btn-randomize').addEventListener('click', () => {
    const hue = setDemoRandomColor();
    log(`Randomized hue = ${hue}`);
  });

  // Increment counter using closure
  getElement('#btn-increment').addEventListener('click', () => {
    const value = counter(1);
    log(`Counter = ${value}`);
  });

  // Add card dynamically (DOM change via function)
  getElement('#btn-add-card').addEventListener('click', () => {
    const grid = document.querySelector('#functions .grid');
    if (!grid) return;
    const card = document.createElement('article');
    card.className = 'card fade-in';
    card.innerHTML = '<h3>New Card</h3><p>Added via JS.</p>';
    grid.appendChild(card);
    log('Added a new card');
  });

  // Animate Box
  getElement('#btn-animate-box').addEventListener('click', () => {
    const box = getElement('#demo-box');
    restartAnimation(box, 'is-animating');
    log('Box animated');
  });

  // Flip card
  getElement('#btn-flip-card').addEventListener('click', () => {
    const flip = getElement('#flip-card');
    const on = toggleClass(flip, 'is-flipped');
    log('Flip card: ' + (on ? 'back' : 'front'));
  });

  // Loader start/stop
  getElement('#btn-load-start').addEventListener('click', () => {
    const loader = getElement('#loader');
    toggleClass(loader, 'is-loading', true);
    loader.querySelector('.loader__label').textContent = 'Loading...';
    log('Loading started');
  });
  getElement('#btn-load-stop').addEventListener('click', () => {
    const loader = getElement('#loader');
    toggleClass(loader, 'is-loading', false);
    loader.querySelector('.loader__label').textContent = 'Idle';
    log('Loading stopped');
  });

  // Modal open/close
  getElement('#btn-open-modal').addEventListener('click', openModal);
  getElement('#btn-close-modal').addEventListener('click', closeModal);
  getElement('#modal-backdrop').addEventListener('click', closeModal);

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});


