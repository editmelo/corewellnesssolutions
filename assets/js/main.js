(function () {
  "use strict";
  var C = window.CWS_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Shared Rx card markup ---------- */
  function rxFront(card, opts) {
    opts = opts || {};
    var t = window.RX_TYPES[card.type];
    var isAff = card.type === "affirmation";
    var meta = isAff
      ? '<span><b>Take:</b>' + esc(card.take) + '</span><span><b>Refills:</b>' + esc(card.dose) + '</span>'
      : '<span><b>For:</b>' + esc(card["for"]) + '</span><span><b>Dose:</b>' + esc(card.dose) + '</span>';
    var body = isAff
      ? '<div class="rx-ind"><q>' + esc(card.quote) + '</q></div>'
      : '<div class="rx-ind"><b>INDICATION</b>' + esc(card.indication) + '</div>';
    return '' +
      '<article class="rx rx-front" data-type="' + card.type + '"' + (opts.hidden ? ' aria-hidden="true"' : '') + '>' +
        '<div class="rx-inner">' +
          '<div class="rx-head"><span class="rx-glyph" aria-hidden="true">R</span>' +
            '<div class="rx-brand">CORE WELLNESS SOLUTIONS<small>' + esc(t.label.toUpperCase()) + '</small></div>' +
            '<span class="rx-code">' + esc(card.id.replace("-", " · ")) + '</span></div>' +
          '<h3 class="rx-title">' + esc(card.title) + '</h3>' +
          '<hr class="rx-rule">' +
          '<div class="rx-meta">' + meta + '</div>' + body +
          '<div class="rx-foot"><div class="rx-sign"><small>AUTHORIZED BY</small><span>Tavia</span><em>Certified Stretch Specialist</em></div>' +
            (opts.flip ? '<button class="see-reverse" type="button" aria-label="See reverse: how to do ' + esc(card.title) + '">See reverse »</button>' : '') +
          '</div>' +
        '</div>' +
        '<div class="rx-refill"><span>REFILLS: UNLIMITED</span><span>CORE WELLNESS SOLUTIONS LLC</span></div>' +
      '</article>';
  }

  function rxBack(card) {
    var t = window.RX_TYPES[card.type];
    var steps = card.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    return '' +
      '<article class="rx rx-back" data-type="' + card.type + '" aria-hidden="true">' +
        '<div class="rx-inner">' +
          '<div class="rx-head"><span class="rx-glyph" aria-hidden="true">R</span>' +
            '<div class="rx-brand">DIRECTIONS<small>' + esc(t.label.toUpperCase()) + '</small></div>' +
            '<span class="rx-code">' + esc(card.id.replace("-", " · ")) + '</span></div>' +
          '<h3 class="rx-title">' + esc(card.title) + '</h3><hr class="rx-rule">' +
          '<ol>' + steps + '</ol>' +
          (card.caution ? '<p class="caution">' + esc(card.caution) + '</p>' : '') +
          '<div class="rx-foot back-actions">' +
            '<button class="see-reverse" type="button">« Front</button>' +
            '<a href="clipboard.html?card=' + encodeURIComponent(card.id) + '">Do it with a timer</a>' +
          '</div>' +
        '</div>' +
        '<div class="rx-refill"><span>REFILLS: UNLIMITED</span><span>CORE WELLNESS SOLUTIONS LLC</span></div>' +
      '</article>';
  }
  window.CWS = { rxFront: rxFront, rxBack: rxBack, esc: esc, store: store };

  /* ---------- Mobile nav ---------- */
  var toggle = $(".nav-toggle"), nav = $("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }); });
  }

  /* ---------- Contact details from config ---------- */
  var B = C.business || {};
  $$("[data-phone]").forEach(function (el) {
    if (B.phone) { el.href = "tel:" + B.phone.replace(/[^\d+]/g, ""); el.textContent = el.dataset.phone === "label" ? B.phone : el.textContent; }
    else if (el.dataset.fallback === "hide") el.hidden = true;
  });
  $$("[data-email]").forEach(function (el) {
    if (B.email) { el.href = "mailto:" + B.email; if (el.dataset.email === "label") el.textContent = B.email; }
    else el.hidden = true;
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Dual path ---------- */
  var pad = $("#pad");
  var PATHS = {
    org: {
      forText: "Senior living communities & workplaces",
      dose: "Recurring on-site sessions",
      ind: "Residents who move more, fall less and look forward to class. Staff who get a real break too. We bring the equipment; you provide the room.",
      primary: { href: "#proposal", text: "Request a proposal", nav: "Request a Proposal" },
      secondary: { href: "#communities", text: "See programs" },
      other: "me", otherText: "Looking for private sessions instead?"
    },
    me: {
      forText: "Older adults & caregivers",
      dose: "One free 15-minute consult",
      ind: "Feeling stiff, unsteady, or just want to keep doing what you love? Sessions happen at home or in your community, fully clothed, on a table or a chair.",
      primary: { href: "#book", text: "Book a free consult", nav: "Book a Free Consult" },
      secondary: { href: "#individuals", text: "See private sessions" },
      other: "org", otherText: "Booking for a community or workplace?"
    }
  };

  function setPath(path, animate) {
    if (!PATHS[path]) return;
    document.body.dataset.path = path;
    store.set("cws-path", path);
    $$("[data-nav-path]").forEach(function (a) { a.setAttribute("aria-current", a.dataset.navPath === path ? "true" : "false"); });
    $$("[data-path-cta]").forEach(function (a) {
      var p = PATHS[path].primary; a.href = p.href; a.textContent = a.closest(".site-nav") ? p.nav : p.text;
    });
    if (!pad) return;
    var P = PATHS[path];
    $(".rx-title", pad).textContent = "Your prescription";
    $("[data-r=for]", pad).textContent = P.forText;
    $("[data-r=dose]", pad).textContent = P.dose;
    $("[data-r=ind]", pad).textContent = P.ind;
    var a1 = $("[data-r=primary]", pad), a2 = $("[data-r=secondary]", pad), sw = $("[data-r=switch]", pad);
    a1.href = P.primary.href; a1.textContent = P.primary.text;
    a2.href = P.secondary.href; a2.textContent = P.secondary.text;
    sw.textContent = P.otherText; sw.dataset.go = P.other;
    if (!animate) pad.dataset.chosen = "";
    else {
      // Restart the fill-in animation
      delete pad.dataset.chosen; void pad.offsetWidth; pad.dataset.chosen = "";
    }
    $("#pad-status").textContent = "Prescription written for " + P.forText + ".";
  }

  if (pad) {
    $$(".path-btn", pad).forEach(function (b) {
      b.addEventListener("click", function () { setPath(b.dataset.path, true); $("[data-r=primary]", pad).focus({ preventScroll: true }); });
    });
    $("[data-r=switch]", pad).addEventListener("click", function (e) { setPath(e.currentTarget.dataset.go, true); });
    $("[data-r=restart]", pad).addEventListener("click", function () {
      delete pad.dataset.chosen; delete document.body.dataset.path; $(".rx-title", pad).textContent = "Who is this for?"; $(".path-btn", pad).focus();
    });
    $$("[data-nav-path]").forEach(function (a) { a.addEventListener("click", function () { setPath(a.dataset.navPath, false); }); });
    var saved = store.get("cws-path");
    if (saved && PATHS[saved]) setPath(saved, false);
  }

  /* ---------- Intro slideshow ---------- */
  var show = $("#show");
  if (show) {
    var slides = $$(".slide", show), tabsEl = $$(".show-tabs [role=tab]", show);
    var DWELL = 8000, cur = 0, auto = null;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    show.style.setProperty("--dwell", DWELL / 1000 + "s");

    var wide = window.matchMedia("(min-width: 900px)");
    var last = slides.length - 1; // the Rx slide
    function count() { return wide.matches ? slides.length : last; }
    function go(n, focusTab) {
      if (!wide.matches && n === last) { // on small screens the Rx pad sits below the photos
        $("#pad").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        return;
      }
      cur = (n + count()) % count();
      slides.forEach(function (sl, i) {
        var on = i === cur || (!wide.matches && i === last);
        sl.classList.toggle("is-active", on);
        sl.setAttribute("aria-hidden", on ? "false" : "true");
        if ("inert" in sl) sl.inert = !on;
      });
      tabsEl.forEach(function (t, i) {
        t.setAttribute("aria-selected", i === cur); t.tabIndex = i === cur ? 0 : -1;
        t.classList.toggle("done", i < cur);
        // restart the progress animation
        var bar = t.querySelector("i"); bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
      });
      if (focusTab) tabsEl[cur].focus();
    }
    function stop() { clearInterval(auto); auto = null; show.classList.remove("is-playing"); $("#show-pause").setAttribute("aria-label", "Play slideshow"); }
    function start() {
      stop(); show.classList.add("is-playing"); $("#show-pause").setAttribute("aria-label", "Pause slideshow");
      auto = setInterval(function () {
        go(cur + 1);
        if (cur === count() - 1) stop(); // end on the last slide ("Your Rx" on desktop)
      }, DWELL);
    }

    tabsEl.forEach(function (t, i) {
      t.addEventListener("click", function () { stop(); go(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); stop(); go(cur + 1, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); stop(); go(cur - 1, true); }
      });
    });
    $$("[data-step]", show).forEach(function (b) { b.addEventListener("click", function () { stop(); go(cur + +b.dataset.step); }); });
    $$("[data-go]", show).forEach(function (b) { b.addEventListener("click", function () { stop(); go(+b.dataset.go); var pb = $(".path-btn", show); if (pb) pb.focus({ preventScroll: true }); }); });
    $("#show-pause").addEventListener("click", function () { if (auto) stop(); else { if (cur === count() - 1) go(0); start(); } });
    // Any real interaction inside the slides ends autoplay for good
    $(".show-track", show).addEventListener("focusin", stop);
    $(".show-track", show).addEventListener("pointerdown", stop);
    // Swipe on touch screens
    var sx = null;
    show.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    show.addEventListener("touchend", function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) { stop(); go(cur + (dx < 0 ? 1 : -1)); }
    });

    go(0);
    wide.addEventListener && wide.addEventListener("change", function () { stop(); go(0); });
    // A returning visitor who already picked a path lands on their Rx (desktop)
    if (store.get("cws-path") && wide.matches) go(last);
    else if (!reduce) start();
  }

  /* ---------- Rx gallery ---------- */
  var gallery = $("#rx-gallery");
  if (gallery && window.RX_CARDS) {
    var filter = "all", chairOnly = false, expanded = false, PREVIEW = 6;
    var count = $("#rx-count"), more = $("#rx-more");

    function render() {
      var list = window.RX_CARDS.filter(function (c) { return (filter === "all" || c.type === filter) && (!chairOnly || c.chair); });
      var total = list.length;
      if (!expanded && total > PREVIEW) list = list.slice(0, PREVIEW);
      more.hidden = expanded || total <= PREVIEW;
      more.textContent = "Show all " + total + " cards";
      gallery.innerHTML = list.length ? list.map(function (c) {
        return '<div class="flip" data-id="' + c.id + '"><div class="flip-inner">' + rxFront(c, { flip: true }) + rxBack(c) + '</div></div>';
      }).join("") : '<p class="gallery-empty">No cards match those filters yet. Try turning off "Chair-friendly only".</p>';
      count.textContent = total + (total === 1 ? " card" : " cards");
    }
    $$(".chip[data-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        filter = chip.dataset.filter;
        $$(".chip[data-filter]").forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        render();
      });
    });
    more.addEventListener("click", function () {
      expanded = true; render();
      var next = gallery.children[PREVIEW]; if (next) next.querySelector(".see-reverse").focus({ preventScroll: true });
    });
    $("#rx-chair").addEventListener("change", function (e) { chairOnly = e.target.checked; render(); });
    $("#rx-today").addEventListener("click", function () {
      var pool = window.RX_CARDS.filter(function (c) { return !chairOnly || c.chair; });
      var pick = pool[Math.floor(Math.random() * pool.length)];
      filter = "all"; expanded = true;
      $$(".chip[data-filter]").forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.filter === "all" ? "true" : "false"); });
      render();
      var el = gallery.querySelector('[data-id="' + pick.id + '"]');
      gallery.insertBefore(el, gallery.firstChild);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.querySelector(".see-reverse").focus({ preventScroll: true });
    });
    gallery.addEventListener("click", function (e) {
      var btn = e.target.closest(".see-reverse"); if (!btn) return;
      var flip = btn.closest(".flip");
      var flipped = flip.classList.toggle("is-flipped");
      $(".rx-front", flip).setAttribute("aria-hidden", flipped);
      $(".rx-back", flip).setAttribute("aria-hidden", !flipped);
      $(flipped ? ".rx-back .see-reverse" : ".rx-front .see-reverse", flip).focus({ preventScroll: true });
    });
    render();
  }

  /* ---------- Booking (Square) ---------- */
  var bookForm = $("#book-services");
  if (bookForm) {
    var SQ = C.square || {};
    var panel = $("#book-panel");
    function showService() {
      var r = $("input[name=svc]:checked", bookForm); if (!r) return;
      var url = (SQ.services && SQ.services[r.value]) || SQ.bookingUrl;
      $("[data-b=title]", panel).textContent = r.dataset.title;
      $("[data-b=meta]", panel).textContent = r.dataset.meta;
      var go = $("[data-b=go]", panel), frame = $("[data-b=frame]", panel), off = $("[data-b=offline]", panel);
      if (url) {
        go.hidden = false; go.href = url; off.hidden = true;
        frame.hidden = window.innerWidth < 960; // embedded scheduler on desktop, new tab on phones
        if (!frame.hidden && frame.dataset.src !== url) { frame.src = url; frame.dataset.src = url; }
      } else {
        go.hidden = true; frame.hidden = true; off.hidden = false;
      }
    }
    bookForm.addEventListener("change", showService);
    showService();
    var payLink = $("#pay-packages");
    if (payLink) { if (SQ.payments && SQ.payments.packages) payLink.href = SQ.payments.packages; else payLink.hidden = true; }
    var inv = $("#pay-invoice");
    if (inv) { if (SQ.payments && SQ.payments.invoice) inv.href = SQ.payments.invoice; else inv.hidden = true; }
  }

  /* ---------- Generic form sender (non-health forms only) ---------- */
  function sendForm(form, endpoint, okMsg) {
    var status = $(".form-status", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (!endpoint) {
        status.className = "form-status warn";
        status.textContent = "Online requests aren't switched on yet." + (B.phone ? " Please call " + B.phone + "." : "") + (B.email ? " Or email " + B.email + "." : "");
        console.warn("[CWS] Form endpoint missing in assets/js/config.js for", form.id);
        return;
      }
      var btn = $("button[type=submit]", form); btn.disabled = true;
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); status.className = "form-status ok"; status.textContent = okMsg; })
        .catch(function () { status.className = "form-status err"; status.textContent = "That didn't send. Check your connection and try again" + (B.phone ? ", or call " + B.phone : "") + "."; })
        .then(function () { btn.disabled = false; });
    });
  }
  var forms = C.forms || {};
  if ($("#proposal-form")) sendForm($("#proposal-form"), forms.proposal, "Request received. Tavia will reach out within two business days to set up a discovery call.");
  if ($("#seat-form")) sendForm($("#seat-form"), forms.seat, "Seat saved. You'll get a confirmation shortly.");

  /* ---------- Events teaser ---------- */
  var evList = $("[data-events]");
  if (evList) {
    var limit = +evList.dataset.events || 99;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var evs = (C.events || []).filter(function (e) { return new Date(e.date) >= now; }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); }).slice(0, limit);
    evList.innerHTML = evs.length ? evs.map(function (e) {
      var d = new Date(e.date);
      return '<li class="event"><div class="event-date"><small>' + d.toLocaleDateString("en-US", { month: "short" }) + '</small><b>' + d.getDate() + '</b></div>' +
        '<div><h4>' + esc(e.title) + (e.sample ? '<span class="sample-tag">Example</span>' : '') + '</h4>' +
        '<p>' + d.toLocaleDateString("en-US", { weekday: "long" }) + ', ' + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) + '. ' + esc(e.place) + '</p></div></li>';
    }).join("") : '<li class="event"><div></div><div><p>New sessions post here first. Check back soon or book a private session below.</p></div></li>';
    var seatSel = $("#seat-event");
    if (seatSel) seatSel.innerHTML = evs.map(function (e) { return '<option value="' + esc(e.id) + '">' + esc(e.title) + ' (' + new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ')</option>'; }).join("");
  }

  /* ---------- Downloadable documents ---------- */
  var DL = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function docCard(d) {
    var head = (d.step ? '<span class="doc-step">Step ' + d.step + '</span>' : '') + '<span class="doc-who">' + esc(d.who) + '</span>';
    if (!d.ready) {
      return '<article class="doc is-soon">' +
        '<div class="doc-thumb doc-thumb-soon" aria-hidden="true"><span>Coming soon</span></div>' +
        '<div class="doc-body"><div class="doc-tags">' + head + '</div>' +
        '<h3>' + esc(d.title) + '</h3><p>' + esc(d.desc) + '</p>' +
        '<p class="doc-soon-note">The printable version is being finalized. Tavia will bring a copy to your first session.</p></div></article>';
    }
    var name = d.file.split("/").pop();
    return '<article class="doc">' +
      '<a class="doc-thumb" href="' + d.file + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="' + d.thumb + '" alt="" width="420" height="543" loading="lazy"></a>' +
      '<div class="doc-body"><div class="doc-tags">' + head + '</div>' +
      '<h3>' + esc(d.title) + '</h3><p>' + esc(d.desc) + '</p>' +
      '<p class="doc-meta">PDF, ' + d.pages + (d.pages === 1 ? ' page' : ' pages') + '</p>' +
      '<div class="btn-row">' +
        '<a class="btn small" href="' + d.file + '" download="' + name + '">' + DL + 'Download</a>' +
        '<a class="btn small ghost" href="' + d.file + '" target="_blank" rel="noopener">Open to print</a>' +
        (d.online ? '<a class="doc-online" href="' + d.online + '">Or fill it out online</a>' : '') +
      '</div></div></article>';
  }
  $$("[data-docs]").forEach(function (el) {
    var groups = el.dataset.docs.split(",");
    var only = el.dataset.docsIds ? el.dataset.docsIds.split(",") : null;
    var list = (C.documents || []).filter(function (d) { return groups.indexOf(d.group) > -1 && (!only || only.indexOf(d.id) > -1); });
    el.innerHTML = list.map(docCard).join("");
  });

  /* ---------- Google reviews + map ---------- */
  var G = C.google || {};
  var map = $("#gmap");
  if (map) map.src = "https://maps.google.com/maps?q=" + encodeURIComponent(G.mapsQuery || "Avon, Indiana") + "&z=12&output=embed";
  var rv = $("#reviews");
  if (rv) {
    var rating = $("#rating");
    if (G.rating) {
      rating.innerHTML = '<span class="num">' + Number(G.rating).toFixed(1) + '</span><div><div class="stars" aria-hidden="true">' + "★★★★★".slice(0, Math.round(G.rating)) + '</div><span>' + (G.reviewCount || "") + ' Google reviews</span></div>';
      rating.setAttribute("aria-label", "Rated " + G.rating + " out of 5 on Google");
    } else rating.hidden = true;
    rv.innerHTML = (G.reviews || []).map(function (r) {
      return '<figure class="review"><div class="stars" aria-label="' + r.rating + ' out of 5 stars">' + "★★★★★".slice(0, r.rating) + '</div><blockquote>' + esc(r.text) + '</blockquote><cite>' + esc(r.name) + (r.when ? ", " + esc(r.when) : "") + ' on Google</cite></figure>';
    }).join("") || '<p class="review">Reviews from Tavia\'s Google Business Profile appear here. Worked with her? Your words help a neighbor decide.</p>';
    $$("[data-g=profile]").forEach(function (a) { if (G.profileUrl) a.href = G.profileUrl; else a.hidden = true; });
    $$("[data-g=write]").forEach(function (a) { if (G.writeReviewUrl) a.href = G.writeReviewUrl; else a.hidden = true; });
  }
  var areas = $("#areas");
  if (areas && B.serviceArea) areas.innerHTML = B.serviceArea.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("");
})();
