/* main.js
 - theme switch (persist)
 - matrix effect (subtle)
 - small header behavior
*/

(() => {
  // THEME SWITCH
  const themeToggle = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rc_theme', next);
    // animate small pulse
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.classList.add('transform','scale-95');
      setTimeout(()=>btn.classList.remove('transform','scale-95'),220);
    }
  };
  // initialize theme
  const initTheme = () => {
    const saved = localStorage.getItem('rc_theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      // respect system preference
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      document.documentElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    }
  };

  // matrix effect (very subtle code rain)
  const initMatrix = () => {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    const cols = Math.floor(w / 18) + 1;
    const ypos = Array(cols).fill(0);
    const letters = '01<>/{}[]()<>+-=/*abcdefghijklmnopqrstuvwxyz0123456789';
    const draw = () => {
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.05)';
      ctx.fillRect(0,0,w,h);
      ctx.fillStyle = 'rgba(0, 200, 120, 0.6)';
      ctx.font = '12px monospace';
      for (let i=0;i<ypos.length;i++){
        const text = letters.charAt(Math.floor(Math.random()*letters.length));
        const x = i*18;
        ctx.fillText(text, x, ypos[i]*14);
        if (ypos[i]*14 > h && Math.random() > 0.975) ypos[i] = 0;
        ypos[i]++;
      }
    };
    let raf;
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    loop();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
    });
  };

  // small header shadow on scroll
  const initHeaderBehavior = () => {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) header.classList.add('backdrop-blur-md','bg-slate-900/40','border-b','border-white/6');
      else header.classList.remove('backdrop-blur-md','bg-slate-900/40','border-b','border-white/6');
    });
  };

  // run inits on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMatrix();
    initHeaderBehavior();

    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.addEventListener('click', themeToggle);

    // link active state (simple)
    const navLinks = document.querySelectorAll('.site-nav a');
    navLinks.forEach(a => {
      if (a.href === location.href || location.href.includes(a.getAttribute('href'))) {
        a.classList.add('active');
      }
    });

    // small hero parallax effect (on move)
    const heroImg = document.querySelector('.hero-image');
    if (heroImg) {
      window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / innerWidth - 0.5) * 8;
        const ny = (e.clientY / innerHeight - 0.5) * 8;
        heroImg.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(1.08)`;
      });
      window.addEventListener('mouseleave', ()=> heroImg.style.transform = 'scale(1.08)');
    }
  });

})();
