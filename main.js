document.addEventListener("DOMContentLoaded", () => {
  // ─── Skills infinite scroll ───
  const skillsContainer = document.querySelector(".skills-container");
  if (skillsContainer) {
    const skillBoxes = Array.from(skillsContainer.querySelectorAll(".skill-box"));
    
    // Clone all skill boxes for seamless infinite loop
    skillBoxes.forEach((skillBox) => {
      const clone = skillBox.cloneNode(true);
      skillsContainer.appendChild(clone);
    });
  }

  // ─── Nav: active link on scroll ───
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link, .footer-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector(".navbar")?.classList.remove("active");
    });
  });

  window.addEventListener("scroll", () => {
    let current = "";
    const offset = document.querySelector(".header").offsetHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // ─── Scroll-reveal ───
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // ─── Starfield (black pixels on white) ───
  const canvas = document.getElementById("starfield");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];
  const numStars = 90;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector(".home").offsetHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        size: Math.random() > 0.65 ? 3 : 2,
        speed: Math.random() > 0.5 ? 1 : 0.5,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111111";

    stars.forEach((star) => {
      ctx.fillRect(star.x, star.y, star.size, star.size);
      star.y += star.speed;

      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.floor(Math.random() * canvas.width);
      }
    });

    requestAnimationFrame(drawStars);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createStars();
  });

  resizeCanvas();
  createStars();
  drawStars();
});

function toggleMenu() {
  document.querySelector(".navbar").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("8LhyvtJ8r5V4p7mMY");
});

function sendMail() {
  var params = {
    sendername: document.querySelector("#sendername").value,
    subject:    document.querySelector("#subject").value,
    replyto:    document.querySelector("#replyto").value,
    message:    document.querySelector("#message").value,
  };

  var serviceID  = "service_w09kcub";
  var templateID = "template_ou30u5w";

  emailjs
    .send(serviceID, templateID, params)
    .then(() => {
      alert("Email Sent Successfully!");
    })
    .catch((err) => {
      console.error("EmailJS Error:", err);
      alert("Something went wrong. Please try again.");
    });
}