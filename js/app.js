(function () {
  "use strict";
  var W = window.WEDDING;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- botanical SVG pieces ---------- */
  function rose(size, grad, x, y) {
    var p = "";
    [0, 72, 144, 216, 288].forEach(function (a) {
      p += '<ellipse cx="0" cy="-30" rx="22" ry="30" fill="url(#' + grad + ')" opacity=".88" stroke="#fff" stroke-opacity=".5" stroke-width=".8" transform="rotate(' + a + ')"/>';
    });
    [36, 108, 180, 252, 324].forEach(function (a) {
      p += '<ellipse cx="0" cy="-17" rx="13" ry="18" fill="#A9727D" opacity=".5" stroke="#fff" stroke-opacity=".4" stroke-width=".6" transform="rotate(' + a + ')"/>';
    });
    p += '<circle r="9" fill="#A9727D"/><path d="M-5 -2Q0 -9 5 -2Q0 4 -5 -2Z" fill="#fff" opacity=".35"/>';
    var s = size / 120;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + p + "</g>";
  }
  function sprig(x, y, rot, len) {
    var g = '<path d="M0 0C' + len * 0.3 + ' -4 ' + len * 0.6 + ' -16 ' + len + ' -40" stroke="#8FA08A" stroke-width="1.6" fill="none"/>';
    for (var i = 1; i <= 7; i++) {
      var t = i / 8, px = len * t, py = -40 * t * t - 4 * t;
      g += '<ellipse cx="' + px + '" cy="' + (py - 9) + '" rx="5" ry="11" fill="#9DB09A" opacity=".85" transform="rotate(-35 ' + px + " " + py + ')"/>';
      g += '<ellipse cx="' + (px + 6) + '" cy="' + (py + 8) + '" rx="5" ry="10" fill="#B7C5B2" opacity=".85" transform="rotate(40 ' + px + " " + py + ')"/>';
      if (i % 2) g += '<circle cx="' + (px + 3) + '" cy="' + (py - 2) + '" r="3" fill="#E3D2A8"/>';
    }
    return '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ')">' + g + "</g>";
  }
  function cornerSVG(cls) {
    return '<svg class="corner ' + cls + '" viewBox="0 0 300 300" aria-hidden="true">' +
      sprig(30, 110, 6, 220) + sprig(110, 30, 84, 200) + sprig(30, 60, 30, 170) +
      rose(130, "gRose", 55, 55) + rose(80, "gBlush", 150, 48) + rose(70, "gMauve", 45, 150) + rose(46, "gBlush", 110, 100) +
      "</svg>";
  }
  function roseSVG(size, grad) {
    return '<svg viewBox="-60 -60 120 120" width="' + size + '" height="' + size + '" aria-hidden="true">' + rose(120, grad || "gBlush", 0, 0) + "</svg>";
  }

  $$("[data-frame]").forEach(function (el) {
    el.innerHTML = cornerSVG("tl") + cornerSVG("tr") + cornerSVG("bl") + cornerSVG("br");
  });
  $$("[data-divider]").forEach(function (el) {
    el.innerHTML = "<i></i>" + roseSVG(28, "gBlush") + "<i></i>";
  });
  $("#closingRose").innerHTML = roseSVG(96, "gRose");

  /* ---------- helpers ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }
  function stamp(iso) { return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var q = encodeURIComponent(W.venueQuery);

  /* ---------- links: maps, calendar, whatsapp ---------- */
  $("#mapFrame").src = "https://www.google.com/maps?q=" + q + "&output=embed";
  $("#dirBtn").href = "https://www.google.com/maps/dir/?api=1&destination=" + q;
  $("#mapBtn").href = "https://www.google.com/maps/search/?api=1&query=" + q;
  $("#gcalBtn").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(W.title) +
    "&dates=" + stamp(W.startISO) + "/" + stamp(W.endISO) +
    "&details=" + encodeURIComponent(W.shareText) + "&location=" + q;
  $("#waBtn").href = "https://wa.me/?text=" + encodeURIComponent(W.whatsappText + "\n\n" + location.href);

  $("#icsBtn").addEventListener("click", function () {
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "BEGIN:VEVENT",
      "UID:" + stamp(W.startISO) + "@wedding-invite", "DTSTAMP:" + stamp(new Date().toISOString()),
      "DTSTART:" + stamp(W.startISO), "DTEND:" + stamp(W.endISO),
      "SUMMARY:" + W.title, "LOCATION:" + W.venueQuery.replace(/,/g, "\\,"),
      "DESCRIPTION:" + W.shareText, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "wedding-invitation.ics";
    document.body.appendChild(a); a.click(); a.remove();
    toast("Calendar file downloaded");
  });

  /* ---------- share / copy ---------- */
  function copyLink() {
    var done = function () {
      $("#copyTxt").textContent = "LINK COPIED"; toast("Link copied");
      setTimeout(function () { $("#copyTxt").textContent = "COPY LINK"; }, 2200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(location.href).then(done, fallback);
    } else fallback();
    function fallback() {
      var t = document.createElement("textarea"); t.value = location.href;
      document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch (e) {}
      t.remove(); done();
    }
  }
  $("#copyBtn").addEventListener("click", copyLink);
  $("#shareBtn").addEventListener("click", function () {
    if (navigator.share) {
      navigator.share({ title: document.title, text: W.shareText, url: location.href }).catch(function () {});
    } else copyLink();
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add("in"); });

  /* ---------- falling petals ---------- */
  function startPetals() {
    var box = $("#petals"), colors = ["#E4C9CC", "#C9A0A6", "#F1DDDF", "#B79BB0", "#E3D2A8"];
    var n = window.innerWidth < 600 ? 14 : 22;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("span"), s = 10 + Math.random() * 14;
      p.className = "petal";
      p.style.cssText = "left:" + Math.random() * 100 + "%;width:" + s + "px;height:" + s * 1.3 + "px;background:" +
        colors[i % colors.length] + ";animation-duration:" + (12 + Math.random() * 12) + "s;animation-delay:-" + Math.random() * 20 +
        "s;--dx:" + Math.round((Math.random() - 0.5) * 240) + "px;--rot:" + Math.round(180 + Math.random() * 360) + "deg";
      box.appendChild(p);
    }
  }

  /* ---------- countdown ---------- */
  var target = new Date(W.startISO).getTime();
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var diff = target - Date.now(), past = diff <= 0, a = Math.abs(diff);
    $("#cdD").textContent = pad(Math.floor(a / 864e5));
    $("#cdH").textContent = pad(Math.floor(a / 36e5) % 24);
    $("#cdM").textContent = pad(Math.floor(a / 6e4) % 60);
    $("#cdS").textContent = pad(Math.floor(a / 1e3) % 60);
    $("#cdLabel").textContent = past ? "Celebrated together for" : "Counting down";
    $("#cdPast").hidden = !past;
  }
  tick(); setInterval(tick, 1000);

  /* ---------- background music (generated with Web Audio, no file needed) ---------- */
  var ctx, master, timer, step = 0, playing = false;
  var chords = [[261.63, 329.63, 392.0, 523.25], [220.0, 261.63, 329.63, 440.0], [174.61, 261.63, 349.23, 440.0], [196.0, 246.94, 392.0, 493.88]];
  var pattern = [0, 1, 2, 3, 2, 1, 3, 2];
  function note(f, t, dur, vol) {
    var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle"; o2.type = "sine"; o.frequency.value = f; o2.frequency.value = f * 2;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); o2.connect(g); g.connect(master);
    o.start(t); o2.start(t); o.stop(t + dur); o2.stop(t + dur);
  }
  function sched() {
    var c = chords[Math.floor(step / 8) % chords.length], t = ctx.currentTime + 0.05;
    note(c[pattern[step % 8]], t, 2.2, 0.12);
    if (step % 8 === 0) note(c[0] / 2, t, 4, 0.1);
    step++;
  }
  function setMusicUI() {
    var b = $("#musicBtn");
    $("#icoOn").hidden = !playing; $("#icoOff").hidden = playing;
    b.setAttribute("aria-pressed", String(playing));
    b.setAttribute("aria-label", playing ? "Mute background music" : "Play background music");
  }
  function startMusic() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || playing) return;
    if (!ctx) {
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.9;
      var d = ctx.createDelay(); d.delayTime.value = 0.38;
      var fb = ctx.createGain(); fb.gain.value = 0.35;
      d.connect(fb); fb.connect(d);
      master.connect(ctx.destination); master.connect(d); d.connect(ctx.destination);
    }
    ctx.resume(); playing = true; sched(); timer = setInterval(sched, 520); setMusicUI();
  }
  function stopMusic() { playing = false; clearInterval(timer); if (ctx) ctx.suspend(); setMusicUI(); }
  $("#musicBtn").addEventListener("click", function () { playing ? stopMusic() : startMusic(); });

  /* ---------- open the invitation ---------- */
  $("#openBtn").addEventListener("click", function () {
    var cover = $("#cover");
    if (cover.classList.contains("opening")) return;
    cover.classList.add("opening");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    $("#musicBtn").hidden = false;
    startMusic();            // allowed: triggered by a click
    startPetals();
    setTimeout(function () { cover.classList.add("gone"); }, 1950);
  });

  /* ---------- gallery + lightbox ---------- */
  var grid = $("#grid"), idx = 0, lb = $("#lightbox"), lbImg = $("#lbImg"), lastFocus;
  W.gallery.forEach(function (g, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", "Open photo: " + g.alt);
    b.className = "reveal"; b.style.transitionDelay = (i % 3) * 0.1 + "s";
    b.innerHTML = '<img src="' + g.src + '" alt="' + g.alt + '" loading="lazy" decoding="async" />';
    b.addEventListener("click", function () { openLb(i); });
    grid.appendChild(b);
    if ("IntersectionObserver" in window) io.observe(b); else b.classList.add("in");
  });
  function showLb() { lbImg.src = W.gallery[idx].src; lbImg.alt = W.gallery[idx].alt; }
  function openLb(i) { idx = i; lastFocus = document.activeElement; showLb(); lb.hidden = false; document.body.classList.add("locked"); $("#lbClose").focus(); }
  function closeLb() { lb.hidden = true; document.body.classList.remove("locked"); if (lastFocus) lastFocus.focus(); }
  function go(d) { idx = (idx + d + W.gallery.length) % W.gallery.length; showLb(); }
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", function (e) { e.stopPropagation(); go(-1); });
  $("#lbNext").addEventListener("click", function (e) { e.stopPropagation(); go(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1);
  });
  var sx = null;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); sx = null;
  });

  /* ---------- RSVP ---------- */
  var form = $("#rsvpForm"), hasDb = !!(W.supabaseUrl && W.supabaseAnonKey);
  $("#rsvpDemo").hidden = hasDb;
  $$('input[name="attending"]', form).forEach(function (r) {
    r.addEventListener("change", function () { $("#guestsWrap").hidden = form.attending.value === "no"; });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#rName").value.trim(), err = $("#rsvpErr");
    err.hidden = true;
    if (!name) { err.hidden = false; $("#rName").focus(); return; }
    var attending = form.attending.value;
    var entry = { name: name, attending: attending, guests: attending === "yes" ? Number($("#rGuests").value) : 0 };
    var btn = $("#rsvpSubmit"); btn.disabled = true; btn.style.opacity = ".6";

    var save;
    if (hasDb) {
      save = fetch(W.supabaseUrl.replace(/\/$/, "") + "/rest/v1/" + W.supabaseTable, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: W.supabaseAnonKey, Authorization: "Bearer " + W.supabaseAnonKey, Prefer: "return=minimal" },
        body: JSON.stringify(entry)
      }).then(function (r) { if (!r.ok) throw new Error("save failed"); });
    } else {
      try {
        var all = JSON.parse(localStorage.getItem("rsvps-demo") || "[]");
        entry.created_at = new Date().toISOString(); all.push(entry);
        localStorage.setItem("rsvps-demo", JSON.stringify(all));
      } catch (x) { /* storage may be blocked; still show success in demo */ }
      save = new Promise(function (r) { setTimeout(r, 500); });
    }
    save.then(function () {
      form.hidden = true;
      $("#doneTitle").textContent = "Thank you, " + name.split(" ")[0] + "!";
      $("#doneMsg").textContent = attending === "yes" ? "We can’t wait to celebrate with you." : "You will be missed — thank you for letting us know.";
      $("#rsvpDone").hidden = false;
    }).catch(function () {
      err.textContent = "Something went wrong. Please try again."; err.hidden = false;
      btn.disabled = false; btn.style.opacity = "";
    });
  });
})();
