const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initSkillsMarquee();
  initScrollSpy();
  initReveal();
  initStarfield();
  initContactForm();
});

// Theme handling
function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function syncThemeIcon(theme) {
  document.querySelectorAll(".theme-toggle i").forEach((icon) => {
    icon.className = theme === "dark" ? "bx bx-sun" : "bx bx-moon";
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch {}
  syncThemeIcon(theme);
  document.dispatchEvent(new CustomEvent("themechange"));
}

function initTheme() {
  // Theme itself is applied by the inline script in <head>; just sync the icon
  syncThemeIcon(getTheme());
  document.querySelector(".theme-toggle")?.addEventListener("click", () => {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
  });
}

// Mobile menu
function initMenu() {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  if (!navbar || !hamburger) return;

  const setOpen = (open) => {
    navbar.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
  };

  hamburger.addEventListener("click", () => setOpen(!navbar.classList.contains("active")));
  // Close the menu after picking a link (smooth scrolling is handled by CSS)
  navbar.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

// Skills: three extra copies of the set make a seamless loop; the CSS
// animation shifts by exactly one set (-25%), so no measuring is needed
function initSkillsMarquee() {
  const container = document.querySelector(".skills-container");
  if (!container) return;
  const originals = Array.from(container.children);
  for (let i = 0; i < 3; i++) {
    originals.forEach((box) => {
      const clone = box.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      container.appendChild(clone);
    });
  }
}

// Nav scroll spy: highlight the link of the section crossing the top of the viewport
function initScrollSpy() {
  const links = document.querySelectorAll(".nav-link");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-20% 0px -75% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));
}

// Scroll reveal
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// Starfield
function initStarfield() {
  const canvas = document.getElementById("starfield");
  const home = document.querySelector(".home");
  if (!canvas || !home) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  let starColor = "#111";
  let visible = true;
  let frame = null;
  let lastWidth = 0;

  function updateColor() {
    starColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#111";
    if (frame === null) drawFrame(false);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = home.offsetHeight;
  }

  function makeStars() {
    stars = Array.from({ length: 90 }, () => ({
      x: Math.floor(Math.random() * canvas.width),
      y: Math.floor(Math.random() * canvas.height),
      size: Math.random() > 0.65 ? 3 : 2,
      speed: Math.random() > 0.5 ? 1 : 0.5,
    }));
  }

  function drawFrame(move) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = starColor;
    stars.forEach((s) => {
      ctx.fillRect(s.x, s.y, s.size, s.size);
      if (!move) return;
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.floor(Math.random() * canvas.width); }
    });
  }

  function loop() {
    drawFrame(true);
    frame = requestAnimationFrame(loop);
  }

  // Only animate while the home section is on screen and motion is allowed
  function update() {
    const shouldRun = visible && !reducedMotion.matches;
    if (shouldRun && frame === null) {
      frame = requestAnimationFrame(loop);
    } else if (!shouldRun && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Mobile browsers fire resize when the address bar hides; ignore height-only changes
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      resize(); makeStars(); updateColor();
    }, 150);
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }).observe(home);

  reducedMotion.addEventListener("change", update);
  document.addEventListener("themechange", updateColor);

  lastWidth = window.innerWidth;
  resize(); makeStars(); updateColor(); update();
}

// Contact form
function showToast(message, type) {
  const toast = document.getElementById("toast");
  const icon = document.createElement("i");
  icon.className = `bx ${type === "success" ? "bx-check-circle" : "bx-error-circle"}`;
  const text = document.createElement("span");
  text.textContent = message;
  toast.className = `toast ${type}`;
  toast.replaceChildren(icon, text);
  toast.classList.add("show");

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove("show"), 4000);
}

function initContactForm() {
  const form = document.querySelector(".contact-panel form");
  if (!form) return;
  const submitBtn = form.querySelector(".btn-submit");

  if (window.emailjs) emailjs.init("OCWrKwXsQnn2K_X8K");

  // Show the error toast alongside the browser's own validation message
  form.addEventListener("invalid", () => {
    showToast("Please fill out all fields correctly.", "error");
  }, true);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!window.emailjs) {
      showToast("Something went wrong. Please try again.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    emailjs.send("service_df4eosr", "template_v1isyyh", {
      sendername: form.elements.sendername.value,
      subject:    form.elements.subject.value,
      replyto:    form.elements.replyto.value,
      phone:      form.elements.phone.value,
      message:    form.elements.message.value,
    })
    .then(() => {
      showToast("Message sent successfully!", "success");
      form.reset();
    })
    .catch((err) => {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    });
  });
}
