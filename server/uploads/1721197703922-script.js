// document.addEventListener("DOMContentLoaded", function () {
//   const carousel = document.querySelector(".carousel");
//   const slides = document.querySelectorAll(".slide");
//   const controlLinks = document.querySelectorAll(".controls a");
//   const carouselImages = document.querySelectorAll(".carousel img");

//   const drinks = {
//     lychee: {
//       title: "Lychee",
//       description:
//         "Taste of Tropical Bliss: Our Lychee Juice is a celebration of the unique lychee fruit's natural essence...",
//       bgImage: "lycheebg.jpg",
//     },
//     mango: {
//       title: "Mango",
//       description:
//         "Taste of Sunshine: Our Mango Juice is a celebration of the king of fruits...",
//       bgImage: "mangobg.jpg",
//     },
//     orange: {
//       title: "Orange",
//       description:
//         "Harvesting Nature's: Each glass of Orange Juice is a celebration of nature's bountiful harvest...",
//       bgImage: "orangebg.jpg",
//     },
//   };

//   let currentIndex = 0;

//   const updateTextAndBackground = (activeSlideId) => {
//     const drink = drinks[activeSlideId];
//     document.getElementById("drink-title").innerText = drink.title;
//     document.getElementById("drink-description").innerText = drink.description;
//     document.body.style.backgroundImage = `url(${drink.bgImage})`;
//   };

//   const activateSlide = (index) => {
//     slides.forEach((slide) => slide.classList.remove("active"));
//     controlLinks.forEach((link) => link.classList.remove("active"));
//     carouselImages.forEach((img) => img.classList.remove("active"));

//     const activeSlide = slides[index];
//     activeSlide.classList.add("active");
//     controlLinks[index].classList.add("active");
//     carouselImages[index].classList.add("active");

//     const rotationAngle = index * 90; // Adjusted for 3 slides
//     carousel.style.transform = `rotate(-${rotationAngle}deg)`;

//     updateTextAndBackground(activeSlide.id);
//     currentIndex = index;
//   };

//   controlLinks.forEach((control, index) => {
//     control.addEventListener("click", (e) => {
//       e.preventDefault();
//       activateSlide(index);
//     });
//   });

//   carouselImages.forEach((img, index) => {
//     img.addEventListener("click", () => {
//       activateSlide(index);
//     });
//   });

//   // Add event listener for click interaction on the carousel
//   carousel.addEventListener("click", (e) => {
//     const rect = carousel.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;

//     if (clickX < rect.width / 2) {
//       currentIndex = (currentIndex - 1 + slides.length) % slides.length;
//     } else {
//       currentIndex = (currentIndex + 1) % slides.length;
//     }
//     activateSlide(currentIndex);
//   });

//   // Add touch event listeners for swipe interaction on the carousel
//   let startX, endX;

//   carousel.addEventListener("touchstart", (e) => {
//     startX = e.touches[0].clientX;
//   });

//   carousel.addEventListener("touchmove", (e) => {
//     endX = e.touches[0].clientX;
//   });

//   carousel.addEventListener("touchend", () => {
//     if (startX > endX + 50) {
//       currentIndex = (currentIndex + 1) % slides.length;
//     } else if (startX < endX - 50) {
//       currentIndex = (currentIndex - 1 + slides.length) % slides.length;
//     }
//     activateSlide(currentIndex);
//   });

//   slides[0].classList.add("active");
//   controlLinks[0].classList.add("active");
//   carouselImages[0].classList.add("active");
//   updateTextAndBackground(slides[0].id);
// });

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const slides = document.querySelectorAll(".slide");
  const controlLinks = document.querySelectorAll(".controls a");
  const carouselImages = document.querySelectorAll(".carousel img");

  const drinks = {
    lychee: {
      title: "Lychee",
      description:
        "Taste of Tropical Bliss: Our Lychee Juice is a celebration of the unique lychee fruit's natural essence...",
      bgImage: "lycheebg.jpg",
    },
    mango: {
      title: "Mango",
      description:
        "Taste of Sunshine: Our Mango Juice is a celebration of the king of fruits...",
      bgImage: "mangobg.jpg",
    },
    orange: {
      title: "Orange",
      description:
        "Harvesting Nature's: Each glass of Orange Juice is a celebration of nature's bountiful harvest...",
      bgImage: "orangebg.jpg",
    },
  };

  let currentIndex = 0;
  let isDragging = false;
  let startX, currentX;

  const updateTextAndBackground = (activeSlideId) => {
    const drink = drinks[activeSlideId];
    document.getElementById("drink-title").innerText = drink.title;
    document.getElementById("drink-description").innerText = drink.description;
    document.body.style.backgroundImage = `url(${drink.bgImage})`;
  };

  const activateSlide = (index) => {
    slides.forEach((slide) => slide.classList.remove("active"));
    controlLinks.forEach((link) => link.classList.remove("active"));
    carouselImages.forEach((img) => img.classList.remove("active"));

    const activeSlide = slides[index];
    activeSlide.classList.add("active");
    controlLinks[index].classList.add("active");
    carouselImages[index].classList.add("active");

    const rotationAngle = index * 90; // Adjusted for 3 slides
    carousel.style.transform = `rotate(-${rotationAngle}deg)`;
    carousel.style.transition = "transform 1.5s ease-out"; // Adjusted transition timing
    updateTextAndBackground(activeSlide.id);
    currentIndex = index;
  };

  controlLinks.forEach((control, index) => {
    control.addEventListener("click", (e) => {
      e.preventDefault();
      activateSlide(index);
    });
  });

  carouselImages.forEach((img, index) => {
    img.addEventListener("mousedown", (e) => {
      startDrag(e.clientX);
    });

    img.addEventListener("touchstart", (e) => {
      startDrag(e.touches[0].clientX);
    });

    img.addEventListener("mousemove", (e) => {
      moveDrag(e.clientX);
    });

    img.addEventListener("touchmove", (e) => {
      moveDrag(e.touches[0].clientX);
    });

    img.addEventListener("mouseup", endDrag);
    img.addEventListener("touchend", endDrag);
    img.addEventListener("mouseleave", endDrag);
  });

  function startDrag(x) {
    isDragging = true;
    startX = x;
  }

  function moveDrag(x) {
    if (isDragging) {
      currentX = x;
      const difference = startX - currentX;
      if (Math.abs(difference) > 50) {
        // Adjust sensitivity here
        if (difference > 0) {
          currentIndex = (currentIndex + 1) % slides.length;
        } else {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        }
        activateSlide(currentIndex);
        startX = currentX; // Reset start position after slide change
      }
    }
  }

  function endDrag() {
    isDragging = false;
  }

  slides[0].classList.add("active");
  controlLinks[0].classList.add("active");
  carouselImages[0].classList.add("active");
  updateTextAndBackground(slides[0].id);
});
