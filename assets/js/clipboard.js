(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var CWS = window.CWS, esc = CWS.esc, store = CWS.store;
  var byId = {}; window.RX_CARDS.forEach(function (c) { byId[c.id] = c; });

  /* ---------- Tabs ---------- */
  var tabs = [$("#tab-board"), $("#tab-live")];
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
    if (tab.id !== "tab-live") pause();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); selectTab(tabs[(i + 1) % 2], true); }
    });
  });
  document.querySelectorAll("[data-goto-board]").forEach(function (a) { a.addEventListener("click", function () { selectTab(tabs[0]); }); });

  /* ---------- Event notes ---------- */
  // Add the per-event note under each board listing
  var evs = (window.CWS_CONFIG.events || []);
  document.querySelectorAll("#board-events .event").forEach(function (li, i) {
    var sorted = evs.filter(function (e) { return new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)); }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    var e = sorted[i]; if (!e || !e.note) return;
    var p = document.createElement("p"); p.className = "note";
    p.textContent = e.note + (e.seats ? " " + e.seats + " seats." : "");
    li.lastElementChild.appendChild(p);
  });

  /* ---------- Day-of sign-in (device only, names only) ---------- */
  var KEY = "cws-signin-" + new Date().toISOString().slice(0, 10);
  var names = [];
  try { names = JSON.parse(store.get(KEY) || "[]"); } catch (e) { names = []; }
  function drawSignin() {
    $("#signin-list").innerHTML = names.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
    $("#signin-count").textContent = names.length;
    store.set(KEY, JSON.stringify(names));
  }
  $("#signin-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = $("#signin-name").value.trim(); if (!v) return;
    names.push(v); $("#signin-name").value = ""; drawSignin(); $("#signin-name").focus();
  });
  $("#signin-export").addEventListener("click", function () {
    var csv = "Name,Date\n" + names.map(function (n) { return '"' + n.replace(/"/g, '""') + '",' + KEY.slice(-10); }).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "sign-in-" + KEY.slice(-10) + ".csv"; a.click();
  });
  $("#signin-clear").addEventListener("click", function () {
    if (names.length && confirm("Clear all " + names.length + " names from this device?")) { names = []; drawSignin(); }
  });
  drawSignin();

  /* ---------- Live session ---------- */
  var routines = window.RX_ROUTINES.slice();
  var params = new URLSearchParams(location.search);
  var single = params.get("card");
  if (single && byId[single]) routines.unshift({ id: "single", name: byId[single].title + " (single card)", cards: [single] });

  var sel = $("#routine");
  sel.innerHTML = routines.map(function (r) { return '<option value="' + r.id + '">' + esc(r.name) + (r.minutes ? ", about " + r.minutes + " min" : "") + '</option>'; }).join("");

  var routine, idx = 0, left = 0, timer = null;
  var prog = $("#ring-prog"), CIRC = 2 * Math.PI * 52;
  prog.style.strokeDasharray = CIRC;

  function card() { return byId[routine.cards[idx]]; }
  function fmt(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function drawTime() {
    $("#time").textContent = fmt(left);
    prog.style.strokeDashoffset = CIRC * (1 - left / card().secs);
  }
  function load(i) {
    idx = Math.max(0, Math.min(routine.cards.length - 1, i));
    var c = card();
    $("#stage-card").innerHTML = CWS.rxFront(c).replace("</div><div class=\"rx-foot\">",
      "</div><ol class=\"stage-steps\">" + c.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol><div class=\"rx-foot\">");
    left = c.secs; drawTime();
    $("#move-of").textContent = "Card " + (idx + 1) + " of " + routine.cards.length;
    var n = byId[routine.cards[idx + 1]];
    $("#up-next").innerHTML = n ? "Up next: <b>" + esc(n.title) + "</b>" : "Last card. Nice work today.";
    $("#dots").innerHTML = routine.cards.map(function (_, k) { return '<i class="' + (k <= idx ? "on" : "") + '"></i>'; }).join("");
    $("#prev").disabled = idx === 0;
    $("#live-announce").textContent = c.title + ". " + c.dose + ".";
  }
  function pause() { clearInterval(timer); timer = null; $("#play").textContent = left === 0 ? "Restart" : "Start"; }
  function play() {
    if (timer) return pause();
    if (left === 0) { left = card().secs; }
    $("#play").textContent = "Pause";
    timer = setInterval(function () {
      left--; drawTime();
      if (left <= 0) {
        clearInterval(timer); timer = null;
        if (idx < routine.cards.length - 1) { load(idx + 1); play(); }
        else { $("#play").textContent = "Restart"; $("#live-announce").textContent = "Session complete."; }
      }
    }, 1000);
  }
  function setRoutine(id) {
    pause();
    routine = routines.filter(function (r) { return r.id === id; })[0] || routines[0];
    load(0);
    $("#play").textContent = "Start";
  }
  sel.addEventListener("change", function () { setRoutine(sel.value); });
  $("#play").addEventListener("click", play);
  $("#next").addEventListener("click", function () { var on = !!timer; pause(); if (idx < routine.cards.length - 1) { load(idx + 1); if (on) play(); } });
  $("#prev").addEventListener("click", function () { var on = !!timer; pause(); load(idx - 1); if (on) play(); });
  $("#fs").addEventListener("click", function () {
    var st = $("#stage");
    if (document.fullscreenElement) document.exitFullscreen();
    else if (st.requestFullscreen) st.requestFullscreen();
  });
  document.addEventListener("fullscreenchange", function () { $("#fs").textContent = document.fullscreenElement ? "Exit full screen" : "Full screen for TV"; });
  document.addEventListener("keydown", function (e) {
    if ($("#panel-live").hidden || /input|select|textarea/i.test(e.target.tagName)) return;
    if (e.key === " " && e.target.tagName !== "BUTTON") { e.preventDefault(); play(); }
    if (e.key === "ArrowRight") $("#next").click();
    if (e.key === "ArrowLeft") $("#prev").click();
  });

  setRoutine(routines[0].id);
  if (single || location.hash === "#live") selectTab(tabs[1]);
})();
