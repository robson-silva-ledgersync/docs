// AI connector pages (card #1310): marks the /ai/ routes so ai-connector.css can hide the developer-portal
// "Request access" header button there. Mintlify loads this on every page; it only toggles one class.
(function () {
  function apply() {
    document.documentElement.classList.toggle("lsai-route", /^\/ai\//.test(window.location.pathname));
  }
  apply();
  ["pushState", "replaceState"].forEach(function (name) {
    var original = window.history[name];
    window.history[name] = function () {
      var result = original.apply(this, arguments);
      apply();
      return result;
    };
  });
  window.addEventListener("popstate", apply);
})();
