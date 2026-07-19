document.addEventListener('DOMContentLoaded', () => {
  
  /* ----------------------------------------------------
     1. TYPEWRITER EFFECT (JOURNAL ENTRY 01)
     ---------------------------------------------------- */
  const typewriterText = "I’m just an ordinary person trying to become a better version of myself through learning, building, failing, and improving a little every day.";
  const typewriterEl = document.getElementById('typewriter-text');
  const heroSection = document.getElementById('home');
  let typewriterStarted = false;

  // Observe hero section visibility to start typewriter
  const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typewriterStarted) {
        typewriterStarted = true;
        typewriterEl.classList.add('typing');
        runTypewriter();
        typewriterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  if (heroSection && typewriterEl) {
    typewriterObserver.observe(heroSection);
  }

  function runTypewriter() {
    let index = 0;
    typewriterEl.textContent = "";

    function typeChar() {
      if (index < typewriterText.length) {
        typewriterEl.textContent += typewriterText.charAt(index);
        index++;
        // Natural typewriter speed variability (delay between 20ms and 45ms)
        const delay = Math.random() * 25 + 20; 
        setTimeout(typeChar, delay);
      } else {
        typewriterEl.classList.remove('typing');
        typewriterEl.classList.add('typed');
      }
    }
    setTimeout(typeChar, 300);
  }

  /* ----------------------------------------------------
     2. INTERSECTION OBSERVER FOR SCROLL REVEALS
     ---------------------------------------------------- */
  const revealItems = document.querySelectorAll('.reveal');
  
  const revealObserverOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -60px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Apply slight delay to stagger animations in the same scroll window
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  /* ----------------------------------------------------
     3. ACTIVE SECTION TRACKING & NAV LINK SLIDER
     ---------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const activeNavObserverOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: '-10% 0px -40% 0px'
  };

  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, activeNavObserverOptions);

  sections.forEach(sec => {
    activeNavObserver.observe(sec);
  });

  /* ----------------------------------------------------
     4. MAGNETIC HOVER EFFECT ON NAVBAR LINKS
     ---------------------------------------------------- */
  const magneticItems = document.querySelectorAll('.nav-link, .logo');

  magneticItems.forEach(item => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        // Calculate coordinate offsets relative to center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Move element slightly toward cursor
        item.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translate3d(0, 0, 0)';
      });
    }
  });

  /* ----------------------------------------------------
     5. MOBILE HAMBURGER MENU TOGGLE
     ---------------------------------------------------- */
  const burgerBtn = document.getElementById('mobile-burger-btn');
  const navLinksContainer = document.getElementById('navigation-links');

  if (burgerBtn && navLinksContainer) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      burgerBtn.classList.toggle('active');
      burgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile drop-down when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        burgerBtn.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ----------------------------------------------------
     6. CARD TILT / PARALLAX ON HOVER
     ---------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.tilt-card, .gallery-item');

  tiltCards.forEach(card => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const baseRotation = parseFloat(card.dataset.rotation || '0');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate mouse position relative to center of element
        const rotateX = ((y - centerY) / centerY) * -6; // pitch
        const rotateY = ((x - centerX) / centerX) * 6;  // yaw

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${baseRotation}deg) scale(1.025)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) rotateZ(${baseRotation}deg) scale(1)`;
      });
    }
  });

  /* ----------------------------------------------------
     7. CURSOR FOLLOWER WITH LERP INTERPOLATION
     ---------------------------------------------------- */
  const follower = document.querySelector('.cursor-follower');
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isFirstMove = true;

  if (follower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    
    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (isFirstMove) {
        currentX = targetX;
        currentY = targetY;
        follower.style.opacity = '1';
        isFirstMove = false;
      }
    });

    function renderFollower() {
      // Linear interpolation lag (12% speed transition)
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      follower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderFollower);
    }
    
    requestAnimationFrame(renderFollower);
    
    // Scale follower during hovers on clickable/interactive items
    const interactables = document.querySelectorAll('a, button, .card, .social-card, .gallery-item');
    
    interactables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        follower.style.width = '24px';
        follower.style.height = '24px';
        follower.style.backgroundColor = 'var(--orange)';
        follower.style.boxShadow = '1px 1px 0px 0px var(--fg)';
        follower.style.transform += ' rotate(45deg)';
      });
      
      item.addEventListener('mouseleave', () => {
        follower.style.width = '16px';
        follower.style.height = '16px';
        follower.style.backgroundColor = 'var(--yellow)';
        follower.style.boxShadow = '2px 2px 0px 0px var(--fg)';
      });
    });
  }
});
