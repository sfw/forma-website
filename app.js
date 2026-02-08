const SHOWCASE_EXAMPLES = Array.isArray(window.FORMA_SHOWCASE_EXAMPLES) ? window.FORMA_SHOWCASE_EXAMPLES : [];
const SHOWCASE_BY_FILE = new Map(SHOWCASE_EXAMPLES.map((item) => [item.file, item]));

function showcaseCode(file, fallbackCode) {
  const source = SHOWCASE_BY_FILE.get(file);
  if (source && typeof source.code === "string") {
    return source.code.trimEnd();
  }
  return fallbackCode.trim();
}

const EXAMPLES = [
  {
    id: "hello",
    name: "Hello World",
    category: "basic",
    description: "Canonical hello program from the showcase suite.",
    tags: ["output", "strings", "entrypoint"],
    command: "forma run examples/showcase/01_hello_world.forma",
    output: "Hello, World!",
    code: showcaseCode("01_hello_world.forma", `
# Hello World - The canonical first program
f main()
    print("Hello, World!")
`)
  },
  {
    id: "factorial",
    name: "Factorial",
    category: "math",
    description: "Recursive, tail-recursive, and iterative implementations.",
    tags: ["recursion", "math", "functions"],
    command: "forma run examples/showcase/04_factorial.forma",
    output: `Factorial examples:
5! = 120
10! = 3628800`,
    code: showcaseCode("04_factorial.forma", `
# Recursive factorial function
f factorial(n: Int) -> Int
    if n <= 1 then 1 else n * factorial(n - 1)

f main()
    print(factorial(10))
`)
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    category: "math",
    description: "Classic sequence with recursive and iterative forms.",
    tags: ["recursion", "algorithm"],
    command: "forma run examples/showcase/05_fibonacci.forma",
    output: `First 20 Fibonacci numbers:
F(0) = 0
F(1) = 1`,
    code: showcaseCode("05_fibonacci.forma", `
# Recursive Fibonacci function
f fib(n: Int) -> Int
    if n <= 1 then n else fib(n - 1) + fib(n - 2)

f main()
    print(fib(10))
`)
  },
  {
    id: "gcd",
    name: "GCD (Euclid)",
    category: "math",
    description: "Greatest common divisor and LCM algorithms.",
    tags: ["math", "modulo", "algorithm"],
    command: "forma run examples/showcase/07_gcd_lcm.forma",
    output: `GCD examples:
gcd(48, 18) = 6
LCM examples:`,
    code: showcaseCode("07_gcd_lcm.forma", `
# Greatest Common Divisor using Euclidean algorithm
f gcd(a: Int, b: Int) -> Int
    if b == 0 then a else gcd(b, a % b)

f main()
    print(gcd(48, 18))
`)
  },
  {
    id: "sum-loop",
    name: "FizzBuzz",
    category: "control-flow",
    description: "Loop-heavy control-flow example from the showcase suite.",
    tags: ["loops", "state", "iteration"],
    command: "forma run examples/showcase/02_fizzbuzz.forma",
    output: `1
2
Fizz
4
Buzz`,
    code: showcaseCode("02_fizzbuzz.forma", `
f fizzbuzz(n: Int) -> Unit
    i := 1
    wh i <= n
        if i % 15 == 0 then print("FizzBuzz")
        i := i + 1

f main()
    fizzbuzz(100)
`)
  },
  {
    id: "is-prime",
    name: "Prime Numbers",
    category: "logic",
    description: "Prime checks and counting from the mathematical showcase tier.",
    tags: ["bool", "conditions", "number-theory"],
    command: "forma run examples/showcase/06_primes.forma",
    output: `Primes up to 50:
2
3
5`,
    code: showcaseCode("06_primes.forma", `
f is_prime(n: Int) -> Bool
    if n < 2 then false else true

f main()
    print(is_prime(17))
`)
  }
];

const ROADMAP_ITEMS = [
  { label: "Lexer, parser, type checker", state: "shipped" },
  { label: "Borrow checker (second-class references)", state: "shipped" },
  { label: "MIR interpreter", state: "shipped" },
  { label: "Generics with monomorphization", state: "shipped" },
  { label: "Linear types and capability system", state: "shipped" },
  { label: "Module system", state: "shipped" },
  { label: "Standard library (320+ builtins)", state: "shipped" },
  { label: "Grammar export (EBNF, JSON)", state: "shipped" },
  { label: "LLVM native compilation", state: "shipped" },
  { label: "Package manager (path-based dependencies)", state: "shipped" },
  { label: "Async/await with spawn", state: "shipped" },
  { label: "HTTP client and server", state: "shipped" },
  { label: "TCP/UDP sockets and TLS", state: "shipped" },
  { label: "SQLite support", state: "shipped" },
  { label: "LSP diagnostics/completion/hover/goto", state: "shipped" },
  { label: "Formatter and REPL", state: "shipped" },
  { label: "Full LSP refactoring/rename/references", state: "shipped" },
  { label: "Package registry", state: "building" }
];

const GOALS = [
  {
    id: "run",
    label: "Run a program",
    build: ({ file, errorFormat }) => `forma --error-format ${errorFormat} run ${file}`
  },
  {
    id: "check",
    label: "Check source file",
    build: ({ file, errorFormat }) => `forma --error-format ${errorFormat} check ${file}`
  },
  {
    id: "check-partial",
    label: "Check incomplete source",
    build: ({ file, errorFormat }) => `forma --error-format ${errorFormat} check --partial ${file}`
  },
  {
    id: "typeof",
    label: "Query type at location",
    build: ({ file, errorFormat }) => `forma --error-format ${errorFormat} typeof ${file} --line 12 --column 8`
  },
  {
    id: "grammar-json",
    label: "Export grammar JSON",
    build: ({ errorFormat }) => `forma --error-format ${errorFormat} grammar --format json > forma-grammar.json`
  },
  {
    id: "grammar-ebnf",
    label: "Export grammar EBNF",
    build: ({ errorFormat }) => `forma --error-format ${errorFormat} grammar --format ebnf > forma.ebnf`
  },
  {
    id: "fmt",
    label: "Format source file",
    build: ({ file }) => `forma fmt ${file}`
  },
  {
    id: "repl",
    label: "Open REPL",
    build: () => "forma repl"
  },
  {
    id: "new-project",
    label: "Create a new project",
    build: () => "forma new my-forma-app"
  },
  {
    id: "lsp",
    label: "Start LSP server",
    build: () => "forma lsp"
  }
];

const SHORTHAND_KEYWORDS = ["f", "s", "e", "t", "i", "m", "us", "wh", "lp", "br", "ct", "ret", "as", "sp", "aw"];
const LONGFORM_KEYWORDS = ["fn", "struct", "enum", "trait", "impl", "match", "use", "while", "loop", "break", "continue", "return", "async", "spawn", "await"];

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initMenu() {
  const menuToggle = $("menuToggle");
  const siteNav = $("siteNav");
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initHeroCommands() {
  const commandTarget = $("heroCommand");
  const outputLine1 = $("heroOutputLine1");
  const outputLine2 = $("heroOutputLine2");
  const outputLine3 = $("heroOutputLine3");
  if (!commandTarget || !outputLine1 || !outputLine2 || !outputLine3) {
    return;
  }

  const scenarios = [
    {
      command: "forma grammar --format json > forma.json",
      output: [
        "Grammar exported successfully.",
        "Output ready for constrained decoding pipelines.",
        "Wrote 214 rules to ./forma.json"
      ]
    },
    {
      command: "forma check --error-format json app.forma",
      output: [
        "Validation complete: no syntax errors.",
        "warning[W120]: unused binding `debugFlag`",
        "Diagnostics available as machine-readable JSON."
      ]
    },
    {
      command: "forma typeof app.forma --line 18 --column 7",
      output: [
        "Type query resolved at 18:7.",
        "Result<Order, ValidationError>",
        "Use this to debug inference at exact cursor positions."
      ]
    },
    {
      command: "forma run hello.forma",
      output: [
        "Program output:",
        "Hello from FORMA runtime!",
        "Program completed successfully."
      ]
    },
    {
      command: "forma repl",
      output: [
        "Interactive REPL started.",
        "Type expressions to evaluate, or :help for commands.",
        "Session keeps context until you run :reset or :quit."
      ]
    }
  ];

  function renderScenario(scenario) {
    commandTarget.textContent = scenario.command;
    outputLine1.textContent = scenario.output[0];
    outputLine2.textContent = scenario.output[1];
    outputLine3.textContent = scenario.output[2];
  }

  renderScenario(scenarios[0]);

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % scenarios.length;
    renderScenario(scenarios[idx]);
  }, 2600);
}

function populateExamples() {
  const select = $("exampleSelect");
  if (!select) {
    return;
  }

  const optionsHtml = EXAMPLES.map((example) => `<option value="${example.id}">${escapeHtml(example.name)}</option>`).join("");
  select.innerHTML = optionsHtml;
}

function findExampleById(id) {
  return EXAMPLES.find((example) => example.id === id);
}

function loadSelectedExample() {
  const select = $("exampleSelect");
  const editor = $("codeEditor");
  if (!select || !editor) {
    return;
  }

  const example = findExampleById(select.value);
  if (!example) {
    return;
  }

  editor.value = example.code;
  analyzeCurrentCode();
}

function makeDiagnosticItemHtml(issue) {
  const severityClass = issue.severity === "error" ? "error" : issue.severity === "warn" ? "warn" : "";
  const lineText = issue.line ? ` (line ${issue.line})` : "";
  const suggestion = issue.suggestion ? `<br><strong>Suggestion:</strong> ${escapeHtml(issue.suggestion)}` : "";
  return `<li class="diagnostic-item ${severityClass}">
    <strong>${escapeHtml(issue.severity.toUpperCase())}</strong>${lineText}: ${escapeHtml(issue.message)}${suggestion}
  </li>`;
}

function balancedDelimiters(code) {
  const openers = new Set(["(", "{", "["]);
  const pairs = { ")": "(", "}": "{", "]": "[" };
  const stack = [];
  let line = 1;
  let col = 0;

  for (let i = 0; i < code.length; i += 1) {
    const ch = code[i];
    if (ch === "\n") {
      line += 1;
      col = 0;
      continue;
    }
    col += 1;

    if (openers.has(ch)) {
      stack.push({ ch, line, col });
      continue;
    }
    if (pairs[ch]) {
      const last = stack.pop();
      if (!last || last.ch !== pairs[ch]) {
        return {
          ok: false,
          issue: {
            severity: "error",
            message: `Unmatched delimiter "${ch}"`,
            line,
            suggestion: "Check parentheses, brackets, and braces."
          }
        };
      }
    }
  }

  if (stack.length > 0) {
    const dangling = stack[stack.length - 1];
    return {
      ok: false,
      issue: {
        severity: "error",
        message: `Missing closing delimiter for "${dangling.ch}"`,
        line: dangling.line,
        suggestion: "Close all opened delimiters before running."
      }
    };
  }

  return { ok: true };
}

function analyzeCode(code) {
  const lines = code.split(/\r?\n/);
  const nonEmptyLineCount = lines.filter((line) => line.trim().length > 0).length;
  const estimatedTokens = Math.ceil(code.length / 4);
  const rustEquivalent = Math.round(estimatedTokens / 0.62);

  const shorthandRegex = new RegExp(`\\b(${SHORTHAND_KEYWORDS.join("|")})\\b`, "g");
  const longformRegex = new RegExp(`\\b(${LONGFORM_KEYWORDS.join("|")})\\b`, "g");

  const shorthandHits = (code.match(shorthandRegex) || []).length;
  const longformHits = (code.match(longformRegex) || []).length;

  const issues = [];

  lines.forEach((line, index) => {
    if (line.includes("\t")) {
      issues.push({
        severity: "error",
        message: "Tab characters detected; FORMA uses spaces for indentation.",
        line: index + 1,
        suggestion: "Replace tab characters with spaces."
      });
    }

    if (line.trim() !== "") {
      const leadingSpaces = line.match(/^ */)[0].length;
      if (leadingSpaces % 4 !== 0) {
        issues.push({
          severity: "warn",
          message: "Indentation is not a multiple of 4 spaces.",
          line: index + 1,
          suggestion: "Normalize indentation to consistent 4-space levels."
        });
      }
    }

    if (line.length > 120) {
      issues.push({
        severity: "warn",
        message: "Very long line; readability and diff quality may degrade.",
        line: index + 1,
        suggestion: "Break expressions across multiple lines."
      });
    }
  });

  if (!/\bf\s+main\s*\(/.test(code)) {
    issues.push({
      severity: "warn",
      message: "No main entrypoint found.",
      suggestion: "Add `f main()` as the program entrypoint."
    });
  }

  if (longformHits > 0) {
    issues.push({
      severity: "info",
      message: "Detected long-form keywords. FORMA shorthand can reduce token usage.",
      suggestion: "Prefer `f`, `s`, `e`, `m`, `wh`, `ret`, `as`, `sp`, `aw` where appropriate."
    });
  }

  const balance = balancedDelimiters(code);
  if (!balance.ok && balance.issue) {
    issues.push(balance.issue);
  }

  return {
    nonEmptyLineCount,
    estimatedTokens,
    rustEquivalent,
    shorthandHits,
    issues
  };
}

function buildDiagnosticJson(analysis) {
  const firstError = analysis.issues.find((issue) => issue.severity === "error");
  const firstWarn = analysis.issues.find((issue) => issue.severity === "warn");
  const topIssue = firstError || firstWarn || null;

  if (!topIssue) {
    return {
      status: "ok",
      message: "No heuristic issues detected.",
      metrics: {
        estimated_tokens: analysis.estimatedTokens,
        rust_equivalent_tokens: analysis.rustEquivalent,
        shorthand_hits: analysis.shorthandHits,
        lines: analysis.nonEmptyLineCount
      },
      next_command: "forma check --partial playground.forma"
    };
  }

  return {
    status: "needs_attention",
    error: topIssue.severity === "error" ? "heuristic_parse_error" : "heuristic_warning",
    message: topIssue.message,
    location: {
      line: topIssue.line || 1,
      column: 1
    },
    suggestion: topIssue.suggestion || "Run `forma check --error-format json` for compiler-verified diagnostics."
  };
}

function setText(id, value) {
  const element = $(id);
  if (element) {
    element.textContent = value;
  }
}

function analyzeCurrentCode() {
  const editor = $("codeEditor");
  const list = $("diagnosticList");
  const jsonOutput = $("jsonDiagnostic");
  if (!editor || !list || !jsonOutput) {
    return;
  }

  const analysis = analyzeCode(editor.value);

  setText("metricTokens", String(analysis.estimatedTokens));
  setText("metricShorthand", String(analysis.shorthandHits));
  setText("metricWarnings", String(analysis.issues.length));
  setText("metricRust", String(analysis.rustEquivalent));

  if (analysis.issues.length === 0) {
    list.innerHTML = `<li class="diagnostic-item"><strong>PASS</strong>: No obvious issues detected by the browser heuristic checker.</li>`;
  } else {
    list.innerHTML = analysis.issues.map((issue) => makeDiagnosticItemHtml(issue)).join("");
  }

  const diagnosticJson = buildDiagnosticJson(analysis);
  jsonOutput.textContent = JSON.stringify(diagnosticJson, null, 2);
}

function guessOutputFromPrints(code) {
  const lines = [];
  const printStringRegex = /print\("([^"]*)"\)/g;
  let match = printStringRegex.exec(code);
  while (match) {
    lines.push(`"${match[1]}"`);
    match = printStringRegex.exec(code);
  }
  return lines;
}

function simulateOutput() {
  const editor = $("codeEditor");
  const output = $("simulatedOutput");
  const select = $("exampleSelect");
  if (!editor || !output || !select) {
    return;
  }

  const currentCode = editor.value.trim();
  const selectedExample = findExampleById(select.value);

  if (selectedExample && currentCode === selectedExample.code.trim()) {
    output.textContent = selectedExample.output;
    return;
  }

  const exactMatch = EXAMPLES.find((example) => currentCode === example.code.trim());
  if (exactMatch) {
    output.textContent = exactMatch.output;
    return;
  }

  const guessed = guessOutputFromPrints(currentCode);
  if (guessed.length > 0) {
    output.textContent = `${guessed.join("\n")}\n[simulated from print() calls]`;
    return;
  }

  output.textContent = "Simulation is unavailable for this snippet.\nRun locally:\nforma run playground.forma";
}

function renderExampleGrid(filterText = "") {
  const grid = $("exampleGrid");
  if (!grid) {
    return;
  }

  const query = filterText.trim().toLowerCase();
  const filtered = EXAMPLES.filter((example) => {
    if (!query) {
      return true;
    }
    const combined = `${example.name} ${example.category} ${example.description} ${example.tags.join(" ")}`.toLowerCase();
    return combined.includes(query);
  });

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No examples matched your search.</p>";
    return;
  }

  grid.innerHTML = filtered.map((example) => `
    <article class="example-card">
      <div class="example-head">
        <h3>${escapeHtml(example.name)}</h3>
        <p class="example-tag">${escapeHtml(example.category)}</p>
      </div>
      <p class="example-desc">${escapeHtml(example.description)}</p>
      <p class="example-meta"><strong>Command:</strong> <code>${escapeHtml(example.command)}</code></p>
      <button class="button tiny example-load-btn" data-example-id="${escapeHtml(example.id)}">Load in Playground</button>
    </article>
  `).join("");

  grid.querySelectorAll(".example-load-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const select = $("exampleSelect");
      if (!select) {
        return;
      }

      const exampleId = button.getAttribute("data-example-id");
      const target = findExampleById(exampleId);
      if (!target) {
        return;
      }

      select.value = target.id;
      loadSelectedExample();
      const playground = document.getElementById("playground");
      if (playground) {
        playground.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function renderRoadmap(filter = "all") {
  const list = $("roadmapList");
  if (!list) {
    return;
  }

  const visible = ROADMAP_ITEMS.filter((item) => filter === "all" || item.state === filter);
  list.innerHTML = visible.map((item) => `
    <article class="roadmap-item ${item.state}">
      <p>${escapeHtml(item.label)}</p>
      <p class="roadmap-state">${escapeHtml(item.state)}</p>
    </article>
  `).join("");
}

function populateGoals() {
  const goalSelect = $("goalSelect");
  if (!goalSelect) {
    return;
  }

  goalSelect.innerHTML = GOALS.map((goal) => `<option value="${goal.id}">${escapeHtml(goal.label)}</option>`).join("");
}

function buildCommand() {
  const goalSelect = $("goalSelect");
  const errorFormatSelect = $("errorFormatSelect");
  const fileInput = $("fileInput");
  const preview = $("commandPreview");
  if (!goalSelect || !errorFormatSelect || !fileInput || !preview) {
    return;
  }

  const goal = GOALS.find((item) => item.id === goalSelect.value);
  if (!goal) {
    preview.textContent = "";
    return;
  }

  const file = fileInput.value.trim() || "main.forma";
  const errorFormat = errorFormatSelect.value;
  const command = goal.build({ file, errorFormat });
  preview.textContent = command;
}

async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const temp = document.createElement("textarea");
  temp.value = text;
  document.body.appendChild(temp);
  temp.focus();
  temp.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(temp);
  return ok;
}

function flashButton(button, doneLabel = "Copied") {
  if (!button) {
    return;
  }
  const previous = button.textContent;
  button.textContent = doneLabel;
  window.setTimeout(() => {
    button.textContent = previous;
  }, 1100);
}

function initCopyButtons() {
  const copyCodeBtn = $("copyCodeBtn");
  const copyCommandBtn = $("copyCommandBtn");

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", async () => {
      const editor = $("codeEditor");
      if (!editor) {
        return;
      }
      await copyText(editor.value);
      flashButton(copyCodeBtn);
    });
  }

  if (copyCommandBtn) {
    copyCommandBtn.addEventListener("click", async () => {
      const preview = $("commandPreview");
      if (!preview) {
        return;
      }
      await copyText(preview.textContent || "");
      flashButton(copyCommandBtn);
    });
  }
}

function initRoadmapFilter() {
  const filterBar = $("roadmapFilter");
  if (!filterBar) {
    return;
  }

  filterBar.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      filterBar.querySelectorAll(".filter-btn").forEach((candidate) => candidate.classList.remove("active"));
      button.classList.add("active");
      const filter = button.getAttribute("data-filter") || "all";
      renderRoadmap(filter);
    });
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (items.length === 0) {
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 80, 340)}ms`;
    observer.observe(item);
  });
}

function bindEvents() {
  const loadExampleBtn = $("loadExampleBtn");
  const analyzeBtn = $("analyzeBtn");
  const simulateBtn = $("simulateBtn");
  const exampleSearch = $("exampleSearch");
  const goalSelect = $("goalSelect");
  const errorFormatSelect = $("errorFormatSelect");
  const fileInput = $("fileInput");

  if (loadExampleBtn) {
    loadExampleBtn.addEventListener("click", loadSelectedExample);
  }
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", analyzeCurrentCode);
  }
  if (simulateBtn) {
    simulateBtn.addEventListener("click", simulateOutput);
  }
  if (exampleSearch) {
    exampleSearch.addEventListener("input", (event) => renderExampleGrid(event.target.value));
  }
  if (goalSelect) {
    goalSelect.addEventListener("change", buildCommand);
  }
  if (errorFormatSelect) {
    errorFormatSelect.addEventListener("change", buildCommand);
  }
  if (fileInput) {
    fileInput.addEventListener("input", buildCommand);
  }
}

function init() {
  initMenu();
  initHeroCommands();
  populateExamples();
  populateGoals();
  renderExampleGrid("");
  renderRoadmap("all");
  initRoadmapFilter();
  bindEvents();
  initCopyButtons();
  loadSelectedExample();
  buildCommand();
  initRevealAnimations();
}

document.addEventListener("DOMContentLoaded", init);
