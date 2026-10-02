// AI connector pages (card #1310): marks the /ai/ routes so ai-connector.css can hide the developer-portal
// "Request access" header button there, and on those routes opens email links in the same tab. Mintlify gives
// email links target=_blank (the header's Support link too), and that new tab stays empty: a "blank page".
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
  document.addEventListener("click", function (event) {
    if (!document.documentElement.classList.contains("lsai-route") || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target && event.target.closest ? event.target.closest('a[href^="mailto:"]') : null;
    if (!link || link.getAttribute("target") !== "_blank") return;
    event.preventDefault();
    window.location.href = link.getAttribute("href");
  }, true);
})();
