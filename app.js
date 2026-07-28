document.documentElement.classList.add("js");

const SHOWCASE = Array.isArray(window.FORMA_SHOWCASE_EXAMPLES) ? window.FORMA_SHOWCASE_EXAMPLES : [];
const SHOWCASE_BY_FILE = new Map(SHOWCASE.map((item) => [item.file, item]));

function sourceFor(file, fallback) {
  const example = SHOWCASE_BY_FILE.get(file);
  return example && typeof example.code === "string" ? example.code.trimEnd() : fallback.trim();
}

const EXAMPLES = [
  {
    id: "hello",
    name: "Hello World",
    output: "Hello, World!",
    code: sourceFor("01_hello_world.forma", `f main()\n    print("Hello, World!")`)
  },
  {
    id: "fizzbuzz",
    name: "FizzBuzz",
    output: "1\n2\nFizz\n4\nBuzz\n…",
    code: sourceFor("02_fizzbuzz.forma", `f main()\n    print("FizzBuzz")`)
  },
  {
    id: "factorial",
    name: "Factorial",
    output: "Factorial examples:\n5! = 120\n10! = 3628800\n…",
    code: sourceFor("04_factorial.forma", `f factorial(n: Int) -> Int\n    if n <= 1 then 1 else n * factorial(n - 1)`)
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    output: "First 20 Fibonacci numbers:\nF(0) = 0\nF(1) = 1\n…",
    code: sourceFor("05_fibonacci.forma", `f fib(n: Int) -> Int\n    if n <= 1 then n else fib(n - 1) + fib(n - 2)`)
  },
  {
    id: "primes",
    name: "Prime Numbers",
    output: "Primes up to 50:\n2\n3\n5\n…",
    code: sourceFor("06_primes.forma", `f main()\n    print(17)`)
  },
  {
    id: "gcd",
    name: "GCD and LCM",
    output: "GCD examples:\ngcd(48, 18) = 6\n…",
    code: sourceFor("07_gcd_lcm.forma", `f gcd(a: Int, b: Int) -> Int\n    if b == 0 then a else gcd(b, a % b)`)
  }
];

const STATUS_ITEMS = [
  { label: "Shared CompilerSession and typed, ownership-explicit MIR", state: "implemented" },
  { label: "Affine moves, non-lexical loans, partial moves, and deterministic drop glue", state: "implemented" },
  { label: "Generated grammar artifacts and lossless formatter round trips", state: "implemented" },
  { label: "Central builtin effects and runtime capability gates", state: "implemented" },
  { label: "Structured tasks with affine handles and Send/Sync checks", state: "implemented" },
  { label: "Deterministic modules, pub visibility, local path manifests, and lockfiles", state: "implemented" },
  { label: "Tiered verification with distinct confidence statuses", state: "implemented" },
  { label: "Semantic diagnostics, hover, completion, navigation, references, and formatting", state: "implemented" },
  { label: "LLVM backend for the documented Core subset", state: "experimental" },
  { label: "SMT-backed scalar, tuple, struct, and invariant verification for a pure supported subset", state: "experimental" },
  { label: "User-defined observable destructor bodies", state: "experimental" },
  { label: "Registry and Git package sources", state: "next" },
  { label: "Namespace-preserving hierarchical module scopes", state: "next" },
  { label: "Richer LSP member ranking and refactoring", state: "next" },
  { label: "Bytecode VM if measurements justify another backend", state: "next" }
];

const HERO_SCENARIOS = [
  {
    command: "forma verify rules.forma --level exhaustive --report",
    output: [
      "✓ EXHAUSTIVE identity obligations:1 examples:2/2",
      "Finite Bool domain checked completely.",
      "The report says exactly what was established."
    ]
  },
  {
    command: "forma check app.forma --error-format json",
    output: [
      "The shared compiler pipeline completed.",
      "Ownership, effects, and types use one source map.",
      "Diagnostics are machine-readable for repair loops."
    ]
  },
  {
    command: "forma verify invariants.forma --level formal --report",
    output: [
      "✓ PROVED establish_account obligations:2",
      "✓ PROVED preserve_account obligations:2",
      "Struct invariant status: PROVED by Z3."
    ]
  },
  {
    command: "forma grammar --format json > forma-grammar.json",
    output: [
      "Grammar exported from the structured source model.",
      "Aliases and precedence stay aligned with tooling.",
      "Ready for constrained generation pipelines."
    ]
  },
  {
    command: "forma run app.forma --allow-read",
    output: [
      "Read authority granted to this execution.",
      "Network, process, environment, and unsafe remain denied.",
      "Effects describe authority; flags grant it."
    ]
  }
];

const SHORT_KEYWORDS = ["f", "s", "e", "t", "i", "m", "us", "md", "wh", "lp", "br", "ct", "ret", "as", "sp", "aw"];
const LONG_KEYWORDS = ["fn", "struct", "enum", "trait", "impl", "match", "use", "mod", "while", "loop", "break", "continue", "return", "async", "spawn", "await"];

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initMenu() {
  const toggle = byId("menuToggle");
  const nav = byId("siteNav");
  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
  });
}

function initHeroCommands() {
  const command = byId("heroCommand");
  const lines = [byId("heroOutputLine1"), byId("heroOutputLine2"), byId("heroOutputLine3")];
  if (!command || lines.some((line) => !line)) return;

  function render(scenario) {
    command.textContent = scenario.command;
    lines.forEach((line, index) => { line.textContent = scenario.output[index]; });
  }

  render(HERO_SCENARIOS[0]);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let index = 0;
  window.setInterval(() => {
    if (document.hidden) return;
    index = (index + 1) % HERO_SCENARIOS.length;
    render(HERO_SCENARIOS[index]);
  }, 7000);
}

function populateExamples() {
  const select = byId("exampleSelect");
  if (!select) return;
  select.innerHTML = EXAMPLES.map((example) => `<option value="${escapeHtml(example.id)}">${escapeHtml(example.name)}</option>`).join("");
}

function selectedExample() {
  const select = byId("exampleSelect");
  return select ? EXAMPLES.find((example) => example.id === select.value) : undefined;
}

function inspectCode(code) {
  const lines = code.split(/\r?\n/);
  const notices = [];
  let inString = false;
  let quote = "";
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };

  lines.forEach((line, lineIndex) => {
    if (line.includes("\t")) {
      notices.push({ severity: "error", line: lineIndex + 1, message: "Tab indentation detected.", suggestion: "Use spaces so indentation is unambiguous." });
    }
    if (line.trim() && line.match(/^ */)[0].length % 4 !== 0) {
      notices.push({ severity: "warn", line: lineIndex + 1, message: "Indentation is not a multiple of four spaces.", suggestion: "Run `forma fmt` for canonical formatting." });
    }

    for (let column = 0; column < line.length; column += 1) {
      const character = line[column];
      const previous = line[column - 1];
      if (!inString && character === "#") break;
      if ((character === '"' || character === "'") && previous !== "\\") {
        if (!inString) { inString = true; quote = character; }
        else if (quote === character) { inString = false; quote = ""; }
        continue;
      }
      if (inString) continue;
      if ("([{".includes(character)) stack.push({ character, line: lineIndex + 1 });
      if (pairs[character]) {
        const opener = stack.pop();
        if (!opener || opener.character !== pairs[character]) {
          notices.push({ severity: "error", line: lineIndex + 1, message: `Unmatched delimiter ${character}.`, suggestion: "Balance parentheses, brackets, and braces." });
          break;
        }
      }
    }
  });

  if (stack.length) {
    const opener = stack[stack.length - 1];
    notices.push({ severity: "error", line: opener.line, message: `Missing closer for ${opener.character}.`, suggestion: "Balance parentheses, brackets, and braces." });
  }
  if (!/\bf\s+main\s*\(/.test(code)) {
    notices.push({ severity: "info", message: "This snippet has no main entrypoint.", suggestion: "That is valid for a module; add `f main()` for an executable." });
  }

  const shortPattern = new RegExp(`\\b(${SHORT_KEYWORDS.join("|")})\\b`, "g");
  const longPattern = new RegExp(`\\b(${LONG_KEYWORDS.join("|")})\\b`, "g");
  const shortCount = (code.match(shortPattern) || []).length;
  if ((code.match(longPattern) || []).length) {
    notices.push({ severity: "info", message: "Readable long aliases detected.", suggestion: "Short canonical forms can reduce generation tokens; both forms are intentional." });
  }

  return {
    lineCount: lines.filter((line) => line.trim()).length,
    estimatedTokens: Math.ceil(code.length / 4),
    shortCount,
    notices
  };
}

function diagnosticMarkup(notice) {
  const severityClass = notice.severity === "error" ? "error" : notice.severity === "warn" ? "warn" : "";
  const line = notice.line ? ` · line ${notice.line}` : "";
  const suggestion = notice.suggestion ? `<br><strong>Next:</strong> ${escapeHtml(notice.suggestion)}` : "";
  return `<li class="diagnostic-item ${severityClass}"><strong>${escapeHtml(notice.severity.toUpperCase())}${line}</strong>: ${escapeHtml(notice.message)}${suggestion}</li>`;
}

function analyzeCurrentCode() {
  const editor = byId("codeEditor");
  const list = byId("diagnosticList");
  const json = byId("jsonDiagnostic");
  if (!editor || !list || !json) return;

  const result = inspectCode(editor.value);
  byId("metricTokens").textContent = String(result.estimatedTokens);
  byId("metricShorthand").textContent = String(result.shortCount);
  byId("metricWarnings").textContent = String(result.notices.length);
  byId("metricLines").textContent = String(result.lineCount);

  list.innerHTML = result.notices.length
    ? result.notices.map(diagnosticMarkup).join("")
    : '<li class="diagnostic-item"><strong>NO LOCAL NOTICES</strong>: Run <code>forma check</code> for compiler-authoritative diagnostics.</li>';

  const first = result.notices.find((notice) => notice.severity === "error") || result.notices[0];
  json.textContent = JSON.stringify(first ? {
    status: "local_notice",
    severity: first.severity,
    message: first.message,
    line: first.line || null,
    next_command: "forma check playground.forma --error-format json"
  } : {
    status: "no_local_notices",
    metrics: { estimated_tokens: result.estimatedTokens, shorthand_hits: result.shortCount, non_empty_lines: result.lineCount },
    next_command: "forma check playground.forma --error-format json"
  }, null, 2);
}

function loadSelectedExample() {
  const editor = byId("codeEditor");
  const example = selectedExample();
  if (!editor || !example) return;
  editor.value = example.code;
  byId("simulatedOutput").textContent = "Choose “Show expected output” to preview this checked example.";
  analyzeCurrentCode();
}

function showExpectedOutput() {
  const editor = byId("codeEditor");
  const output = byId("simulatedOutput");
  const example = selectedExample();
  if (!editor || !output) return;
  if (example && editor.value.trim() === example.code.trim()) {
    output.textContent = `${example.output}\n\nAuthoritative run: forma run examples/showcase/${SHOWCASE.find((item) => item.code.trim() === example.code.trim())?.file || "<file>.forma"}`;
  } else {
    output.textContent = "Expected output is only available for an unchanged checked example.\nRun locally: forma run playground.forma";
  }
}

async function copyText(value) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  const temporary = document.createElement("textarea");
  temporary.value = value;
  document.body.appendChild(temporary);
  temporary.select();
  const copied = document.execCommand("copy");
  temporary.remove();
  return copied;
}

function flashButton(button, label) {
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => { button.textContent = original; }, 1200);
}

function renderStatus(filter = "all") {
  const list = byId("roadmapList");
  if (!list) return;
  const items = STATUS_ITEMS.filter((item) => filter === "all" || item.state === filter);
  list.innerHTML = items.map((item) => `<article class="roadmap-item ${escapeHtml(item.state)}"><p>${escapeHtml(item.label)}</p><p class="roadmap-state">${escapeHtml(item.state)}</p></article>`).join("");
}

function initStatusFilter() {
  const bar = byId("roadmapFilter");
  if (!bar) return;
  const buttons = bar.querySelectorAll(".filter-btn");
  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    button.addEventListener("click", () => {
      buttons.forEach((candidate) => {
        candidate.classList.remove("active");
        candidate.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      renderStatus(button.dataset.filter || "all");
    });
  });
}

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  nodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 55, 260)}ms`;
    observer.observe(node);
  });
}

function init() {
  initMenu();
  initHeroCommands();
  populateExamples();
  renderStatus();
  initStatusFilter();
  initReveal();

  byId("loadExampleBtn")?.addEventListener("click", loadSelectedExample);
  byId("exampleSelect")?.addEventListener("change", loadSelectedExample);
  byId("analyzeBtn")?.addEventListener("click", analyzeCurrentCode);
  byId("simulateBtn")?.addEventListener("click", showExpectedOutput);
  byId("copyCodeBtn")?.addEventListener("click", async (event) => {
    try {
      const copied = await copyText(byId("codeEditor").value);
      flashButton(event.currentTarget, copied ? "Copied" : "Copy failed");
    } catch (_) {
      flashButton(event.currentTarget, "Copy failed");
    }
  });

  loadSelectedExample();
}

document.addEventListener("DOMContentLoaded", init);
