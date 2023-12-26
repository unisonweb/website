const one = document.querySelector.bind(document);
const all = document.querySelectorAll.bind(document);

const mql = window.matchMedia("(max-width: 600px)");

if (!mql.matches) {
  scrollAnimation();
}

mql.onchange = (e) => {
  if (!e.matches) {
    scrollAnimation();
  }
}

function scrollAnimation() {
  console.log("YAY I HAVE SCROLL!");
  gsap.registerPlugin(ScrollTrigger);

  // ~*~*~*~*~*~*~*~ SKY ELEMENTS SCROLL TIMELINE ~*~*~*~*~*~*~*~
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".cloud-container",
        start: "top center",
        end: "bottom top",
        ease: "ease-in",
        scrub: 3,
        pin: true,
        // markers: true,
        stagger: 1.5,
      },
    })
    .from("#moon-1", { y: innerHeight * 1.2, x: innerWidth * 0.2 })
    .from("#cloud-1", { y: innerHeight * 1.1, x: innerWidth * 0.3 })
    .from("#cloud-2", { y: innerHeight * 1.0, x: 50 })
    .from("#santa-1", { y: innerHeight * 1.3, x: -innerWidth, duration: 4 })
    .to({}, { duration: 2 });

  // ~*~*~*~*~*~*~*~ GROUND ELEMENTS SCROLL TIMELINE ~*~*~*~*~*~*~*~

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".ground-container",
        start: "center center",
        end: "bottom bottom",
        normalizeScroll: true,
        ease: "ease-in",
        scrub: 3,
        anticipatePin: 1,
        // pin: true,
        pinType: "fixed",
      }
    })
    .from(".stars", { y: innerHeight * 0.2 })
    .from(".left-front-tree", { y: innerHeight * 0.3 }, 0.1)
    .from(".right-front-tree", { y: innerHeight * 0.3 }, "<")
    .from(".left-back-tree", { y: innerHeight * 0.2, x: 50 }, 0.1)
    .from(".right-back-tree", { y: innerHeight * 0.2, x: -50 }, "<")
    .from(".left-back-tree2", { y: innerHeight * 0.2, x: 150 }, 0.2)
    .from(".right-back-tree2", { y: innerHeight * 0.2, x: -150 }, "<")
    .from(".mtns", { y: innerHeight * 0.3 }, 0.1)
    .from(".lt-bkground", { y: innerHeight * 0.3 }, 0.2)
    .from(".left-foreground", { y: innerHeight * 0.2 }, 0.1)
    .from(".right-foreground", { y: innerHeight * 0.2 }, "<")

  // ~*~*~*~*~*~*~*~ MAIN TREE TIMELINE ~*~*~*~*~*~*~*~

  let slowScroll = gsap
    .timeline({
      scrollTrigger: {
        trigger: ".ground-container",
        start: "-=500",
        end: "bottom bottom",
        normalizeScroll: true,
        ease: "ease-in",
        scrub: 3,
        anticipatePin: 1,
      },
    })
    .fromTo(
      ".comet",
      { y: -300, x: innerWidth * 1.1 },
      { y: innerHeight * 0.8, x: -800 }
    )
    .from(".main-tree", { y: innerHeight * 0.85 }, 2)
    .from(".present-back", { y: innerHeight * 0.85 }, 2.3)
    .from(".card", { y: innerHeight * 1.25 }, 2.5);

}
