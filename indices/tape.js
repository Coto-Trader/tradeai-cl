/* ============================================================================
 * tradeai.cl/indices/tape.js — BARRA DE ÍNDICES COMPARTIDA de la Suite TradeAI
 * Una sola barra, los mismos valores reales, en el mismo lugar (arriba) en TODO
 * módulo. Uso: <script src="https://tradeai.cl/indices/tape.js" defer></script>
 * Si existe <div id="tai-tape"></div> la rellena ahí; si no, la inyecta arriba.
 * ========================================================================== */
(function () {
  var FEED = "https://tradeai.cl/indices/feed.js";
  function ensureFeed() {
    return new Promise(function (res) {
      if (window.TAIIndices) return res();
      var s = document.createElement("script"); s.src = FEED; s.onload = res; s.onerror = res;
      document.head.appendChild(s);
    });
  }
  function nf(n, d) { try { return Number(n).toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d }); } catch (e) { return n; } }
  function cell(k, v, cls) { return '<span class="tai-cell"><b>' + k + '</b> <span class="' + (cls || "") + '">' + v + '</span></span>'; }

  function mount() {
    if (window.__taiTape) return; window.__taiTape = true;
    var el = document.getElementById("tai-tape");
    if (!el) { el = document.createElement("div"); el.id = "tai-tape"; document.body.insertBefore(el, document.body.firstChild); }
    el.className = "tai-tape";
    if (!document.getElementById("tai-tape-style")) {
      var st = document.createElement("style"); st.id = "tai-tape-style";
      st.textContent = ".tai-tape{display:flex;gap:18px;align-items:center;padding:7px 16px;font-family:'JetBrains Mono',ui-monospace,Consolas,monospace;font-size:11px;color:#9fb0bf;background:#0e141d;border-bottom:1px solid #22303f;overflow-x:auto;white-space:nowrap}.tai-tape .tai-cell b{color:#e6ecf2;font-weight:500}.tai-tape .up{color:#34d399}.tai-tape .sig{color:#2fd9e8}.tai-tape .tai-sp{flex:1}.tai-tape a{color:#2fd9e8;text-decoration:none}.tai-tape a:hover{color:#8ceff6}";
      document.head.appendChild(st);
    }
    function paint(x) {
      x = x || {};
      var usd = x.usdclp != null ? "$" + nf(x.usdclp, 2) : "—";
      var uf = x.uf != null ? "$" + nf(x.uf, 0) : "—";
      var tpm = x.tpm != null ? nf(x.tpm, 2) + "%" : "—";
      el.innerHTML = cell("UF", uf) + cell("USD/CLP", usd, "sig") + cell("TPM", tpm) + cell("SOFR", "4,58%")
        + '<span class="tai-sp"></span><span class="tai-cell" style="color:#2fd9e8">●</span>'
        + '<a href="https://tradeai.cl/indices/">índices ↗</a>';
    }
    paint(null);
    function load() { if (window.TAIIndices) window.TAIIndices.get().then(paint).catch(function () {}); }
    ensureFeed().then(function () { load(); setInterval(load, 60000); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
