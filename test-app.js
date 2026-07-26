/* Headless smoke test: renders every route of app.js with a stub DOM. */
const assert = require("assert");

const APP = "./app.js";
const DATAJS = "./data.js";

function load(route) {
  delete require.cache[require.resolve(DATAJS)];
  delete require.cache[require.resolve(APP)];

  const appEl = { innerHTML: "" };
  const searchEl = { value: "", addEventListener() {}, focus() {}, blur() {} };

  global.window = { addEventListener() {}, scrollTo() {} };
  global.location = { hash: route };
  global.document = {
    getElementById: (id) => (id === "app" ? appEl : searchEl),
    querySelectorAll: () => [],
    addEventListener() {},
    activeElement: null,
  };

  require(DATAJS);
  require(APP); // IIFE runs render() for the initial route
  return appEl.innerHTML;
}

let failures = 0;
function check(route, mustContain) {
  let html;
  try {
    html = load(route);
  } catch (e) {
    console.error(`FAIL ${route} — threw: ${e.message}`);
    failures++;
    return;
  }
  for (const needle of [].concat(mustContain)) {
    if (!html.includes(needle)) {
      console.error(`FAIL ${route} — missing: ${JSON.stringify(needle)}`);
      failures++;
      return;
    }
  }
  for (const bad of ["undefined", "NaN", "[object Object]"]) {
    if (html.includes(bad)) {
      console.error(`FAIL ${route} — contains stray ${bad}`);
      failures++;
      return;
    }
  }
  console.log(`ok   ${route || "(home)"}`);
}

const data = (() => {
  delete require.cache[require.resolve(DATAJS)];
  global.window = {};
  require(DATAJS);
  return global.window.APP_DATA;
})();

// Home + lists
check("", ["Jyotish Reference", "who", "how", "where"]);
check("#/planets", data.planets.map((p) => p.name));
check("#/signs", ["Mesha", "Meena", "Vrischika"]);
check("#/houses", ["Tanu Bhava", "Vyaya Bhava"]);
check("#/concepts", data.concepts.map((c) => c.title));

// Every detail page
data.planets.forEach((p) =>
  check(`#/planets/${p.id}`, [
    p.name, p.sanskritName, p.essence,
    p.represents[0].replace(/'/g, "&#39;"), // app HTML-escapes apostrophes
    p.professions[0],
  ]));
data.signs.forEach((s) =>
  check(`#/signs/${s.id}`, [s.name, s.sanskritName, s.ruler, s.element, s.characteristics[0], s.weaknesses[0]]));
data.houses.forEach((h) =>
  check(`#/houses/${h.id}`, [h.name, h.sanskritName, h.represents[0], h.questionsItAnswers[0], h.naturalKarakas[0].split(" ")[0]]));
data.concepts.forEach((c) => check(`#/concepts/${c.id}`, [c.title]));

// Cross-links
check("#/signs/aries", ['href="#/planets/mars"']);                    // ruler → planet
check("#/planets/mars", ['href="#/signs/aries"', 'href="#/signs/scorpio"']); // planet → ruled signs
check("#/planets/mars", ['href="#/houses/house-3"', 'href="#/houses/house-6"']); // planet → karaka houses
check("#/houses/house-2", ['href="#/planets/jupiter"', "(wealth)"]);  // karaka + qualifier kept
check("#/houses/house-1", ['href="#/planets/sun"', "Ascendant Lord"]); // note preserved
check("#/houses/house-6", ['href="#/concepts/house-classifications"']); // classification → concept
check("#/signs/leo", ['href="#/concepts/interpreting-a-rasi"']);

// 404s
check("#/bogus", ["Not found"]);
check("#/planets/bogus", ["Not found"]);
check("#/signs/bogus", ["Not found"]);
check("#/houses/bogus", ["Not found"]);
check("#/concepts/bogus", ["Not found"]);

console.log(failures ? `\n${failures} FAILURE(S)` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
