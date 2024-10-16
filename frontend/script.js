const sections = document.querySelectorAll("section");
const navContainer = document.querySelector(".nav--buttons");
const navLinks = document.querySelector(".nav--links");
const buttonsCarousel = document.querySelectorAll(".carousel--btn");
const carouselItem = document.querySelector(".carousel--item");
const socials = document.querySelector(".social--buttons");
const hero = document.querySelector(".section--hero");
const contact = document.querySelector(".contact");
const carousels = document.querySelectorAll(".carousel");
const galleryGrid = document.querySelector(".showcase--grid");
const galleryProducts = galleryGrid.querySelectorAll(".product");
const mealCarousel = document.querySelector(".meal--carousel");
const currentUrl = new URL(window.location.href);
const shortUrl = currentUrl.protocol + "//" + currentUrl.host;
// functions
function shuffleArray(array) {
  let createdArr = array;
  for (var i = createdArr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = createdArr[i];
    createdArr[i] = createdArr[j];
    createdArr[j] = temp;
  }
  return createdArr;
}
// code

// dynamic section labels
navContainer.innerHTML = "";
let num = 0;
sections.forEach((section, i) => {
  if (section.classList.contains("ignore")) return;
  num++;
  const sectionName = section.classList[0].split("--")[1];
  const sectionDisplayName = section
    .querySelector(".section--title")
    .textContent.toLowerCase();

  navContainer.insertAdjacentHTML(
    "beforeend",
    `<a class="nav--button nav--button--${num}" href="#${sectionName}">${
      sectionDisplayName[0].toUpperCase() + sectionDisplayName.slice(1)
    }</a>`
  );
});
navLinks.addEventListener("click", (event) => {
  if (!event.target.classList.contains("nav--button")) return;
  const sectionName = event.target.href.split("#")[1];
  const section = document.querySelector(`.section--${sectionName}`);
  const sectionPosTop = section.getBoundingClientRect().top;
  scrollTo({
    behavior: "smooth",
    top: sectionPosTop,
  });
});

const carouselScroll = function (
  carousel,
  currentSlide,
  btn = { dataset: { side: "next" } }
) {
  let margins;
  let cssVar;
  let displayAmount;
  if (carousel.dataset.menu === "true") {
    cssVar = "--carousel-menu-size";
    displayAmount = "--menu-display-number";
    margins = "--menu-margin";
  }
  if (carousel.dataset.alt) {
    cssVar = "--carousel-item-size";
    displayAmount = "--carousel-display-number";
    margins = "--carousel-margin";
  }
  if (carousel.dataset.meal === "true") {
    cssVar = "--carousel-meal-size";
    displayAmount = "--meal-display-number";
    margins = "--meal-margin";
  }
  let slideWidth = +getComputedStyle(document.body)
    .getPropertyValue(cssVar)
    .slice(0, -1);
  margins = +getComputedStyle(document.body).getPropertyValue(margins);

  let side = btn.dataset.side;

  let carouselItems = carousel.childElementCount;

  const skippedSlides = getComputedStyle(document.body).getPropertyValue(
    displayAmount
  );

  let maxSlides = carouselItems - skippedSlides;
  if (side === "prev") {
    // cap with counting
    if (currentSlide == 0) return currentSlide;

    currentSlide++;
    carousel.style.transform = `translateX(${
      (slideWidth + margins) * currentSlide
    }%)`;
  }
  if (side === "next") {
    if (-currentSlide === maxSlides) currentSlide = 0;
    else currentSlide--;

    carousel.style.transform = `translateX(${
      (slideWidth + margins) * currentSlide
    }%)`;
  }
  return currentSlide;
};

let currentSlide = 0;
let currentSlideAlt = 0;
let currentSlideMenu = 0;
let currentSlideMeal = 0;
buttonsCarousel.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    let carousel =
      btn.parentNode.parentNode.querySelector(".carousel") ||
      btn.parentNode.parentNode.querySelector(".menu-cards") ||
      btn.parentNode.parentNode.querySelector(".meal--carousel");
    if (carousel.dataset.alt === "alt")
      currentSlideAlt = carouselScroll(carousel, currentSlideAlt, btn);
    else if (carousel.dataset.alt !== "alt")
      currentSlide = carouselScroll(carousel, currentSlide, btn);
    else if (carousel.dataset.menu === "true") {
      currentSlideMenu = carouselScroll(carousel, currentSlideMenu, btn);
    } else if (carousel.dataset.meal === "true") {
      currentSlideMenu = carouselScroll(carousel, currentSlideMeal, btn);
    }
  });
});

const hideContact = function (entry, observer) {
  // if (!entry.isIntersecting) return;
  if (entry[0].isIntersecting === false) {
    socials.classList.remove("hidden");
  }
  if (entry[0].isIntersecting === true) {
    socials.classList.add("hidden");
  }
};
const observer = new IntersectionObserver(hideContact, {
  root: null,
  rootMargin: "-50%",
  threshold: 0,
});
observer.observe(hero);
setInterval(() => {
  if (contact.classList.contains("hidden--label")) {
    contact.classList.remove("hidden--label");
  } else if (contact.classList.contains("hidden--label") === false) {
    contact.classList.add("hidden--label");
  }
}, 10000);

(async function () {
  const dishData = (await (await fetch(shortUrl + "/dishes/")).json()).data;

  const chunkSize = Math.round(dishData.length / 2);

  let chunks = [];
  for (let i = 0; i < dishData.length; i += chunkSize) {
    chunks.push(dishData.slice(i, i + chunkSize));
  }

  for (let i = 0; i <= carousels.length - 1; i++) {
    let carousel = carousels[i];
    const carouselItems = shuffleArray(chunks[i]);

    carousel.innerHTML = "";
    carouselItems.forEach((item) => {
      let innerHTML = `
      <div class="carousel--item">
              <img src="${item.dishUrl}" class="carousel--img" alt="${item.altText}">
                <h3 class="carousel-item-title">${item.altText}</h3>
              <p class="carousel--text">${item.descriptionText}</p>
            </div>`;
      carousel.insertAdjacentHTML("beforeend", innerHTML);
    });
  }
  const shuffledDishData = shuffleArray(dishData).slice(
    0,
    galleryProducts.length
  );

  for (let i = 0; i <= galleryProducts.length - 1; i++) {
    const product = galleryProducts[i];
    const dish = shuffledDishData[i];
    product.querySelector("img").src = dish.dishUrl;
    product.querySelector("img").alt = dish.altText;
  }
  // meals
  const mealRequest = await (await fetch(shortUrl + "/meals/")).json();
  const mealData = mealRequest.data;
  mealCarousel.innerHTML = "";
  mealData.forEach((meal) => {
    let html = `
     <div class="meal--card">
            <div class="meal--img"><img src="${meal.mealImage[0]}" alt="${
      meal.altText
    }"></div>
            <div class="meal--para">
              <h4 class="meal--title">${meal.altText}</h4>
              <p class="meal--text">
               ${meal.descriptionText}
              </p>
              <ul class="serving--type">${meal.mealIngredients.map(
                (ingredient) => {
                  return `
                  <li class="serving--feature">
                  <i class="fa-solid fa-bowl-food"></i>
                  <p class="serving--text">${ingredient}</p>
                  </li>
                  `;
                }
              )}</ul>
            </div>
          </div>
    `;
    html = html.replaceAll(",", "");
    mealCarousel.insertAdjacentHTML("beforeend", html);
  });
  const menuJson = await (await fetch(shortUrl + "/menus/")).json();
  const menuData = shuffleArray(menuJson.data);
  const menuCards = document.querySelector(".menu-cards");
  menuCards.innerHTML = "";
  menuData.forEach((card) => {
    let html = `
     <div class="menu--card">
            <img
              src="${card.menuImage}"
              class="menu--picture"
              alt="${card.altText}"
            />
          </div>
    `;
    menuCards.insertAdjacentHTML("beforeend", html);
  });
  const mealCard = document.querySelectorAll(".meal--card");
  mealCard.forEach((card) => {
    card.addEventListener("mouseenter", (e) => {
      const mealImage = e.target.querySelector(".meal--img img");
      const arrayName = mealImage.alt;
      const mealImages = mealData.filter(
        (meal) => meal.altText === arrayName
      )[0].mealImage;

      const intervalId = setInterval(() => {
        const chosenImage = Math.floor(Math.random() * (mealImages.length - 1));
        mealImage.src = mealImages[chosenImage];
      }, 2000);
      e.target.addEventListener("mouseout", () => {
        clearInterval(intervalId);
        mealImage.src = mealImages[0];
      });
    });
  });
})();

const copyYear = document.querySelector(".copy-year");
copyYear.innerHTML = new Date().getFullYear();

const showcaseButton = document.querySelectorAll(".hero--button");
showcaseButton.forEach((button) => {
  button.addEventListener("click", () => {
    const scrolledSection = document.querySelector(
      ".section--" + button.dataset.section
    );

    scrollTo({
      behavior: "smooth",
      top: scrolledSection.getBoundingClientRect().top,
    });
  });
});
