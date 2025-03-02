document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar a");

  // Smooth scroll
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").replace("#", "");
      const targetSection = document.getElementById(targetId);
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Add active class to the current section
  window.addEventListener("scroll", () => {
    let current = "";
    const offset = document.querySelector(".header").offsetHeight; // Dynamically get the navbar height
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset; // Account for navbar height
      const sectionHeight = section.offsetHeight;
      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").replace("#", "") === current) {
        link.classList.add("active");
      }
    });
  });
});

let lastScrollY = 0;
const navbar = document.querySelector(".header");

// Listen for scroll events
window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY) {
    // Scrolling down
    navbar.style.transform = "translateY(-500px)";
  } else {
    // Scrolling up
    navbar.style.transform = "translateY(0)";
  }

  lastScrollY = currentScrollY;
});

const skillsContainer = document.querySelector(".skills-container");
const skillBoxes = document.querySelectorAll(".skill-box");

// Clone skill boxes for seamless infinite scroll
skillBoxes.forEach((skillBox) => {
  const clone = skillBox.cloneNode(true);
  skillsContainer.appendChild(clone);
});

let scrollAmount = 0;

function scrollSkills() {
  scrollAmount -= 1; // Adjust speed
  const totalScrollWidth = skillsContainer.scrollWidth / 2;

  // Reset scroll position for infinite loop
  if (Math.abs(scrollAmount) >= totalScrollWidth) {
    scrollAmount = 0;
  }

  skillsContainer.style.transform = `translateX(${scrollAmount}px)`;
  requestAnimationFrame(scrollSkills);
}

scrollSkills();

function toggleMenu() {
  document.querySelector(".navbar").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");

  let stars = [];
  const numStars = 100;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector(".home").offsetHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2, // Star movement speed
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      star.y += star.speed; // Move stars down

      // Reset star position when it goes off the screen
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
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

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("8LhyvtJ8r5V4p7mMY"); 
});

function sendMail() {
  var params = {
    sendername: document.querySelector("#sendername").value,
    subject: document.querySelector("#subject").value,
    replyto: document.querySelector("#replyto").value,
    message: document.querySelector("#message").value, 
  };

  var serviceID = "service_w09kcub"; 
  var templateID = "template_ou30u5w"; 

  emailjs.send(serviceID, templateID, params) 
    .then((res) => {
      alert("Email Sent Successfully!");
    })
    .catch((err) => {
      console.error("EmailJS Error:", err); 
      alert("Something went wrong. Please try again.");
    });
}