document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("navList");

  fetch("/authors.json")
    .then(response => response.json())
    .then(data => {

      const currentPath = window.location.pathname;
      const params = new URLSearchParams(window.location.search);

      const isIndexPage =
        currentPath.includes("index.html") ||
        currentPath.endsWith("/");

      const isAboutAuthorPage =
        currentPath.includes("about.html");

      const isAboutProjectPage =
        currentPath.includes("about-main.html");

      const isProcessPage =
        currentPath.includes("processviewer.html");

      // =====================================
      // INDEX + ABOUT PAGES → SHOW AUTHORS
      // =====================================
      if (isIndexPage || isAboutAuthorPage || isAboutProjectPage) {

        data.forEach(author => {
          const li = document.createElement("li");
          li.className = "nav-item";

          const a = document.createElement("a");
          a.className = "nav-link";
          a.textContent = author.name;

          if (author.sessions && author.sessions.length > 0) {
            a.href = `/html/processviewer.html?process=${author.sessions[0].link}`;
          }

          li.appendChild(a);
          nav.appendChild(li);
        });
      }

      // =====================================
      // PROCESS VIEWER → AUTHOR DROPDOWN
      // =====================================
      if (isProcessPage) {

        const processId = params.get("process");
        if (!processId) return;

        const author = data.find(a =>
          a.sessions.some(s => s.link === processId)
        );
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

        // About Author link
        const aboutLi = document.createElement("li");
        const aboutLink = document.createElement("a");
        aboutLink.className = "dropdown-item";
        aboutLink.textContent = `About ${author.name}`;
        aboutLink.href = `/html/about.html?author=${encodeURIComponent(author.path)}`;

        aboutLi.appendChild(aboutLink);
        dropdownMenu.appendChild(aboutLi);

        // Divider
        const divider = document.createElement("li");
        divider.innerHTML = '<hr class="dropdown-divider">';
        dropdownMenu.appendChild(divider);

        // Sessions
        author.sessions.forEach(session => {

          const sessionLi = document.createElement("li");

          const sessionLink = document.createElement("a");
          sessionLink.className = "dropdown-item";
          sessionLink.textContent = session.name;
          sessionLink.href = `/html/processviewer.html?process=${session.link}`;

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

    })
    .catch(error => {
      console.error("Navigation error:", error);
    });
});


document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("processContainer");

  // Stop script if container does not exist on this page
  if (!container) return;

  fetch("/authors.json")
    .then(response => response.json())
    .then(items => {

      for (let i = 0; i < items.length; i += 2) {

        const row = document.createElement("div");
        row.className = "row justify-content-center mb-4";

        const pair = items.slice(i, i + 2);

        pair.forEach(item => {

          if (!item.sessions || item.sessions.length === 0) return;

          const col = document.createElement("div");
          col.className = "col-12 col-md-5 writing_process mb-3";

          const link = document.createElement("a");
          link.className = "process_link text-decoration-none";
          link.href = `/html/processviewer.html?process=${item.sessions[0].link}`;

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
    })
    .catch(error => {
      console.error("Error loading content:", error);
    });
});

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

  const currentIndex = author.sessions.findIndex(
    session => session.link === currentProcess
  );

  if (currentIndex === -1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  // Hide both by default
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";

  // PREVIOUS
  if (currentIndex > 0) {
    const prevSession = author.sessions[currentIndex - 1];
    prevBtn.href = `../html/processviewer.html?process=${prevSession.link}`;
    prevBtn.style.display = "block";
  }

  // NEXT
  if (currentIndex < author.sessions.length - 1) {
    const nextSession = author.sessions[currentIndex + 1];
    nextBtn.href = `../html/processviewer.html?process=${nextSession.link}`;
    nextBtn.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/authors.json")
    .then(res => res.json())
    .then(data => {
      createProcessNavigation(data);
    })
    .catch(err => console.error("JSON load error:", err));
});

