// Destaca o link ativo na barra lateral de acordo com a URL atual
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Transições suaves entre páginas
  document.querySelectorAll('.nav-link, .header-view-switch').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      }
    });
  });

  // Initialize sidebar as collapsed
  const sidebar = document.getElementById('globalSidebar');
  if (sidebar) {
    sidebar.classList.add('collapsed');
  }
});

/* ==========================================================================
   SIDEBAR RETRÁTIL
   ========================================================================== */
function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
}