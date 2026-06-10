document.addEventListener("DOMContentLoaded", () => {

  // Skills: clone originals for seamless infinite loop
const skillsContainer = document.querySelector(".skills-container");
if (skillsContainer) {
  const originals = Array.from(skillsContainer.querySelectorAll(".skill-box"));

  // Fill with enough copies to guarantee no gap on any screen width
  // 4 total sets is plenty for any screen
  for (let i = 0; i < 3; i++) {
    originals.forEach((box) => skillsContainer.appendChild(box.cloneNode(true)));
  }

  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      // Width of exactly one set of originals
      const oneSetWidth = originals.reduce((total, box) => {
        const style = getComputedStyle(box);
        const marginRight = parseFloat(style.marginRight) || 0;
        return total + box.offsetWidth + marginRight;
      }, 0);

      const gap = parseFloat(getComputedStyle(skillsContainer).gap) || 0;
      const halfWidth = oneSetWidth + gap * originals.length;

      // Inject a keyframe animation with the exact pixel value
      const styleEl = document.createElement("style");
      styleEl.textContent = `
        @keyframes skills-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${halfWidth}px); }
        }
        .skills-container {
          animation: skills-scroll ${halfWidth / 60}s linear infinite;
        }
      `;
      document.head.appendChild(styleEl);
    });
  });
}



  // Nav scroll spy
  const sections = document.querySelectorAll("section");

  document.querySelectorAll(".nav-link, .footer-nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector(".navbar")?.classList.remove("active");
    });
  });

  window.addEventListener("scroll", () => {
    const offset = document.querySelector(".header").offsetHeight;
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - offset) current = s.id;
    });
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  });

  // Scroll reveal
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  // Starfield
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector(".home").offsetHeight;
  }

  function makeStars() {
    stars = Array.from({ length: 90 }, () => ({
      x: Math.floor(Math.random() * canvas.width),
      y: Math.floor(Math.random() * canvas.height),
      size: Math.random() > 0.65 ? 3 : 2,
      speed: Math.random() > 0.5 ? 1 : 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    stars.forEach((s) => {
      ctx.fillRect(s.x, s.y, s.size, s.size);
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.floor(Math.random() * canvas.width); }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); makeStars(); });
  resize(); makeStars(); draw();
});

function toggleMenu() {
  document.querySelector(".navbar").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => emailjs.init("8LhyvtJ8r5V4p7mMY"));

function sendMail() {
  emailjs.send("service_w09kcub", "template_ou30u5w", {
    sendername: document.querySelector("#sendername").value,
    subject:    document.querySelector("#subject").value,
    replyto:    document.querySelector("#replyto").value,
    message:    document.querySelector("#message").value,
  })
  .then(() => alert("Email Sent Successfully!"))
  .catch((err) => { console.error(err); alert("Something went wrong. Please try again."); });
}