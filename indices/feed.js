/* ============================================================================
 * tradeai.cl/indices/feed.js — FUENTE ÚNICA de índices de la Suite TradeAI
 * Todos los repos cargan este archivo y llaman window.TAIIndices.get().
 * Cambiás las fuentes acá una vez y cambia en toda la suite.
 *   usdclp     = USD/CLP tiempo real (Google Finance intradía) con fallback Observado
 *   usdclpObs  = USD/CLP Observado (Banco Central vía mindicador)
 *   uf, tpm, euro = Banco Central vía mindicador
 * Para conectar un feed de pago (Bloomberg/TradingView), reemplazás las URLs aquí.
 * ========================================================================== */
(function () {
  var MINDICADOR = "https://mindicador.cl/api";
  var SPOT_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjzyA3DLGwzLxDt8hmft80NqWOQKaMVpGIwBptjSuQIxcnizWDj5Fn3XOjXhg6OAKdlinckEW1vZ5d/pub?output=csv";

  function parseSpot(t) {
    var f = String(t).split(/\r?\n/)[0].replace(/"/g, "").trim();
    var v = parseFloat(f.replace(/\./g, "").replace(",", "."));
    return (isFinite(v) && v > 0) ? v : null;
  }

  function get() {
    return Promise.all([
      fetch(MINDICADOR).then(function (r) { return r.json(); }).catch(function () { return null; }),
      fetch(SPOT_CSV).then(function (r) { return r.text(); }).then(parseSpot).catch(function () { return null; })
    ]).then(function (a) {
      var d = a[0] || {}, spot = a[1];
      var obs = d.dolar && d.dolar.valor;
      return {
        usdclp: spot || obs || null,
        usdclpObs: obs || null,
        uf: (d.uf && d.uf.valor) || null,
        tpm: (d.tpm && d.tpm.valor) || null,
        euro: (d.euro && d.euro.valor) || null,
        fecha: d.fecha || null,
        ts: Date.now()
      };
    });
  }

  window.TAIIndices = { get: get };
})();
