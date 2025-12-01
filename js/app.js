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
        e.preventDefault();
        this.navigate(e.target.getAttribute('data-route'));
      }
    });

    window.addEventListener('popstate', () => {
      this.loadRoute(window.location.hash.slice(1) || '/');
    });

    const initialRoute = window.location.hash.slice(1) || '/';
    this.loadRoute(initialRoute);
    this.updateActiveNav(initialRoute);
  }

  navigate(route, pushState = true) {
    if (pushState) {
      window.history.pushState(null, '', `#${route}`);
    }
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
      this.updateActiveNav(route);
    }
  }

  loadScriptsFromHTML(html) {
    document.querySelectorAll('script[data-dynamic]').forEach(script => script.remove());

    const scriptMatch = html.match(/<script src="([^"]+)"><\/script>/);
    if (scriptMatch) {
      const scriptSrc = scriptMatch[1];
      this.fetchAndExecuteScript(scriptSrc);
    }
  }

  async fetchAndExecuteScript(src) {
    try {
      const response = await fetch(src + '?t=' + Date.now());
      const scriptContent = await response.text();
      const wrappedScript = `(function() { ${scriptContent} })();`;

      const script = document.createElement('script');
      script.textContent = wrappedScript;
      script.setAttribute('data-dynamic', 'true');
      document.body.appendChild(script);

    } catch (error) {
      console.error('Failed to load script:', error);
    }
  }

  updateActiveNav(route) {
    document.querySelectorAll('nav button[data-route]').forEach(btn => {
      btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`nav button[data-route="${route}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new Router());
