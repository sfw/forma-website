document.documentElement.classList.add("js");

function byId(id) {
  return document.getElementById(id);
}

function initMenu() {
  var menuToggle = byId("menuToggle");
  var siteNav = byId("siteNav");
  if (!menuToggle || !siteNav) {
    return;
  }

  function closeMenu() {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  var links = siteNav.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1080) closeMenu();
  });
}

function initReveal() {
  var nodes = document.querySelectorAll(".reveal");
  if (nodes.length === 0) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    nodes.forEach(function (node) { node.classList.add("visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  for (var i = 0; i < nodes.length; i += 1) {
    nodes[i].style.transitionDelay = String(Math.min(i * 70, 280)) + "ms";
    observer.observe(nodes[i]);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initReveal();
});
