/* ============================================================
   FATHIMA ZUMANA & MOHAMED RIYAZ — NIKKAH INVITATION
   Vanilla JS — gate intro, countdown, scroll reveals,
   floating particles, background music
   ============================================================ */
(function () {
  "use strict";

  var gate        = document.getElementById("gate");
  var gateButton  = document.getElementById("gateButton");
  var invitation  = document.getElementById("invitation");
  var scrollCue   = document.getElementById("scrollCue");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------
     GATE — open the door panels and reveal the invitation
     ---------------------------------------------------------------- */
  function openGate() {
    if (!gate) return;

    // Slide panels apart + dissolve blur
    gate.classList.add("is-open");

    // Reveal invitation content before gate fully fades out
    var revealAt = prefersReducedMotion ? 100 : 820;

    window.setTimeout(function () {
      invitation.classList.add("is-visible");
      invitation.setAttribute("aria-hidden", "false");
      document.body.classList.remove("locked");

      // Move focus into invitation for accessibility
      var hero = document.getElementById("hero");
      if (hero) {
        hero.setAttribute("tabindex", "-1");
        hero.focus({ preventScroll: true });
      }

      // Re-check all reveal elements that are already in the viewport
      // (IntersectionObserver may have fired before the invitation was visible)
      window.setTimeout(function () {
        revealEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          var inView = rect.top < window.innerHeight && rect.bottom > 0;
          if (inView) el.classList.add("is-visible");
        });
      }, 100);
    }, revealAt);
  }

  if (gateButton) {
    document.body.classList.add("locked");
    gateButton.addEventListener("click", openGate);
    gateButton.addEventListener("keyup", function (e) {
      if (e.key === "Enter" || e.key === " ") openGate();
    });
  }

  // Scroll cue → smooth scroll to ayah section
  if (scrollCue) {
    scrollCue.addEventListener("click", function () {
      var ayah = document.getElementById("ayah");
      if (ayah) ayah.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ----------------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
     ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----------------------------------------------------------------
     COUNTDOWN — Nikkah date: 22 November 2026
     ---------------------------------------------------------------- */
  var NIKKAH_DATE = new Date("2026-11-22T12:00:00");

  var elDays  = document.getElementById("cd-days");
  var elHours = document.getElementById("cd-hours");
  var elMins  = document.getElementById("cd-mins");
  var elSecs  = document.getElementById("cd-secs");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tickCountdown() {
    var now  = new Date();
    var diff = NIKKAH_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      elDays.textContent  = "00";
      elHours.textContent = "00";
      elMins.textContent  = "00";
      elSecs.textContent  = "00";
      return;
    }

    var days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins  = Math.floor((diff / (1000 * 60)) % 60);
    var secs  = Math.floor((diff / 1000) % 60);

    if (elDays)  elDays.textContent  = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins)  elMins.textContent  = pad(mins);
    if (elSecs)  elSecs.textContent  = pad(secs);
  }

  if (elDays && elHours && elMins && elSecs) {
    tickCountdown();
    window.setInterval(tickCountdown, 1000);
  }

  /* ----------------------------------------------------------------
     FLOATING PARTICLES — soft gold orbs in the hero
     ---------------------------------------------------------------- */
  if (!prefersReducedMotion) {
    var particlesContainer = document.getElementById("particles");
    if (particlesContainer) {
      var particleCount = 22;
      for (var i = 0; i < particleCount; i++) {
        (function (idx) {
          var p = document.createElement("span");
          p.className = "particle";

          var size     = (Math.random() * 3 + 1).toFixed(1);
          var left     = (Math.random() * 92 + 4).toFixed(1);
          var delay    = (Math.random() * 12).toFixed(2);
          var duration = (Math.random() * 14 + 10).toFixed(1);

          p.style.cssText = [
            "width:"    + size  + "px",
            "height:"   + size  + "px",
            "left:"     + left  + "%",
            "bottom:"   + (Math.random() * 8)  + "%",
            "animation-delay:"    + delay    + "s",
            "animation-duration:" + duration + "s"
          ].join(";");

          particlesContainer.appendChild(p);
        })(i);
      }
    }
  }

  /* ----------------------------------------------------------------
     BACKGROUND MUSIC
     ---------------------------------------------------------------- */
  var audio     = document.getElementById("bg-music");
  var muteBtn   = document.getElementById("mute-btn");
  var iconSound = document.getElementById("icon-sound");
  var iconMuted = document.getElementById("icon-muted");

  var musicStarted = false;

  function setMuteIcon(playing) {
    if (iconSound) iconSound.style.display = playing ? "" : "none";
    if (iconMuted) iconMuted.style.display = playing ? "none" : "";
  }

  function startMusic() {
    if (musicStarted || !audio) return;
    audio.volume = 0.42;
    audio.play()
      .then(function () {
        musicStarted = true;
        setMuteIcon(true);
      })
      .catch(function () {
        // Autoplay blocked — user can tap the mute button
      });
  }

  // Try on page load
  window.addEventListener("load", startMusic);

  // Fallback: first user interaction
  document.addEventListener("click",      startMusic, { once: true });
  document.addEventListener("touchstart", startMusic, { once: true });
  document.addEventListener("scroll",     startMusic, { once: true });

  // Mute / unmute toggle
  if (muteBtn && audio) {
    muteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!musicStarted) {
        startMusic();
        return;
      }
      if (audio.paused) {
        audio.play();
        setMuteIcon(true);
      } else {
        audio.pause();
        setMuteIcon(false);
      }
    });
  }

  /* ----------------------------------------------------------------
     SUBTLE PARALLAX on hero bismillah (passive scroll, respects pref)
     ---------------------------------------------------------------- */
  var heroBismillah = document.querySelector(".hero__bismillah");
  if (!prefersReducedMotion && heroBismillah) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        heroBismillah.style.transform = "translateY(" + Math.min(y * 0.06, 24) + "px)";
      },
      { passive: true }
    );
  }

})();
