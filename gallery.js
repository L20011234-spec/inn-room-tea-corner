const shots = Array.from(document.querySelectorAll('[data-shot]'));
const lightbox = document.querySelector('.lightbox');
const stage = lightbox.querySelector('.lightbox-stage');
const picture = stage.querySelector('img');
const title = document.querySelector('#lightbox-title');
const position = lightbox.querySelector('.position');
const download = lightbox.querySelector('.lightbox-download');
const closeButton = lightbox.querySelector('.lightbox-close');
let index = -1;
let opener;

function syncGallery() {
  const key = window.location.hash.slice(1);
  index = shots.findIndex((shot) => shot.dataset.shot === key);
  if (index < 0) {
    if (lightbox.open) {
      lightbox.close();
      opener?.focus({ preventScroll: true });
    }
    return;
  }
  const shot = shots[index];
  picture.src = shot.href;
  picture.alt = shot.querySelector('img').alt;
  title.textContent = shot.querySelector('h2').textContent;
  position.textContent = `${index + 1} / ${shots.length}`;
  download.href = shot.href;
  if (!lightbox.open) {
    lightbox.showModal();
    closeButton.focus();
  }
}

function closeGallery() {
  if (history.state?.gallery) {
    history.back();
  } else {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    syncGallery();
  }
}

function step(offset) {
  const next = shots[(index + offset + shots.length) % shots.length];
  history.replaceState(history.state, '', '#' + next.dataset.shot);
  syncGallery();
}

if (typeof lightbox.showModal === 'function') {
  for (const shot of shots) {
    shot.addEventListener('click', (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = shot;
      history.pushState({ gallery: true }, '', '#' + shot.dataset.shot);
      syncGallery();
    });
  }
  lightbox.querySelector('.prev').addEventListener('click', () => step(-1));
  lightbox.querySelector('.next').addEventListener('click', () => step(1));
  closeButton.addEventListener('click', closeGallery);
  lightbox.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeGallery();
  });
  stage.addEventListener('click', (event) => {
    if (event.target === stage) closeGallery();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  window.addEventListener('popstate', syncGallery);
  window.addEventListener('hashchange', syncGallery);
  syncGallery();
}
