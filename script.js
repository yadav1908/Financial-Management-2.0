// Custom cursor effects
var crsr = document.querySelector("#cursor");
var blur = document.querySelector("#cursor-blur");

document.addEventListener("mousemove", function (dets) {
  crsr.style.left = dets.x + "px";
  crsr.style.top = dets.y + "px";
  blur.style.left = dets.x - 100 + "px";
  blur.style.top = dets.y - 100 + "px";
});

// Nav hover effects
var navItems = document.querySelectorAll("#nav h4");
navItems.forEach(function (elem) {
  elem.addEventListener("mouseenter", function () {
    crsr.style.scale = 2.5;
    crsr.style.border = "1px solid var(--primary)";
    crsr.style.backgroundColor = "transparent";
  });
  elem.addEventListener("mouseleave", function () {
    crsr.style.scale = 1;
    crsr.style.border = "0px solid var(--primary)";
    crsr.style.backgroundColor = "var(--primary)";
  });
});

// Card hover effects
var cards = document.querySelectorAll(".card");
cards.forEach(function (card) {
  card.addEventListener("mouseenter", function () {
    crsr.style.scale = 4;
    crsr.style.border = "1px solid white";
    crsr.style.backgroundColor = "transparent";
  });
  card.addEventListener("mouseleave", function () {
    crsr.style.scale = 1;
    crsr.style.border = "0px solid var(--primary)";
    crsr.style.backgroundColor = "var(--primary)";
  });
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Navbar scroll effect
gsap.to("#nav", {
  backgroundColor: "var(--dark)",
  backdropFilter: "blur(10px)",
  duration: 0.5,
  height: "90px",
  padding: "1rem 5%",
  scrollTrigger: {
    trigger: "#nav",
    scroller: "body",
    start: "top -10%",
    end: "top -11%",
    scrub: 1,
  },
});

// Hero section scroll effect
gsap.from("#page1 h1", {
  y: 100,
  opacity: 0,
  duration: 1,
});

gsap.from("#page1 h2", {
  y: 80,
  opacity: 0,
  duration: 0.8,
  delay: 0.2,
});

gsap.from("#page1 p", {
  y: 60,
  opacity: 0,
  duration: 0.8,
  delay: 0.4,
});

// About section animation
gsap.from("#about-us img, #about-us-in", {
  y: 90,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#about-us",
    scroller: "body",
    start: "top 70%",
    end: "top 65%",
    scrub: 1,
  },
});

// Cards animation
gsap.from(".card", {
  scale: 0.8,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".card",
    scroller: "body",
    start: "top 75%",
    end: "top 65%",
    scrub: 1,
  },
});

// Testimonial quotes animation
gsap.from("#colon1", {
  y: -70,
  x: -70,
  opacity: 0,
  scrollTrigger: {
    trigger: "#colon1",
    scroller: "body",
    start: "top 55%",
    end: "top 45%",
    scrub: 4,
  },
});

gsap.from("#colon2", {
  y: 70,
  x: 70,
  opacity: 0,
  scrollTrigger: {
    trigger: "#colon2",
    scroller: "body",
    start: "top 55%",
    end: "top 45%",
    scrub: 4,
  },
});

// Features section heading animation
gsap.from("#page4 h1", {
  y: 50,
  opacity: 0,
  scrollTrigger: {
    trigger: "#page4 h1",
    scroller: "body",
    start: "top 75%",
    end: "top 70%",
    scrub: 3,
  },
});

// Feature elements animation
gsap.from(".elem", {
  y: 100,
  opacity: 0,
  stagger: 0.2,
  duration: 1,
  scrollTrigger: {
    trigger: "#page4",
    scroller: "body",
    start: "top 70%",
    end: "top 60%",
    scrub: 1,
  },
});

// Scroller animation
gsap.to("#scroller-in", {
  x: "-50%",
  duration: 20,
  repeat: -1,
  ease: "none",
});

// Financial data counter animation (example)
function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  const speed = 200;
  
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;
    const increment = target / speed;
    
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(animateCounters, 1);
    } else {
      counter.innerText = target;
    }
  });
}

// Initialize counters when scrolled to
ScrollTrigger.create({
  trigger: ".stats-section",
  start: "top 70%",
  onEnter: animateCounters,
  once: true
});

// Mobile menu toggle (if needed)
const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector("#nav");

menuBtn?.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});