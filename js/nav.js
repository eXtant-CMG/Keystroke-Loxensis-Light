// Detect project root automatically
function getSiteRoot() {
  const { origin, pathname } = window.location;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return origin + '/';
  }
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && !parts[0].includes('.')) {
    return `${origin}/${parts[0]}/`;
  }
  return origin + '/';
}

const SITE_ROOT = getSiteRoot();

function root(path) {
  return new URL(path, SITE_ROOT).href;
}

let authorsData = null;

document.addEventListener("DOMContentLoaded", function () {
  fetch(root("authors.json"))
    .then(response => response.json())
    .then(data => {
      authorsData = data;
      buildNav(data);
      buildProcessContainer(data);
    })
    .catch(error => console.error("Error loading authors.json:", error));
});

function buildNav(data) {
  const nav = document.getElementById("navList");
  if (!nav) return;

  const currentPath = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  const isIndexPage = currentPath.includes("index.html") || currentPath.endsWith("/");
  const isAboutAuthorPage = currentPath.includes("about.html");
  const isAboutProjectPage = currentPath.includes("about-main.html");
  const isProcessPage = currentPath.includes("processviewer.html");

  if (isIndexPage || isAboutAuthorPage || isAboutProjectPage) {
    data.forEach(author => {
      const li = document.createElement("li");
      li.className = "nav-item";

      const a = document.createElement("a");
      a.className = "nav-link";
      a.textContent = author.name;

      if (author.sessions && author.sessions.length > 0) {
        a.href = root(`html/processviewer.html?process=${author.sessions[0].link}`);
      }

      li.appendChild(a);
      nav.appendChild(li);
    });
  }

  if (isProcessPage) {
    const processId = params.get("process");
    if (!processId) return;

    const author = data.find(a => a.sessions.some(s => s.link === processId));
    if (!author) return;

    const li = document.createElement("li");
    li.className = "nav-item dropdown";

    const toggle = document.createElement("a");
    toggle.className = "nav-link dropdown-toggle";
    toggle.href = "#";
    toggle.role = "button";
    toggle.setAttribute("data-bs-toggle", "dropdown");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = author.name;

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.className = "dropdown-menu";

    const aboutLi = document.createElement("li");
    const aboutLink = document.createElement("a");
    aboutLink.className = "dropdown-item";
    aboutLink.textContent = `About ${author.name}`;
    aboutLink.href = root(`html/about.html?author=${encodeURIComponent(author.path)}`);
    aboutLi.appendChild(aboutLink);
    dropdownMenu.appendChild(aboutLi);

    const divider = document.createElement("li");
    divider.innerHTML = '<hr class="dropdown-divider">';
    dropdownMenu.appendChild(divider);

    author.sessions.forEach(session => {
      const sessionLi = document.createElement("li");
      const sessionLink = document.createElement("a");
      sessionLink.className = "dropdown-item";
      sessionLink.textContent = session.name;
      sessionLink.href = root(`html/processviewer.html?process=${session.link}`);

      if (session.link === processId) {
        sessionLink.classList.add("active");
      }

      sessionLi.appendChild(sessionLink);
      dropdownMenu.appendChild(sessionLi);
    });

    li.appendChild(toggle);
    li.appendChild(dropdownMenu);
    nav.appendChild(li);
  }
}

function buildProcessContainer(data) {
  const container = document.getElementById("processContainer");
  if (!container) return;

  for (let i = 0; i < data.length; i += 2) {
    const row = document.createElement("div");
    row.className = "row justify-content-center mb-4";

    const pair = data.slice(i, i + 2);

    pair.forEach(item => {
      if (!item.sessions || item.sessions.length === 0) return;

      const col = document.createElement("div");
      col.className = "col-12 col-md-5 writing_process mb-3";

      const link = document.createElement("a");
      link.className = "process_link text-decoration-none";
      link.href = root(`html/processviewer.html?process=${item.sessions[0].link}`);

      const h1 = document.createElement("h1");
      h1.textContent = item.name;

      const p = document.createElement("p");
      p.textContent = item.title || "";

      const arrow = document.createElement("span");
      arrow.textContent = " →";

      link.appendChild(h1);
      link.appendChild(p);
      link.appendChild(arrow);

      col.appendChild(link);
      row.appendChild(col);
    });

    container.appendChild(row);
  }
}

function createProcessNavigation(data) {
  const prevBtn = document.querySelector(".prev-session");
  const nextBtn = document.querySelector(".next-session");
  if (!prevBtn || !nextBtn) return;

  const params = new URLSearchParams(window.location.search);
  const currentProcess = params.get("process");
  if (!currentProcess) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  const authorKey = currentProcess.split("_")[0];
  const author = data.find(a => a.path === authorKey);
  if (!author) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  const currentIndex = author.sessions.findIndex(s => s.link === currentProcess);
  if (currentIndex === -1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  prevBtn.style.display = "none";
  nextBtn.style.display = "none";

  if (currentIndex > 0) {
    const prevSession = author.sessions[currentIndex - 1];
    prevBtn.href = root(`html/processviewer.html?process=${prevSession.link}`);
    prevBtn.style.display = "block";
  }

  if (currentIndex < author.sessions.length - 1) {
    const nextSession = author.sessions[currentIndex + 1];
    nextBtn.href = root(`html/processviewer.html?process=${nextSession.link}`);
    nextBtn.style.display = "block";
  }
}