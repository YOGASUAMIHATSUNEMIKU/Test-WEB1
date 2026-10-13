const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const revealEls = document.querySelectorAll('.reveal');
const backToTop = document.querySelector('.back-to-top');
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-nav.prev');
const nextButton = document.querySelector('.lightbox-nav.next');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => observer.observe(el));

const updateBackToTop = () => {
  if (!backToTop) return;
  if (window.scrollY > 450) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
};

window.addEventListener('scroll', updateBackToTop);
updateBackToTop();

let activeIndex = 0;

const openLightbox = (index) => {
  if (!lightbox || !galleryItems.length) return;

  activeIndex = index;
  const item = galleryItems[activeIndex];
  const image = item.querySelector('img');
  const caption = item.querySelector('figcaption')?.textContent || '';

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const moveLightbox = (direction) => {
  if (!galleryItems.length) return;
  activeIndex = (activeIndex + direction + galleryItems.length) % galleryItems.length;
  openLightbox(activeIndex);
};

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

if (closeButton) {
  closeButton.addEventListener('click', closeLightbox);
}

if (prevButton) {
  prevButton.addEventListener('click', () => moveLightbox(-1));
}

if (nextButton) {
  nextButton.addEventListener('click', () => moveLightbox(1));
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (lightbox && lightbox.classList.contains('is-open')) {
    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowRight') {
      moveLightbox(1);
    }

    if (event.key === 'ArrowLeft') {
      moveLightbox(-1);
    }
  }
});
