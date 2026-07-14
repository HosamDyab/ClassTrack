(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var progressBar = document.getElementById("progress");
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");
  var backTop = document.querySelector(".back-top");
  var header = document.querySelector(".site-header");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));

  if (!reduceMotion) document.body.classList.add("motion-ready");

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + "%";
  }

  var navSections = navLinks.map(function (link) {
    var id = link.getAttribute("href").slice(1);
    var el = document.getElementById(id);
    return el ? { link: link, el: el } : null;
  }).filter(Boolean);

  function updateActiveNav() {
    var fromTop = window.scrollY + 110;
    var current = null;
    navSections.forEach(function (entry) {
      if (entry.el.offsetTop <= fromTop) current = entry;
    });
    navLinks.forEach(function (link) {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
    if (current) {
      current.link.classList.add("active");
      current.link.setAttribute("aria-current", "true");
    }
    if (backTop) backTop.classList.toggle("visible", window.scrollY > 600);
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  }

  function closeMobileNav() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("open");
  }

  function scrollToTarget(target) {
    if (!target || !header) return;
    var top = target.getBoundingClientRect().top + window.scrollY - (header.offsetHeight + 16);
    window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateProgress();
  updateActiveNav();

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      siteNav.classList.toggle("open", !expanded);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.pushState(null, "", link.getAttribute("href"));
      closeMobileNav();
    });
  });

  document.querySelectorAll('a[href^="#"]:not(.site-nav a)').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length <= 1) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.pushState(null, "", id);
    });
  });

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  function animateCountUp(el) {
    if (el.dataset.counted === "1") return;
    el.dataset.counted = "1";
    var target = parseFloat(el.getAttribute("data-target"));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    var duration = 1300;
    var startTime = null;
    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = (target * easeOutCubic(progress)).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  function animateDistanceBar(row) {
    if (row.classList.contains("in")) return;
    row.classList.add("in");
    var pctEl = row.querySelector(".dbar-pct");
    if (!pctEl || reduceMotion) return;
    var pct = parseFloat(row.getAttribute("data-pct") || pctEl.textContent);
    if (isNaN(pct)) return;
    var duration = 1100;
    var startTime = null;
    pctEl.textContent = "0%";
    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      pctEl.textContent = (pct * easeOutCubic(progress)).toFixed(1) + "%";
      if (progress < 1) requestAnimationFrame(step);
      else pctEl.textContent = pct.toFixed(1) + "%";
    }
    requestAnimationFrame(step);
  }

  function observeAll(selectors, className, options) {
    var nodes = document.querySelectorAll(selectors);
    if (!nodes.length) return;
    if ("IntersectionObserver" in window && !reduceMotion) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
            observer.unobserve(entry.target);
          }
        });
      }, options);
      nodes.forEach(function (node) { observer.observe(node); });
    } else {
      nodes.forEach(function (node) { node.classList.add(className); });
    }
  }

  observeAll(".reveal, .reveal-stagger", "in", { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  document.querySelectorAll(".countup").forEach(function (el) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCountUp(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      countObserver.observe(el);
    } else {
      animateCountUp(el);
    }
  });

  document.querySelectorAll(".dbar-row").forEach(function (row) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var barObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateDistanceBar(entry.target);
            barObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      barObserver.observe(row);
    } else {
      animateDistanceBar(row);
    }
  });

  var equationTarget = document.querySelector(".equation");
  if (equationTarget && !reduceMotion) {
    var eqCard = equationTarget.closest(".reveal");
    if (eqCard) {
      var eqObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            equationTarget.classList.add("in");
            eqObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      eqObserver.observe(eqCard);
    }
  }

  var glow = document.querySelector(".cursor-glow");
  if (glow && finePointer && !reduceMotion) {
    var gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });
    (function tickGlow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
      requestAnimationFrame(tickGlow);
    })();
  } else if (glow) {
    glow.remove();
  }

  var tiltSelectors = [
    ".pcard", ".feat-card", ".full-feat", ".stack-card", ".metric", ".rcard",
    ".workflow-card", ".rq-card", ".obj-card", ".func-area", ".scan-card",
    ".hero-phone", ".member", ".phase-card", ".limit-card", ".tx-group",
    ".test-card", ".hero-stat", ".download-card"
  ].join(",");

  if (finePointer && !reduceMotion) {
    document.querySelectorAll(tiltSelectors).forEach(function (el) {
      if (el.closest("#app-tutorial")) return;
      el.classList.add("tilt-card");
      el.style.position = el.style.position || "relative";
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = "perspective(900px) rotateX(" + (y * -4) + "deg) rotateY(" + (x * 5) + "deg) translateY(-3px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    var hero = document.querySelector(".hero");
    var heroPhoneWrap = document.querySelector(".hero-phone-wrap");
    if (hero && heroPhoneWrap) {
      hero.addEventListener("mousemove", function (e) {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        heroPhoneWrap.style.transform = "translate(" + (x * 14) + "px, " + (y * 10) + "px)";
      });
      hero.addEventListener("mouseleave", function () { heroPhoneWrap.style.transform = ""; });
    }
  }

  document.querySelectorAll(".btn-primary, .btn-ghost").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (reduceMotion) return;
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement("span");
      ripple.className = "ripple";
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", function () { ripple.remove(); });
    });
  });

  observeAll(".table-wrap, .table-premium", "in", { threshold: 0.2 });
  observeAll(".pipeline", "in", { threshold: 0.3 });
  observeAll(".tx-grid", "in", { threshold: 0.15 });
  observeAll(".metric", "in-view", { threshold: 0.5 });

  document.querySelectorAll(".hero-stat, .tutorial-stage, .predict-card").forEach(function (el) {
    el.classList.add("glass-card");
  });

  document.querySelectorAll("main > section").forEach(function (section, i) {
    if (i === 0 || reduceMotion) return;
    var div = document.createElement("div");
    div.className = "section-divider wrap";
    div.setAttribute("aria-hidden", "true");
    section.parentNode.insertBefore(div, section);
  });
})();
