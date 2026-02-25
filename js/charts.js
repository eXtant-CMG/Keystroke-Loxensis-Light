document.addEventListener("DOMContentLoaded", loadAuthorPage);

async function loadAuthorPage() {

  const params = new URLSearchParams(window.location.search);
  const authorName = params.get("author");

  const container = document.getElementById("charts");

  if (!authorName) {
    container.innerHTML = "<p>No author specified.</p>";
    return;
  }

  const [authors, xslString] = await Promise.all([
    fetch("../authors.json").then(r => r.json()),
    fetch("../xsl/charts.xsl").then(r => r.text())
  ]);

  const author = authors.find(a => a.path === authorName);

  if (!author) {
    container.innerHTML = "<p>Author not found.</p>";
    return;
  }

  document.getElementById("author-name").textContent = author.name;
  document.getElementById("author-title").textContent = author.title;
  document.getElementById("author-description").textContent = author.description;

  const parser = new DOMParser();
  const xslDoc = parser.parseFromString(xslString, "text/xml");

  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xslDoc);

  container.innerHTML = "";

  for (const session of author.sessions) {

const filePath = `../xml/${author.path}/${session.link}.xml`;


  console.log("Loading:", filePath);

  try {
    const xmlString = await fetch(filePath).then(r => r.text());
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const fragment =
      xsltProcessor.transformToFragment(xmlDoc, document);

    const wrapper = document.createElement("div");
    wrapper.className = "chart-wrapper";

    const sessionTitle = document.createElement("h3");
    sessionTitle.textContent = session.name;

    wrapper.appendChild(sessionTitle);
    wrapper.appendChild(fragment);

    container.appendChild(wrapper);

  } catch (err) {
    console.error("Failed to load:", filePath, err);
  }
}

  initCharts();
}


function initCharts() {

  document.querySelectorAll(".session-chart").forEach(section => {

    const labels = [];
    const values = [];
    const colors = [];

    const categories = [
      { label: "new text", key: "addNt", color: "#843371" },
      { label: "continuations", key: "modContinue", color: "#ff9900" },
      { label: "typos (deletions)", key: "delTypo", color: "#875531" },
      { label: "typos (additions)", key: "addTypo", color: "#BE7C4D" },
      { label: "contextual deletions", key: "delContext", color: "#B20D30" },
      { label: "contextual additions", key: "addContext", color: "#04724D" },
      { label: "pre-contextual deletions", key: "delPrecontext", color: "#F35376" },
      { label: "pre-contextual additions", key: "addPrecontext", color: "#7FB069" },
      { label: "translocations", key: "addTranslocation", color: "#377495" }
    ];

    categories.forEach(cat => {
      const value = Number(section.dataset[cat.key] || 0);
      if (value > 0) {
        labels.push(cat.label);
        values.push(value);
        colors.push(cat.color);
      }
    });

    const canvas = section.querySelector("canvas");

    new Chart(canvas.getContext("2d"), {
      type: "bar",
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0 }
          },
          y: {
            ticks: { autoSkip: false }
          }
        }
      },
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors
        }]
      }
    });

  });
}
