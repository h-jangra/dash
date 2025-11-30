class Router {
  constructor() {
    this.routes = {
      '/': 'pages/home.html',
      '/settings': 'pages/settings.html',
      '/about': 'pages/about.html'
    };
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-route]')) {
        this.navigate(e.target.getAttribute('data-route'));
      }
    });

    window.addEventListener('popstate', () => {
      this.loadRoute(window.location.hash.slice(1) || '/');
    });

    this.navigate(window.location.hash.slice(1) || '/', false);
  }

  navigate(route, pushState = true) {
    if (pushState) window.history.pushState(null, '', `#${route}`);
    this.loadRoute(route);
  }

  async loadRoute(route) {
    const path = this.routes[route] || this.routes['/'];

    try {
      const response = await fetch(path);
      const html = await response.text();
      document.getElementById('content').innerHTML = html;
      this.updateActiveNav(route);
      this.loadScriptsFromHTML(html);
    } catch {
      document.getElementById('content').innerHTML = '<h2>Page not found</h2>';
    }
  }

  loadScriptsFromHTML(html) {
    document.querySelectorAll('script[data-dynamic]').forEach(script => script.remove());

    const scriptMatch = html.match(/<script src="([^"]+)"><\/script>/);
    if (scriptMatch) {
      const scriptSrc = scriptMatch[1];
      this.loadScript(scriptSrc);
    }
  }

  loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute('data-dynamic', 'true');
    document.body.appendChild(script);
  }

  updateActiveNav(route) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-route') === route);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Router();
});
