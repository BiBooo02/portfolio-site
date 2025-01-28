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

