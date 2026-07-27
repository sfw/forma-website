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
    nodes.forEach(function (node) { node.classList.add("is-visible"); });
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
  var tocNav = document.querySelector(".reference-toc nav");

  var linkById = {};
  links.forEach(function (link) {
    var targetId = link.getAttribute("href").slice(1);
    linkById[targetId] = link;
  });

  var currentActive = "";

  function setActive(id) {
    if (id === currentActive) {
      return;
    }
    currentActive = id;
    links.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.classList.add("active");
        link.setAttribute("aria-current", "location");
        if (tocNav && tocNav.scrollHeight - tocNav.clientHeight > 2) {
          link.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
        }
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll(".reference-content section[id]"));
  if (sections.length === 0) {
    return;
  }

  function getCurrentSection() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var offset = window.innerHeight * 0.28;
    var target = scrollTop + offset;
    var currentId = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= target) {
        currentId = sections[i].id;
      } else {
        break;
      }
    }
    return currentId;
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        setActive(getCurrentSection());
        ticking = false;
      });
      ticking = true;
    }
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var targetId = link.getAttribute("href").slice(1);
      setTimeout(function () { setActive(targetId); }, 60);
    });
  });

  var hash = window.location.hash ? window.location.hash.slice(1) : "";
  if (hash && linkById[hash]) {
    setActive(hash);
  } else {
    setActive(getCurrentSection());
  }
}

function initShowcaseViewer() {
  var checkedFiles = new Set([
    "01_hello_world.forma",
    "02_fizzbuzz.forma",
    "03_99_bottles.forma",
    "04_factorial.forma",
    "05_fibonacci.forma",
    "06_primes.forma",
    "07_gcd_lcm.forma",
    "17a_error_handling.forma",
    "19_verified_math.forma"
  ]);
  var allExamples = window.FORMA_SHOWCASE_EXAMPLES;
  var examples = Array.isArray(allExamples)
    ? allExamples.filter(function (item) { return checkedFiles.has(item.file); })
    : [];
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

function initCompleteReference() {
  var data = window.FORMA_REFERENCE_DATA;
  var dataset = byId("referenceDataset");
  var search = byId("referenceSearch");
  var filter = byId("referenceFilter");
  var clear = byId("referenceClear");
  var results = byId("referenceResults");
  var count = byId("referenceCount");
  var version = byId("referenceVersion");

  if (!data || !dataset || !search || !filter || !clear || !results || !count) {
    return;
  }

  if (version) {
    version.textContent = "Forma " + data.version;
  }

  function listValue(value) {
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "None";
    }
    if (value === null || value === undefined || value === "") {
      return "None";
    }
    return String(value);
  }

  function genericRecords(name) {
    if (name === "keywords") {
      return data.keywords.map(function (item) {
        return {
          name: item.canonical,
          syntax: item.canonical,
          category: item.contextual ? "Contextual keyword" : "Reserved keyword",
          description: item.name + (item.aliases.length ? " · aliases: " + item.aliases.join(", ") : " · no aliases"),
          aliases: item.aliases,
          contextual: item.contextual ? "Yes" : "No"
        };
      });
    }

    if (name === "productions") {
      return data.productions.map(function (item) {
        return {
          name: item.name,
          syntax: item.expression,
          category: "Grammar production",
          description: "Generated EBNF production"
        };
      });
    }

    if (name === "operators") {
      var operators = [];
      Object.keys(data.operators).forEach(function (group) {
        data.operators[group].forEach(function (operator) {
          operators.push({
            name: operator,
            syntax: operator,
            category: group.charAt(0).toUpperCase() + group.slice(1),
            description: group + " operator"
          });
        });
      });
      return operators;
    }

    return Array.isArray(data[name]) ? data[name] : [];
  }

  function currentRecords() {
    return dataset.value === "builtins" ? data.builtins : genericRecords(dataset.value);
  }

  function appendOption(value, label) {
    var option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    filter.appendChild(option);
  }

  function uniqueValues(records, field) {
    var values = [];
    records.forEach(function (item) {
      var value = listValue(item[field]);
      if (values.indexOf(value) === -1) {
        values.push(value);
      }
    });
    return values.sort();
  }

  function rebuildFilter() {
    var records = currentRecords();
    filter.innerHTML = "";
    appendOption("all", "All " + dataset.options[dataset.selectedIndex].text.toLowerCase());

    if (dataset.value === "builtins") {
      uniqueValues(records, "capability").forEach(function (value) {
        appendOption("capability::" + value, value === "None" ? "Capability · none" : "Capability · " + value);
      });
      uniqueValues(records, "native").forEach(function (value) {
        appendOption("native::" + value, "Native · " + value);
      });
      uniqueValues(records, "verification").forEach(function (value) {
        appendOption("verification::" + value, "Verification · " + value);
      });
      uniqueValues(records, "interpreter").forEach(function (value) {
        appendOption("interpreter::" + value, "Interpreter · " + value);
      });
    } else {
      uniqueValues(records, "category").forEach(function (value) {
        appendOption("category::" + value, value);
      });
    }
  }

  function matchesFilter(item) {
    if (filter.value === "all") {
      return true;
    }
    var parts = filter.value.split("::");
    return listValue(item[parts[0]]) === parts.slice(1).join("::");
  }

  function matchesSearch(item) {
    var query = search.value.trim().toLowerCase();
    if (!query) {
      return true;
    }
    return JSON.stringify(item).toLowerCase().indexOf(query) !== -1;
  }

  function addMeta(list, label, value) {
    var wrapper = document.createElement("div");
    var term = document.createElement("dt");
    var detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = listValue(value);
    wrapper.appendChild(term);
    wrapper.appendChild(detail);
    list.appendChild(wrapper);
  }

  function renderBuiltin(item) {
    var article = document.createElement("article");
    article.className = "reference-entry";

    var head = document.createElement("div");
    head.className = "reference-entry-head";
    var title = document.createElement("h3");
    title.textContent = item.name;
    var badge = document.createElement("span");
    badge.className = "reference-entry-badge";
    badge.textContent = item.capability || (item.pure ? "Pure" : "Ungated");
    head.appendChild(title);
    head.appendChild(badge);

    var signature = document.createElement("code");
    signature.className = "reference-entry-signature";
    signature.textContent = item.signature;

    var description = document.createElement("p");
    description.textContent = item.documentation;

    var meta = document.createElement("dl");
    meta.className = "reference-entry-meta";
    addMeta(meta, "Parameter modes", item.parameterModes);
    addMeta(meta, "Effects", item.effects);
    addMeta(meta, "Capability", item.capability);
    addMeta(meta, "Interpreter", item.interpreter);
    addMeta(meta, "Native", item.native);
    addMeta(meta, "Verification", item.verification);

    article.appendChild(head);
    article.appendChild(signature);
    article.appendChild(description);
    article.appendChild(meta);
    return article;
  }

  function renderGeneric(item) {
    var article = document.createElement("article");
    article.className = "reference-entry";

    var head = document.createElement("div");
    head.className = "reference-entry-head";
    var title = document.createElement("h3");
    title.textContent = item.name;
    var badge = document.createElement("span");
    badge.className = "reference-entry-badge";
    badge.textContent = item.category || dataset.options[dataset.selectedIndex].text;
    head.appendChild(title);
    head.appendChild(badge);

    var signature = document.createElement("code");
    signature.className = "reference-entry-signature";
    signature.textContent = item.syntax || item.expression || item.name;

    var description = document.createElement("p");
    description.textContent = item.description || "";

    article.appendChild(head);
    article.appendChild(signature);
    article.appendChild(description);

    if (item.aliases || item.contextual || item.kind) {
      var meta = document.createElement("dl");
      meta.className = "reference-entry-meta";
      if (item.aliases) addMeta(meta, "Aliases", item.aliases);
      if (item.contextual) addMeta(meta, "Contextual", item.contextual);
      if (item.kind) addMeta(meta, "Kind", item.kind);
      article.appendChild(meta);
    }
    return article;
  }

  function render() {
    var all = currentRecords();
    var visible = all.filter(function (item) {
      return matchesFilter(item) && matchesSearch(item);
    });
    var fragment = document.createDocumentFragment();
    results.innerHTML = "";

    if (visible.length === 0) {
      var empty = document.createElement("p");
      empty.className = "reference-empty";
      empty.textContent = "No reference entries match those filters.";
      fragment.appendChild(empty);
    } else {
      visible.forEach(function (item) {
        fragment.appendChild(dataset.value === "builtins" ? renderBuiltin(item) : renderGeneric(item));
      });
    }

    results.appendChild(fragment);
    count.textContent = "Showing " + visible.length + " of " + all.length + " " +
      dataset.options[dataset.selectedIndex].text.toLowerCase() + ".";
  }

  dataset.addEventListener("change", function () {
    search.value = "";
    rebuildFilter();
    render();
  });
  search.addEventListener("input", render);
  filter.addEventListener("change", render);
  clear.addEventListener("click", function () {
    search.value = "";
    filter.value = "all";
    render();
    search.focus();
  });

  rebuildFilter();
  render();
}

document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initReveal();
  initTocSpy();
  initShowcaseViewer();
  initCompleteReference();
});
