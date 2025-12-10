// router para navegacion SPA
const routes = {
  "/login": {
    render: () => window.renderLogin(),
    requiresAuth: false,
  },
  "/register": {
    render: () => window.renderRegister(),
    requiresAuth: false,
  },
  "/dashboard": {
    render: () => window.renderDashboard(),
    requiresAuth: true,
  },
  "/proveedores": {
    render: () => window.renderProveedores(),
    requiresAuth: true,
  },
  "/productos": {
    render: () => window.renderProductos(),
    requiresAuth: true,
  },
  "/clientes": {
    render: () => window.renderClientes(),
    requiresAuth: true,
  },
  "/ventas": {
    render: () => window.renderVentas(),
    requiresAuth: true,
  },
};

function getCurrentPath() {
  const hash = window.location.hash || "#/login";
  return hash.slice(1);
}

function navigateTo(path) {
  window.location.hash = "#" + path;
}

function router() {
  const path = getCurrentPath();
  const route = routes[path];

  if (!route) {
    if (isAuthenticated()) {
      navigateTo("/proveedores");
    } else {
      navigateTo("/login");
    }
    return;
  }

  if (route.requiresAuth && !isAuthenticated()) {
    navigateTo("/login");
    return;
  }

  if (
    !route.requiresAuth &&
    isAuthenticated() &&
    (path === "/login" || path === "/register")
  ) {
    navigateTo("/proveedores");
    return;
  }

  route.render();

  const navbar = document.querySelector("navbar-component");
  if (navbar) {
    navbar.update();
  }
}

window.addEventListener("hashchange", router);

window.router = router;
window.navigateTo = navigateTo;
