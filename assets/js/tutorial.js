(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DATA = window.CLASSTRACK_TUTORIAL;
  if (!DATA) return;

  var root = document.getElementById("app-tutorial");
  if (!root) return;

  var roleTabs = root.querySelector(".tutorial-roles");
  var phoneA = root.querySelector(".phone-screen-a");
  var phoneB = root.querySelector(".phone-screen-b");
  var phoneWrap = root.querySelector(".phone-screens");
  var stepTitle = root.querySelector(".tutorial-step-title");
  var stepDesc = root.querySelector(".tutorial-step-desc");
  var stepTags = root.querySelector(".tutorial-step-tags");
  var stepCounter = root.querySelector(".tutorial-counter");
  var figLabel = root.querySelector(".tutorial-fig-label");
  var progressFill = root.querySelector(".tutorial-progress-fill");
  var btnPrev = root.querySelector(".tutorial-prev");
  var btnNext = root.querySelector(".tutorial-next");
  var btnPlay = root.querySelector(".tutorial-play");
  var dotsWrap = root.querySelector(".tutorial-dots");
  var stage = root.querySelector(".tutorial-stage");
  var copyEl = root.querySelector(".tutorial-copy");
  var deviceFrame = root.querySelector(".device-frame");
  var tutorialMain = root.querySelector(".tutorial-main");

  var currentRole = "student";
  var currentStep = 0;
  var autoplayTimer = null;
  var autoplayOn = false;
  var slideDir = 1;
  var activeLayer = "a";
  var preloaded = {};

  function screenImage(role, screen) {
    return "assets/images/screens/" + role + "/" + role + "-" + String(screen).padStart(2, "0") + ".jpg";
  }

  function roleLabel(role) {
    return role === "student" ? "Student" : role === "faculty" ? "Faculty" : "Admin";
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isDesktopRole(role) {
    return DATA[role] && DATA[role].platform === "desktop";
  }

  function getSteps() {
    return DATA[currentRole].steps;
  }

  function preloadImage(src) {
    if (!src || preloaded[src]) return;
    preloaded[src] = true;
    var img = new Image();
    img.src = src;
  }

  function getActiveImg() {
    return activeLayer === "a" ? phoneA : phoneB;
  }

  function getIdleImg() {
    return activeLayer === "a" ? phoneB : phoneA;
  }

  function swapScreen(src, alt) {
    if (!phoneA || !phoneB || !phoneWrap) return;
    var next = getIdleImg();
    var curr = getActiveImg();
    next.src = src;
    next.alt = alt;
    preloadImage(src);

    if (reduceMotion) {
      curr.classList.remove("visible");
      next.classList.add("visible");
      activeLayer = activeLayer === "a" ? "b" : "a";
      return;
    }

    phoneWrap.classList.remove("slide-left", "slide-right");
    phoneWrap.classList.add(slideDir >= 0 ? "slide-right" : "slide-left");
    next.classList.add("visible");
    curr.classList.remove("visible");
    activeLayer = activeLayer === "a" ? "b" : "a";
    window.setTimeout(function () {
      phoneWrap.classList.remove("slide-left", "slide-right");
    }, 550);
  }

  function updateDeviceFrame() {
    var isDesktop = isDesktopRole(currentRole);
    if (deviceFrame) {
      deviceFrame.classList.toggle("desktop-frame", isDesktop);
      deviceFrame.classList.toggle("phone-frame", !isDesktop);
    }
    if (tutorialMain) tutorialMain.classList.toggle("admin-device", isDesktop);
  }

  function renderRoleTabs() {
    roleTabs.innerHTML = "";
    Object.keys(DATA).forEach(function (role) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tutorial-role" + (role === currentRole ? " active" : "");
      btn.textContent = DATA[role].label + " (" + DATA[role].steps.length + ")";
      btn.dataset.role = role;
      btn.style.setProperty("--role-color", DATA[role].color);
      btn.addEventListener("click", function () {
        if (currentRole === role) return;
        currentRole = role;
        currentStep = 0;
        slideDir = 1;
        stopAutoplay();
        if (stage && !reduceMotion) {
          stage.classList.add("role-switch");
          window.setTimeout(function () { stage.classList.remove("role-switch"); }, 400);
        }
        renderAll();
      });
      roleTabs.appendChild(btn);
    });
  }

  function renderDots(total) {
    dotsWrap.innerHTML = "";
    if (total > 20) {
      dotsWrap.style.display = "none";
      return;
    }
    dotsWrap.style.display = "flex";
    for (var i = 0; i < total; i++) {
      (function (index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "tutorial-dot" + (index === currentStep ? " active" : "");
        dot.setAttribute("aria-label", "Go to step " + (index + 1));
        dot.addEventListener("click", function () {
          slideDir = index > currentStep ? 1 : -1;
          currentStep = index;
          stopAutoplay();
          updateStep();
        });
        dotsWrap.appendChild(dot);
      })(i);
    }
  }

  function applyCopy(step, total) {
    var label = (isDesktopRole(currentRole) ? "Desktop" : roleLabel(currentRole)) + " · Screen " + step.screen + " of " + total;
    stepCounter.textContent = "Screen " + step.screen + " of " + total;
    if (figLabel) figLabel.textContent = label;
    if (stepTitle) stepTitle.textContent = step.title;
    if (stepDesc) {
      stepDesc.textContent = step.desc || "";
      stepDesc.hidden = !step.desc;
    }
    if (stepTags) {
      stepTags.hidden = !step.tags || !step.tags.length;
      stepTags.innerHTML = (step.tags || []).map(function (t) {
        return '<span class="tutorial-tag">' + escapeHtml(t) + "</span>";
      }).join("");
    }
  }

  function updateStep() {
    var steps = getSteps();
    var step = steps[currentStep];
    var total = steps.length;
    var next = steps[currentStep + 1];

    progressFill.style.width = ((currentStep + 1) / total * 100) + "%";
    btnPrev.disabled = currentStep === 0;
    btnNext.disabled = currentStep === total - 1;
    renderDots(total);

    if (copyEl && !reduceMotion) {
      copyEl.classList.add("step-changing");
      window.setTimeout(function () {
        applyCopy(step, total);
        copyEl.classList.remove("step-changing");
      }, 220);
    } else {
      applyCopy(step, total);
    }

    swapScreen(screenImage(currentRole, step.screen), step.title + " - ClassTrack " + roleLabel(currentRole));
    if (next) preloadImage(screenImage(currentRole, next.screen));
  }

  function nextStep() {
    if (currentStep < getSteps().length - 1) {
      slideDir = 1;
      currentStep += 1;
      updateStep();
    } else {
      stopAutoplay();
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      slideDir = -1;
      currentStep -= 1;
      updateStep();
    }
  }

  function setPlayButton(playing) {
    if (!btnPlay) return;
    var icon = '<span class="ui-icon" aria-hidden="true"><svg><use href="assets/icons/sprite.svg#i-play"/></svg></span> ';
    btnPlay.innerHTML = playing ? icon + "Pause tour" : icon + "Auto-play tour";
    btnPlay.classList.toggle("playing", playing);
    btnPlay.setAttribute("aria-pressed", playing ? "true" : "false");
  }

  function stopAutoplay() {
    autoplayOn = false;
    if (autoplayTimer) window.clearInterval(autoplayTimer);
    autoplayTimer = null;
    setPlayButton(false);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayOn = true;
    setPlayButton(true);
    autoplayTimer = window.setInterval(function () {
      if (currentStep >= getSteps().length - 1) {
        currentStep = 0;
        slideDir = 1;
        updateStep();
      } else {
        nextStep();
      }
    }, reduceMotion ? 9000 : 4000);
  }

  function renderAll() {
    updateDeviceFrame();
    renderRoleTabs();
    updateStep();
  }

  if (btnNext) btnNext.addEventListener("click", function () { stopAutoplay(); nextStep(); });
  if (btnPrev) btnPrev.addEventListener("click", function () { stopAutoplay(); prevStep(); });
  if (btnPlay) {
    btnPlay.addEventListener("click", function () {
      if (autoplayOn) stopAutoplay();
      else startAutoplay();
    });
  }

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); stopAutoplay(); nextStep(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); stopAutoplay(); prevStep(); }
  });

  renderAll();
})();
