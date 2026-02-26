var queryString = new URLSearchParams(window.location.search);
let tei_xml = queryString.get('process');
let author_arr = tei_xml.split("_", 1);
let author = author_arr.join("")
let writer = author.concat("/");
let extension = ".xml";
let folder_xml = "../xml/";
let process_xml = folder_xml.concat(writer, tei_xml, extension);

var a = 0;
var count = 0;

function documentLoader() {
  const container = document.getElementById("text");
  Promise.all([
    fetch(process_xml).then(response => response.text()),
    fetch("../xsl/1_make-changelist.xsl").then(response => response.text()),
    fetch("../xsl/2_add-n-attribute.xsl").then(response => response.text()),
    fetch("../xsl/to_html_english.xsl").then(response => response.text())
  ])
  .then(function ([xmlString, xslString1, xslString2, xslString3]) {
    var parser = new DOMParser();
    var xml_doc = parser.parseFromString(xmlString, "text/xml");
    var xsl1_doc = parser.parseFromString(xslString1, "text/xml");
    var xsl2_doc = parser.parseFromString(xslString2, "text/xml");
    var xsl3_doc = parser.parseFromString(xslString3, "text/xml");

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl1_doc);
    var resultDocument1 = xsltProcessor.transformToFragment(xml_doc, document);
    xsltProcessor.importStylesheet(xsl2_doc);
    var resultDocument2 = xsltProcessor.transformToFragment(resultDocument1, document);
    xsltProcessor.importStylesheet(xsl3_doc);
    var resultDocument3 = xsltProcessor.transformToFragment(resultDocument2, document);

    var criticalElement = document.getElementById("text");
    criticalElement.innerHTML = '';
    criticalElement.appendChild(resultDocument3);

    // Now that XSLT is done and buttons are in the DOM, run navigation
    if (typeof authorsData !== 'undefined' && authorsData) {
      createProcessNavigation(authorsData);
    } else {
      const interval = setInterval(() => {
        if (typeof authorsData !== 'undefined' && authorsData) {
          clearInterval(interval);
          createProcessNavigation(authorsData);
        }
      }, 50);
    }
  })
  .catch(function (error) {
    console.error("Error loading documents:", error);
    container.innerHTML = "<p>Error while loading page: session/author not found.</p>";
  });
}

documentLoader();

$(document).ready(function () {
  $('body')
    .on("click", ".start_btn", start)
    .on("click", ".refresh_btn", refresh)
    .on("click", "#countButton", function (e) {
      e.preventDefault();
      count++;
      count === 1 ? previous() : decrease();
    })
    .on("click", ".increase_btn", function () {
      increase();
    })
    .on("click", "#jumpButton", function () {
      jumpToStep($("#jumpInput").val());
    })
    .on("keydown", "#jumpInput", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        jumpToStep(this.value);
      }
    });
});

function increase() {
  a += 1;
  console.log(a);

  const elmnt = document.getElementById(a);
  elmnt.scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("counter").innerHTML = `Step: ${a}/${rev}`;

  if (elmnt.classList.contains('del')) {
    handleDeletedElement(elmnt);
  } else if (elmnt.classList.contains('mod')) {
    handleModifiedElement(elmnt);
  } else {
    handleDefaultElement(elmnt);
  }
}

function handleDeletedElement(elmnt) {
  elmnt.classList.add('thick-del');
  elmnt.style.textDecoration = "line-through";
  setTimeout(() => {
    elmnt.style.display = "none";
  }, 950);
}

function handleModifiedElement(elmnt) {
  elmnt.style.color = "#ff9900";
  elmnt.classList.add('thick');
  setTimeout(() => {
    elmnt.classList.remove('thick');
  }, 950);
}

function handleDefaultElement(elmnt) {
  elmnt.style.display = "inline";
  elmnt.classList.add('thick');
  setTimeout(() => {
    elmnt.classList.remove('thick');
  }, 950);
}

function previous() {
  const elmnt = document.getElementById(a);
  scrollToElement(elmnt);

  if (elmnt.classList.contains('del')) {
    elmnt.style.display = "inline";
    elmnt.classList.remove('thick-del');
    elmnt.style.textDecoration = "none";
  } else if (elmnt.classList.contains('mod')) {
    elmnt.style.color = "white";
  } else {
    elmnt.style.display = "none";
  }

  a--;
  updateCounter(a, revs);
}

function decrease() {
  const elmnt = document.getElementById(a);
  scrollToElement(elmnt);

  if (elmnt.classList.contains('del')) {
    elmnt.style.display = "inline";
    elmnt.classList.remove('thick-del');
    elmnt.style.textDecoration = "none";
  } else if (elmnt.classList.contains('mod')) {
    elmnt.style.color = "";
  } else {
    elmnt.style.display = "none";
  }

  a--;
  updateCounter(a, rev);
}

function scrollToElement(elmnt) {
  elmnt.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center"
  });
}

function updateCounter(a, rev) {
  document.getElementById("counter").innerHTML = `Step: ${a}/${rev}`;
}

function loop() {
  if (a < rev) {
    if (!flag) return;
    increase();
    setTimeout(loop, 950);
  } else {
    stop();
  }
}

function stop() {
  flag = false;
}

function start() {
  flag = true;
  loop();
}

function refresh() {
  a = 0;
  $(".del").removeClass("thick-del").css({ "text-decoration": "none" }).show();
  $(".add, .mod, .cont").hide();
  updateCounter(0, rev);
  const firstWord = document.querySelector("div.word");
  if (firstWord) {
    firstWord.scrollIntoView({ behavior: "smooth" });
  }
}

function InfoFunction() {
  var popup = document.getElementById("Info");
  popup.classList.toggle("show");
}

function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  element.style.visibility = element.style.visibility === 'visible' ? 'hidden' : 'visible';
}

function toggleClassVisibility(className, displayType = "inline") {
  const elements = document.getElementsByClassName(className);
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = elements[i].style.display === displayType ? "none" : displayType;
  }
}

function hexToRgb(hex) {
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
}

function toggleColorAndDecoration(elements, color, textDecoration = "line-through") {
  let rgbColor = hexToRgb(color);
  for (let i = 0; i < elements.length; i++) {
    let originalColor = elements[i].getAttribute("data-original-color") || elements[i].style.color || window.getComputedStyle(elements[i]).color;
    if (!elements[i].getAttribute("data-original-color")) {
      elements[i].setAttribute("data-original-color", originalColor);
    }
    if (window.getComputedStyle(elements[i]).color === rgbColor) {
      elements[i].style.color = originalColor;
      elements[i].style.textDecoration = "";
    } else {
      elements[i].style.color = color;
      elements[i].style.textDecoration = textDecoration;
    }
  }
}

function showhidedeletions() {
  $(".del").toggleClass('temporaryhide');
  checkDel();
  checktypo();
}

function colordeletions() {
  toggleColorAndDecoration(document.getElementsByClassName("del context"), "#B20D30");
  toggleColorAndDecoration(document.getElementsByClassName("del pre-context"), "#F35376");
  toggleColorAndDecoration(document.getElementsByClassName("del typo"), "#875531");
  toggleColorAndDecoration(document.getElementsByClassName("del trans"), "#377495");
  checkDel();
  checktypo();
}

function checkDel() {
  toggleVisibility("checkdel");
}

function showhideadditions() {
  toggleClassVisibility("add");
  toggleClassVisibility("cont");
  toggleColorAndDecoration(document.getElementsByClassName("mod"), "#F7B801", "");
  checkAdd();
}

function checkAdd() {
  toggleVisibility("checkadd");
}

function showhiderevisions() {
  toggleVisibility("checkrevisions");
  showhideadditions();
  colordeletions();
}

function showhidetypo() {
  toggleClassVisibility("del typo");
  checktypo();
}

function checktypo() {
  toggleVisibility("checktypo");
}

function numbers() {
  toggleClassVisibility("n");
  toggleVisibility("checknumbers");
}

function BIGnumbers() {
  const elements = document.getElementsByClassName("n");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.fontSize = elements[i].style.fontSize === "100%" ? "60%" : "100%";
  }
  toggleVisibility("checkmark");
}

function symbols() {
  toggleClassVisibility("symbol");
  toggleVisibility("checksymbol");
}

function createLine() {
  toggleElementColor('transcription');
  toggleElementColor('del');
  toggleElementColor('add');
  toggleElementColor('cont');
  toggleElementColor('chap');
  toggleVisibility("checkpath");

  for (let a = 1; a <= rev; a++) {
    const first = document.getElementById(a);
    const second = document.getElementById(a + 1);
    if (!first || !second) continue;

    const [x1, y1] = [first.offsetLeft, first.offsetTop];
    const [x2, y2] = [second.offsetLeft, second.offsetTop];

    const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    const xMid = (x1 + x2) / 2;
    const yMid = (y1 + y2) / 2;
    const slopeInDegrees = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

    const line = document.getElementById("line" + a);
    line.style.top = `${yMid}px`;
    line.style.left = `${xMid - distance / 2}px`;
    line.style.transform = `rotate(${slopeInDegrees}deg)`;
    line.style.width = `${distance}px`;
    line.style.display = line.style.display === "block" ? "none" : "block";

    setLineColor(a, y2 < y1);
    document.getElementById("line1").style.backgroundColor = "green";
  }
}

function toggleElementColor(className) {
  const elements = document.getElementsByClassName(className);
  for (let element of elements) {
    element.style.color = element.style.color === 'rgba(0, 0, 0, 0.5)' ? '' : 'rgba(0, 0, 0, 0.5)';
  }
}

function setLineColor(index, isReversed) {
  const line = document.getElementById("line" + index);
  const revThreshold = rev / 10;
  const colors = isReversed
    ? ["#4E9BF9", "#2684F7", "#096FEC", "#075DC5", "#064A9D", "#043876"]
    : ["#FEB685", "#FE9D5D", "#FE8534", "#FE6C0B", "#DF5A01", "#B74A01"];

  for (let i = 0; i < colors.length; i++) {
    if (index < revThreshold * (i + 1)) {
      line.style.backgroundColor = colors[i];
      break;
    }
  }
}

function hoverByClass(className, colorOver, colorOut = "transparent") {
  const elements = document.getElementsByClassName(className);
  for (let element of elements) {
    element.onmouseover = function () {
      for (let el of elements) {
        el.style.backgroundColor = colorOver;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    element.onmouseout = function () {
      for (let el of elements) {
        el.style.backgroundColor = colorOut;
      }
    };
  }
}

for (let i = 1; i <= 20; i++) {
  hoverByClass(`note${i}`, "#C4F1BE");
}

function jumpToStep(target) {
  target = parseInt(target, 10);
  if (isNaN(target) || target < 0 || target > rev) return;
  flag = false;
  refresh();
  for (let i = 1; i <= target; i++) {
    increase();
  }
}

const observer = new MutationObserver(function(mutations, obs) {
    const notesButton = document.getElementById("notesButton");
    if (!notesButton) return; 

    const hasNotes = Array.from(document.querySelectorAll("b.notes"))
        .some(el =>
            Array.from(el.classList)
                .some(c => c.startsWith("note") && c !== "notes")
        );

    if (!hasNotes) {
        notesButton.classList.add("hidden");
    }

    obs.disconnect();
});

observer.observe(document.body, {
    childList: true, 
    subtree: true     
});

const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.background = "#fff";
tooltip.style.border = "1px solid #999";
tooltip.style.padding = "8px";
tooltip.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
tooltip.style.display = "none";
tooltip.style.maxWidth = "300px";
tooltip.style.zIndex = "9999";
document.body.appendChild(tooltip);

function moveTooltip(e) {
  tooltip.style.left = (e.pageX + 15) + "px";
  tooltip.style.top = (e.pageY + 15) + "px";
}

document.addEventListener("mouseover", function (e) {
  const noteNumber = e.target.closest("b.notes");
  if (!noteNumber) return;
  const noteClass = Array.from(noteNumber.classList)
    .find(c => c.startsWith("note") && c !== "notes");
  if (!noteClass) return;
  const noteContent = document.querySelector(`div.${noteClass}`);
  if (!noteContent) return;
  tooltip.innerHTML = noteContent.innerHTML;
  tooltip.style.display = "block";
  document.addEventListener("mousemove", moveTooltip);
  noteNumber.addEventListener("mouseleave", function () {
    tooltip.style.display = "none";
    document.removeEventListener("mousemove", moveTooltip);
  }, { once: true });
});

function showhidenotes() {
  const notes = document.getElementsByClassName("notes");
  for (let i = 0; i < notes.length; i++) {
    notes[i].style.display =
      notes[i].style.display === "inline" ? "none" : "inline";
  }
  toggleVisibility("checknotes");
}