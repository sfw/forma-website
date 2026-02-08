function byId(id) {
  return document.getElementById(id);
}

function initMenu() {
  var menuToggle = byId("menuToggle");
  var siteNav = byId("siteNav");
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  var links = siteNav.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initReveal() {
  var nodes = document.querySelectorAll(".reveal");
  if (nodes.length === 0) {
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  for (var i = 0; i < nodes.length; i += 1) {
    nodes[i].style.transitionDelay = String(Math.min(i * 70, 320)) + "ms";
    observer.observe(nodes[i]);
  }
}

function initTocSpy() {
  var links = document.querySelectorAll(".reference-toc a[href^=\"#\"]");
  if (links.length === 0) {
    return;
  }

  var linkById = {};
  links.forEach(function (link) {
    var targetId = link.getAttribute("href").slice(1);
    linkById[targetId] = link;
  });

  function setActive(id) {
    links.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll(".reference-content section[id]"));
  if (sections.length === 0) {
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    var visibleIds = entries
      .filter(function (entry) { return entry.isIntersecting; })
      .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; })
      .map(function (entry) { return entry.target.id; });

    if (visibleIds.length > 0) {
      setActive(visibleIds[0]);
    }
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "-28% 0px -58% 0px"
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });

  var hash = window.location.hash ? window.location.hash.slice(1) : "";
  if (hash && linkById[hash]) {
    setActive(hash);
  } else if (sections[0]) {
    setActive(sections[0].id);
  }
}

function initShowcaseViewer() {
  var examples = window.FORMA_SHOWCASE_EXAMPLES;
  if (!Array.isArray(examples) || examples.length === 0) {
    return;
  }

  var select = byId("showcaseSelect");
  var code = byId("showcaseCode");
  var tier = byId("showcaseTier");
  var concepts = byId("showcaseConcepts");
  var source = byId("showcaseSource");

  if (!select || !code || !tier || !concepts || !source) {
    return;
  }

  select.innerHTML = "";
  for (var i = 0; i < examples.length; i += 1) {
    var option = document.createElement("option");
    option.value = String(i);
    option.textContent = examples[i].id.replace(/_/g, " ") + " - " + examples[i].title;
    select.appendChild(option);
  }

  function render(index) {
    var safeIndex = Math.max(0, Math.min(index, examples.length - 1));
    var item = examples[safeIndex];
    select.value = String(safeIndex);
    code.textContent = item.code;
    tier.textContent = item.tier;
    concepts.textContent = "Concepts: " + item.concepts;
    source.href = item.githubUrl;
    source.textContent = "Open " + item.file;
  }

  select.addEventListener("change", function (event) {
    render(Number(event.target.value));
  });

  render(0);
}

document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initReveal();
  initTocSpy();
  initShowcaseViewer();
});
