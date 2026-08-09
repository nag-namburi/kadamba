/* Kadamba — app logic (vanilla JS, hash routing) */
(function () {
  "use strict";

  var DATA = window.APP_DATA;
  var planets = DATA.planets;
  var signs = DATA.signs;
  var houses = DATA.houses;
  var concepts = DATA.concepts;

  var app = document.getElementById("app");
  var searchInput = document.getElementById("search");

  /* ---------- constants & lookups ---------- */

  var PLANET_GLYPHS = {
    sun: "☉", moon: "☽", mars: "♂", mercury: "☿", jupiter: "♃",
    venus: "♀", saturn: "♄", rahu: "☊", ketu: "☋"
  };

  var SIGN_GLYPHS = {
    aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌",
    virgo: "♍", libra: "♎", scorpio: "♏", sagittarius: "♐",
    capricorn: "♑", aquarius: "♒", pisces: "♓"
  };

  var CATEGORY_LABELS = {
    planets: "Planets", signs: "Signs", houses: "Houses", general: "General"
  };

  var planetByName = {};
  planets.forEach(function (p) { planetByName[p.name.toLowerCase()] = p; });

  var signById = {};
  signs.forEach(function (s) { signById[s.id] = s; });

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function chip(text) {
    return '<li>' + esc(text) + "</li>";
  }

  function chipList(items) {
    return '<ul class="chip-list">' + items.map(chip).join("") + "</ul>";
  }

  function badge(text) {
    return '<span class="badge">' + esc(text) + "</span>";
  }

  /* Link a planet name to its detail page, if it is a known planet. */
  function planetLink(name) {
    var p = planetByName[name.toLowerCase()];
    if (!p) return esc(name);
    return '<a href="#/planets/' + p.id + '">' + esc(name) + "</a>";
  }

  /* House karakas look like "Jupiter (wealth)" — link the planet, keep the qualifier. */
  function karakaChip(text) {
    var m = String(text).match(/^([A-Za-z]+)(.*)$/);
    if (m && planetByName[m[1].toLowerCase()]) {
      return "<li>" + planetLink(m[1]) + esc(m[2]) + "</li>";
    }
    return chip(text);
  }

  function snippet(text, n) {
    text = String(text || "");
    return text.length > n ? text.slice(0, n).trimEnd() + "…" : text;
  }

  /* ---------- cards ---------- */

  function planetCard(p) {
    return (
      '<a class="card" href="#/planets/' + p.id + '">' +
        '<div class="card-top">' +
          '<span class="card-glyph">' + (PLANET_GLYPHS[p.id] || "•") + "</span>" +
          '<span class="card-name">' + esc(p.name) + "</span>" +
          '<span class="card-sanskrit">' + esc(p.sanskritName) + "</span>" +
        "</div>" +
        '<p class="card-tagline"><em>' + esc(p.essence) + "</em> — " +
          esc(p.primarySignifications.join(", ").toLowerCase()) + "</p>" +
      "</a>"
    );
  }

  function signCard(s) {
    return (
      '<a class="card" href="#/signs/' + s.id + '">' +
        '<div class="card-top">' +
          '<span class="card-glyph">' + (SIGN_GLYPHS[s.id] || "•") + "</span>" +
          '<span class="card-name">' + esc(s.name) + "</span>" +
          '<span class="card-sanskrit">' + esc(s.sanskritName) + "</span>" +
        "</div>" +
        '<p class="card-tagline">' + esc(s.characteristics.slice(0, 3).join(" · ")) + "</p>" +
        '<div class="badges">' + badge(s.element) + badge(s.modality) + badge("☉ " + s.ruler) + "</div>" +
      "</a>"
    );
  }

  function houseCard(h) {
    return (
      '<a class="card" href="#/houses/' + h.id + '">' +
        '<div class="card-top">' +
          '<span class="house-number">' + h.number + "</span>" +
          '<span class="card-name">' + esc(h.sanskritName) + "</span>" +
        "</div>" +
        '<p class="card-tagline">' + esc(h.primarySignifications.join(" · ")) + "</p>" +
      "</a>"
    );
  }

  function conceptCard(c) {
    return (
      '<a class="card" href="#/concepts/' + c.id + '">' +
        '<div class="card-top"><span class="card-name">' + esc(c.title) + "</span></div>" +
        (c.intro ? '<p class="card-tagline">' + esc(snippet(c.intro, 130)) + "</p>" : "") +
        '<div class="badges">' + badge(CATEGORY_LABELS[c.category] || c.category) + "</div>" +
      "</a>"
    );
  }

  /* ---------- list views ---------- */

  function renderHome() {
    var analogy = concepts.find(function (c) { return c.id === "who-how-where"; });
    return (
      '<section class="hero">' +
        "<h1>Kadamba</h1>" +
        "<p>The building blocks of Vedic astrology — <strong>9 planets</strong> (grahas, the <em>who</em>), " +
        "<strong>12 signs</strong> (rāśis, the <em>how</em>) and <strong>12 houses</strong> " +
        "(bhāvas, the <em>where</em>) — with their characteristics and significations.</p>" +
      "</section>" +
      '<div class="grid">' +
        '<a class="card" href="#/planets">' +
          '<div class="card-top"><span class="card-glyph">♃</span><span class="card-name">Planets</span></div>' +
          '<p class="card-tagline">The 9 grahas and their natural significations (naisargika kārakatvas).</p>' +
        "</a>" +
        '<a class="card" href="#/signs">' +
          '<div class="card-top"><span class="card-glyph">♈</span><span class="card-name">Signs</span></div>' +
          '<p class="card-tagline">The 12 rāśis — elements, modalities, rulers, strengths and weaknesses.</p>' +
        "</a>" +
        '<a class="card" href="#/houses">' +
          '<div class="card-top"><span class="house-number">1</span><span class="card-name">Houses</span></div>' +
          '<p class="card-tagline">The 12 bhāvas — the fields of life, their karakas and classifications.</p>' +
        "</a>" +
        '<a class="card" href="#/concepts">' +
          '<div class="card-top"><span class="card-glyph">✦</span><span class="card-name">Concepts</span></div>' +
          '<p class="card-tagline">Classifications, Chara Kārakas, purusharthas and how to read it all together.</p>' +
        "</a>" +
      "</div>" +
      (analogy
        ? '<div class="section"><h2>Start here</h2><p>' + esc(analogy.intro) + "</p>" +
          '<p><a href="#/concepts/' + analogy.id + '">Read the big picture: who, how, where →</a></p></div>'
        : "")
    );
  }

  function renderList(title, sub, cards) {
    return (
      '<h1 class="page-title">' + esc(title) + "</h1>" +
      '<p class="page-sub">' + esc(sub) + "</p>" +
      '<div class="grid">' + cards.join("") + "</div>"
    );
  }

  /* ---------- detail views ---------- */

  function backLink(hash, label) {
    return '<a class="back-link" href="' + hash + '">← ' + esc(label) + "</a>";
  }

  /* Naisargika Maitri section on planet pages (7 classical grahas only). */
  function renderRelationships(p) {
    var r = p.naturalRelationships;
    var conceptLink = '<a href="#/concepts/naisargika-maitri">Naisargika Maitri</a>';
    if (!r) {
      return '<p class="note">' + esc(p.name) + " is not part of the classical Naisargika Maitri " +
        "(natural friendship) table — see " + conceptLink + ".</p>";
    }
    function rel(names) {
      return names.length ? names.map(planetLink).join(", ") : "None";
    }
    return (
      '<div class="section"><h2>Natural relationships (Naisargika Maitri)</h2>' +
      '<dl class="fact-grid">' +
        '<div class="fact"><dt>Friends</dt><dd>' + rel(r.friends) + "</dd></div>" +
        '<div class="fact"><dt>Enemies</dt><dd>' + rel(r.enemies) + "</dd></div>" +
        '<div class="fact"><dt>Neutral</dt><dd>' + rel(r.neutrals) + "</dd></div>" +
      "</dl>" +
      '<p class="note">Permanent relationships, independent of chart placement — see ' + conceptLink +
      " for how they combine with temporary (Tatkālika) friendships.</p></div>"
    );
  }

  function renderPlanet(id) {
    var p = planets.find(function (x) { return x.id === id; });
    if (!p) return renderNotFound();

    var ruledSigns = signs.filter(function (s) { return s.ruler === p.name; });
    var karakaOfHouses = houses.filter(function (h) {
      return h.naturalKarakas.some(function (k) {
        return k.toLowerCase().indexOf(p.name.toLowerCase()) === 0;
      });
    });

    return (
      backLink("#/planets", "All planets") +
      '<div class="detail-head">' +
        '<span class="detail-glyph">' + (PLANET_GLYPHS[p.id] || "") + "</span>" +
        '<div class="detail-title"><h1>' + esc(p.name) + "</h1>" +
        '<span class="sanskrit">' + esc(p.sanskritName) + "</span></div>" +
      "</div>" +
      '<p class="detail-essence">Essence: ' + esc(p.essence) + "</p>" +

      '<dl class="fact-grid">' +
        '<div class="fact"><dt>Primary significations</dt><dd>' + esc(p.primarySignifications.join(", ")) + "</dd></div>" +
        (ruledSigns.length
          ? '<div class="fact"><dt>Rules</dt><dd>' +
            ruledSigns.map(function (s) {
              return '<a href="#/signs/' + s.id + '">' + (SIGN_GLYPHS[s.id] || "") + " " + esc(s.name) + "</a>";
            }).join(", ") + "</dd>"
          : "") +
        (karakaOfHouses.length
          ? '<div class="fact"><dt>Natural karaka of</dt><dd>' +
            karakaOfHouses.map(function (h) {
              return '<a href="#/houses/' + h.id + '">' + esc(h.sanskritName) + " (" + h.number + ")</a>";
            }).join(", ") + "</dd>"
          : "") +
      "</dl>" +

      renderRelationships(p) +

      '<div class="section"><h2>Represents</h2>' + chipList(p.represents) + "</div>" +
      '<div class="section"><h2>Psychological qualities</h2>' + chipList(p.psychologicalQualities) + "</div>" +
      '<div class="section"><h2>Professions</h2>' + chipList(p.professions) + "</div>"
    );
  }

  function renderSign(id) {
    var s = signs.find(function (x) { return x.id === id; });
    if (!s) return renderNotFound();

    return (
      backLink("#/signs", "All signs") +
      '<div class="detail-head">' +
        '<span class="detail-glyph">' + (SIGN_GLYPHS[s.id] || "") + "</span>" +
        '<div class="detail-title"><h1>' + esc(s.name) + "</h1>" +
        '<span class="sanskrit">' + esc(s.sanskritName) + " · Sign " + s.number + " of 12</span></div>" +
      "</div>" +

      '<dl class="fact-grid">' +
        '<div class="fact"><dt>Ruling planet</dt><dd>' + planetLink(s.ruler) + "</dd></div>" +
        '<div class="fact"><dt>Element</dt><dd><a href="#/concepts/sign-classifications">' + esc(s.element) + "</a></dd></div>" +
        '<div class="fact"><dt>Modality</dt><dd><a href="#/concepts/sign-classifications">' + esc(s.modality) + "</a></dd></div>" +
        '<div class="fact"><dt>Purushartha</dt><dd><a href="#/concepts/sign-classifications">' + esc(s.purushartha) + "</a></dd></div>" +
        '<div class="fact"><dt>Gender</dt><dd>' + esc(s.gender) + "</dd></div>" +
        '<div class="fact"><dt>Nature</dt><dd>' + esc(s.nature) + "</dd></div>" +
      "</dl>" +

      '<div class="section"><h2>Characteristics</h2>' + chipList(s.characteristics) + "</div>" +
      '<div class="section"><h2>Strengths</h2>' + chipList(s.strengths) + "</div>" +
      '<div class="section"><h2>Weaknesses</h2>' + chipList(s.weaknesses) + "</div>" +
      '<p class="note">See <a href="#/concepts/interpreting-a-rasi">How to interpret a Rāśi</a> for how these layers combine.</p>'
    );
  }

  function renderHouse(id) {
    var h = houses.find(function (x) { return x.id === id; });
    if (!h) return renderNotFound();

    return (
      backLink("#/houses", "All houses") +
      '<div class="detail-head">' +
        '<span class="house-number">' + h.number + "</span>" +
        '<div class="detail-title"><h1>' + esc(h.name) + "</h1>" +
        '<span class="sanskrit">' + esc(h.sanskritName) + "</span></div>" +
      "</div>" +

      '<dl class="fact-grid">' +
        '<div class="fact"><dt>Primary significations</dt><dd>' + esc(h.primarySignifications.join(", ")) + "</dd></div>" +
        '<div class="fact"><dt>Classifications</dt><dd>' +
          h.classifications.map(function (c) {
            return '<a href="#/concepts/house-classifications">' + esc(c) + "</a>";
          }).join(", ") + "</dd></div>" +
        '<div class="fact"><dt>Purushartha</dt><dd><a href="#/concepts/houses-purusharthas">' + esc(h.purushartha) + "</a></dd></div>" +
      "</dl>" +

      '<div class="section"><h2>Represents</h2>' + chipList(h.represents) + "</div>" +

      '<div class="section"><h2>Questions it answers</h2>' +
        '<ul class="plain-list question-list">' +
          h.questionsItAnswers.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") +
        "</ul></div>" +

      '<div class="section"><h2>Natural karakas</h2>' +
        '<ul class="chip-list">' + h.naturalKarakas.map(karakaChip).join("") + "</ul>" +
        (h.notes ? h.notes.map(function (n) { return '<p class="note">' + esc(n) + "</p>"; }).join("") : "") +
      "</div>"
    );
  }

  function renderConceptBlock(b) {
    var html = '<div class="concept-block">';
    if (b.title) html += "<h3>" + esc(b.title) + "</h3>";
    if (b.type === "table") {
      html += '<table class="concept-table"><thead><tr>' +
        b.headers.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        b.rows.map(function (row) {
          return "<tr>" + row.map(function (cell) { return "<td>" + esc(cell) + "</td>"; }).join("") + "</tr>";
        }).join("") +
        "</tbody></table>";
    } else if (b.type === "steps") {
      html += '<ol class="steps-list">' +
        b.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ol>";
    } else if (b.type === "list") {
      if (b.items && b.items.length) {
        html += '<ul class="plain-list">' +
          b.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
      }
      if (b.text) html += "<p>" + esc(b.text) + "</p>";
    } else { /* text */
      html += "<p>" + esc(b.text) + "</p>";
    }
    return html + "</div>";
  }

  function renderConcept(id) {
    var c = concepts.find(function (x) { return x.id === id; });
    if (!c) return renderNotFound();

    return (
      backLink("#/concepts", "All concepts") +
      '<h1 class="page-title">' + esc(c.title) + "</h1>" +
      '<p class="page-sub">' + badge(CATEGORY_LABELS[c.category] || c.category) + "</p>" +
      (c.intro ? "<p>" + esc(c.intro) + "</p>" : "") +
      c.blocks.map(renderConceptBlock).join("")
    );
  }

  function renderNotFound() {
    return '<h1 class="page-title">Not found</h1><p class="page-sub">That page doesn\'t exist. ' +
      '<a href="#/">Go home</a>.</p>';
  }

  /* ---------- search ---------- */

  function buildSearchIndex() {
    var index = [];
    planets.forEach(function (p) {
      index.push({
        type: "Planets", url: "#/planets/" + p.id, title: p.name,
        subtitle: p.sanskritName + " — " + p.essence,
        hay: [p.name, p.sanskritName, p.essence].concat(p.primarySignifications, p.represents, p.psychologicalQualities, p.professions).join(" ").toLowerCase()
      });
    });
    signs.forEach(function (s) {
      index.push({
        type: "Signs", url: "#/signs/" + s.id, title: s.name,
        subtitle: s.sanskritName + " — ruled by " + s.ruler,
        hay: [s.name, s.sanskritName, s.ruler, s.element, s.modality, s.purushartha, s.gender, s.nature].concat(s.characteristics, s.strengths, s.weaknesses).join(" ").toLowerCase()
      });
    });
    houses.forEach(function (h) {
      index.push({
        type: "Houses", url: "#/houses/" + h.id, title: h.name,
        subtitle: h.sanskritName,
        hay: [h.name, h.sanskritName, h.purushartha].concat(h.primarySignifications, h.represents, h.questionsItAnswers, h.naturalKarakas, h.classifications).join(" ").toLowerCase()
      });
    });
    concepts.forEach(function (c) {
      index.push({
        type: "Concepts", url: "#/concepts/" + c.id, title: c.title,
        subtitle: CATEGORY_LABELS[c.category] || c.category,
        hay: (c.title + " " + (c.intro || "") + " " + JSON.stringify(c.blocks)).toLowerCase()
      });
    });
    return index;
  }

  var searchIndex = buildSearchIndex();

  function renderSearch(query) {
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = searchIndex.filter(function (entry) {
      return tokens.every(function (t) { return entry.hay.indexOf(t) !== -1; });
    });

    var html = '<h1 class="page-title">Search results</h1>' +
      '<p class="page-sub">' + hits.length + ' result' + (hits.length === 1 ? "" : "s") +
      " for &ldquo;" + esc(query) + "&rdquo;</p>";

    if (!hits.length) {
      return html + '<p class="no-results">Nothing found — try a planet, sign, house, or theme like "marriage" or "career".</p>';
    }

    ["Planets", "Signs", "Houses", "Concepts"].forEach(function (group) {
      var inGroup = hits.filter(function (h) { return h.type === group; });
      if (!inGroup.length) return;
      html += '<div class="result-group"><h2>' + group + "</h2>" + '<div class="grid">' +
        inGroup.map(function (h) {
          return '<a class="card" href="' + h.url + '">' +
            '<div class="card-top"><span class="card-name">' + esc(h.title) + "</span></div>" +
            '<p class="card-tagline">' + esc(h.subtitle) + "</p></a>";
        }).join("") + "</div></div>";
    });
    return html;
  }

  /* ---------- router ---------- */

  function currentRoute() {
    var hash = location.hash.replace(/^#\/?/, "");
    return hash.split("/").filter(Boolean);
  }

  function setActiveTab(section) {
    document.querySelectorAll(".tabs a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-tab") === section);
    });
  }

  function render() {
    var parts = currentRoute();
    var section = parts[0] || "home";
    var id = parts[1];
    var html;

    if (section === "home") {
      html = renderHome();
    } else if (section === "planets") {
      html = id ? renderPlanet(id)
        : renderList("Planets (Grahas)", "The nine grahas and their natural significations — what each planet represents by nature.", planets.map(planetCard));
    } else if (section === "signs") {
      html = id ? renderSign(id)
        : renderList("Signs (Rāśis)", "The twelve zodiac signs — temperament, element, ruler, modality, strengths and weaknesses.", signs.map(signCard));
    } else if (section === "houses") {
      html = id ? renderHouse(id)
        : renderList("Houses (Bhāvas)", "The twelve houses — the fields of life where planetary energies play out.", houses.map(houseCard));
    } else if (section === "concepts") {
      html = id ? renderConcept(id)
        : renderList("Concepts", "Classifications and frameworks that tie planets, signs and houses together.", concepts.map(conceptCard));
    } else {
      html = renderNotFound();
    }

    app.innerHTML = html;
    setActiveTab(section === "home" ? "" : section);
    window.scrollTo(0, 0);
  }

  /* ---------- events ---------- */

  window.addEventListener("hashchange", function () {
    searchInput.value = "";
    render();
  });

  searchInput.addEventListener("input", function () {
    var q = searchInput.value.trim();
    if (q) {
      app.innerHTML = renderSearch(q);
    } else {
      render();
    }
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      searchInput.value = "";
      render();
      searchInput.blur();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  render();

  /* ---------- PWA: service worker + install prompt ---------- */

  // Service workers need http(s) — skip on file:// (app works there without it).
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator &&
      typeof location !== "undefined" && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {
        // Offline support is a bonus; the app must never break without it.
      });
    });
  }

  var installBtn = document.getElementById("install-btn");
  var deferredInstallPrompt = null;

  if (installBtn) {
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault(); // we'll show our own button instead
      deferredInstallPrompt = e;
      installBtn.hidden = false;
    });

    installBtn.addEventListener("click", function () {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(function () {
        deferredInstallPrompt = null;
        installBtn.hidden = true;
      });
    });

    window.addEventListener("appinstalled", function () {
      installBtn.hidden = true;
    });
  }
})();
